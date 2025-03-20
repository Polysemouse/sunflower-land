import { isTouchDevice } from "features/world/lib/device";
import { CropsAndChickensScene } from "../CropsAndChickensScene";
import {
  AVAILABLE_ABILITIES,
  CropsAndChickensAbilityName,
} from "../../CropsAndChickensUpgrades";
import { PIXEL_SCALE } from "features/game/lib/constants";

const BUTTON_RADIUS = 28;

interface Props {
  scene: CropsAndChickensScene;
  abilityName: CropsAndChickensAbilityName;
  x: number;
  y: number;
  tempText: string;
  hotkey: string;
  cooldownDuration: number;
  effectDuration: number;
  callback: () => void;
}

export class PowerSkillButtonContainer extends Phaser.GameObjects.Container {
  scene: CropsAndChickensScene;
  buttonBase: Phaser.GameObjects.Image;
  buttonBaseMasked: Phaser.GameObjects.Image;
  buttonBaseMask: Phaser.GameObjects.Graphics;
  icon: Phaser.GameObjects.Image;
  tempText: Phaser.GameObjects.Text;
  hotkeyText?: Phaser.GameObjects.Text;

  x: number;
  y: number;

  cooldownDuration: number;
  effectDuration: number;
  hotkey: string;
  hotkeyListener: (event: KeyboardEvent) => void;

  isPointerOverButton = false;
  isOnEffectOrCooldown = true;

  constructor({
    scene,
    abilityName,
    x,
    y,
    tempText,
    hotkey,
    cooldownDuration,
    effectDuration,
    callback,
  }: Props) {
    super(scene, x, y);
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.hotkey = hotkey;
    this.cooldownDuration = cooldownDuration;
    this.effectDuration = effectDuration;

    this.buttonBase = scene.add
      .image(0, 0, "power_skill_button_base_disabled")
      .setScale(PIXEL_SCALE)
      .setAlpha(0.25)
      .setInteractive({
        cursor: "pointer",
      });
    this.buttonBaseMasked = scene.add
      .image(0, 0, "power_skill_button_base_disabled")
      .setScale(PIXEL_SCALE);
    this.buttonBaseMask = scene.add.graphics().setVisible(false);

    this.icon = scene.add
      .image(0, 0, AVAILABLE_ABILITIES[abilityName].iconKey)
      .setScale(PIXEL_SCALE);

    this.tempText = scene.add
      .text(0, 0, tempText, {
        fontSize: "16px",
        fontFamily: "Basic",
        color: "#000000",
        align: "center",
        stroke: "#ffffff",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // draw hotkey text above the button if it is not a touch device
    if (!isTouchDevice()) {
      this.hotkeyText = scene.add
        .text(0, -BUTTON_RADIUS, hotkey, {
          fontSize: "30px",
          fontFamily: "Basic",
          color: "#000000",
          align: "center",
          stroke: "#ffffff",
          strokeThickness: 4,
        })
        .setOrigin(0.5);
    }

    this.buttonBase.on("pointerover", () => {
      this.isPointerOverButton = true;
    });

    this.buttonBase.on("pointerout", () => {
      this.isPointerOverButton = false;
    });

    const tryActivateButton = () => {
      if (scene.isDead) return;
      if (this.isOnEffectOrCooldown) return;

      this.disableButton();
      this.startEffect();

      callback();
    };

    // hotkey activation
    this.hotkeyListener = () => {
      tryActivateButton();
    };
    scene.input.keyboard?.on("keydown-" + hotkey, this.hotkeyListener);

    this.buttonBase.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (isTouchDevice()) scene.buttonPointerIds.push(pointer.id);

      tryActivateButton();
    });

    // disable buttons initially
    this.disableButton();

    // add all the elements to the container
    this.add(this.buttonBase);
    this.add(this.buttonBaseMasked);
    this.add(this.icon);
    this.add(this.tempText);
    if (this.hotkeyText) this.add(this.hotkeyText);

    // add the container to the scene
    scene.add.existing(this);

    // ignore power skill button in main camera
    scene.cameras.main.ignore(this);
  }

  destroy(fromScene?: boolean) {
    this.scene.input.keyboard?.off(
      "keydown-" + this.hotkey,
      this.hotkeyListener,
    );
    super.destroy(fromScene);
  }

  disableButton = () => {
    if (this.buttonBase.input) this.buttonBase.input.cursor = "default";
    if (this.isPointerOverButton) this.scene.input.setDefaultCursor("default");

    this.isOnEffectOrCooldown = true;
    this.buttonBaseMasked
      .setAlpha(0.75)
      .setMask(this.buttonBaseMask.createGeometryMask());
    this.icon.setAlpha(0.1);
    this.tempText.setAlpha(0.5);
  };

  drawProgress = (progress: number) => {
    this.buttonBaseMask
      .clear()
      .fillStyle(0x000000)
      .beginPath()
      .moveTo(this.x, this.y)
      .arc(
        this.x,
        this.y,
        BUTTON_RADIUS * 2,
        Phaser.Math.DegToRad(270),
        Phaser.Math.DegToRad(270 + 360 * progress),
        false,
      )
      .lineTo(this.x, this.y)
      .closePath()
      .fillPath();
  };

  startCooldown = () => {
    this.buttonBase.setTexture("power_skill_button_base_disabled");
    this.buttonBaseMasked.setTexture("power_skill_button_base_disabled");

    const dummy = { progress: 0 };
    this.scene.tweens.add({
      targets: dummy,
      progress: 1,
      duration: this.cooldownDuration,
      onUpdate: (tween) => {
        this.drawProgress(tween.progress);
      },
      onComplete: () => {
        // play ready sound
        if (this.scene.isRulesRead) {
          const skillReadySound = this.scene.sound.add("skill_ready");
          skillReadySound.play({ volume: 0.4 });
        }

        // restore button state
        this.isOnEffectOrCooldown = false;
        this.buttonBase.setTexture("power_skill_button_base_enabled");
        this.buttonBaseMasked
          .setAlpha(1)
          .setTexture("power_skill_button_base_enabled");
        this.icon.setAlpha(0.2);
        this.tempText.setAlpha(1.0);
        this.buttonBaseMasked.clearMask();

        // restore cursor
        if (this.buttonBase.input) this.buttonBase.input.cursor = "pointer";
        if (this.isPointerOverButton)
          this.scene.input.setDefaultCursor("pointer");
      },
    });
  };

  startEffect = () => {
    const dummy = { progress: 0 };
    this.scene.tweens.add({
      targets: dummy,
      progress: 1,
      duration: this.effectDuration,
      onUpdate: (tween) => {
        this.drawProgress(1 - tween.progress);
      },
      onComplete: () => {
        this.startCooldown();
      },
    });
  };
}
