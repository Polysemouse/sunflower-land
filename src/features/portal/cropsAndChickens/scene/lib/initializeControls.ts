import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { isTouchDevice } from "features/world/lib/device";
import { CropsAndChickensScene } from "../CropsAndChickensScene";
import { JOYSTICK_RADIUS } from "../../CropsAndChickensConstants";
import { killPlayer } from "./killPlayer";
import { depositCrops } from "./depositCrops";
import { killNormalChickensAroundPlayer } from "./killNormalChickensAroundPlayer";

const POWER_SKILL_BUTTON_SIZE = 28;
const POWER_SKILL_BUTTON_MARGIN = 9;
const POWER_SKILL_BUTTON_ALPHA = 0.3;
const PROGRESS_ARC_LINE_WIDTH = 4;
const PROGRESS_ARC_OFFSET = 5;

const TOTAL_BUTTONS = 4;

// active pointer IDs for power skill buttons
let buttonPointerIds: number[] = [];

/**
 * Gets the joystick default position.
 * @param scene The CropsAndChickensScene scene.
 */
const joystickDefaultPosition = (scene: CropsAndChickensScene) => {
  return {
    x: scene.cameras.main.centerX,
    y: scene.cameras.main.centerY + scene.cameras.main.height * 0.3,
  };
};

/**
 * Initializes the joystick.
 * @param scene The CropsAndChickensScene scene.
 */
const initializeJoystick = (scene: CropsAndChickensScene) => {
  const { centerX, centerY } = scene.cameras.main;

  const idleOpacity = 0.4;
  const joystickBase = scene.add
    .circle(0, 0, JOYSTICK_RADIUS, 0x000000, 0.2)
    .setAlpha(idleOpacity);
  const joystickThumb = scene.add
    .circle(0, 0, JOYSTICK_RADIUS / 2, 0xffffff, 0.2)
    .setAlpha(idleOpacity);

  const joystick = new VirtualJoystick(scene, {
    x: 0,
    y: 0,
    base: joystickBase,
    thumb: joystickThumb,
    forceMin: 0,
  });
  scene.joystick = joystick;

  // set joystick to default position
  const defaultPosition = joystickDefaultPosition(scene);
  joystick.setPosition(defaultPosition.x, defaultPosition.y);

  // ignore joystick in main camera
  scene.cameras.main.ignore(joystickBase);
  scene.cameras.main.ignore(joystickThumb);

  // update joystick opacity if joystick is active
  let wasJoystickActive = false;
  (joystick as any).on("update", () => {
    const isJoystickActive = joystick.force > 0;
    if (isJoystickActive === wasJoystickActive) return;

    wasJoystickActive = isJoystickActive;
    if (!isJoystickActive) return;

    joystickBase.setAlpha(1.0);
    joystickThumb.setAlpha(1.0);
  });

  // set joystick position on pointer down
  scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    if (buttonPointerIds.includes(pointer.id)) return;
    if (!!joystick.pointer?.id && pointer.id !== joystick.pointer?.id) return;

    const setPositionX = centerX + (pointer.x - centerX);
    const setPositionY = centerY + (pointer.y - centerY);

    joystickBase.setAlpha(1.0);
    joystickThumb.setAlpha(1.0);
    joystick.setPosition(setPositionX, setPositionY);
  });

  // reset joystick position and opacity on pointer up
  scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
    // remove pointer from active button pointer IDs
    buttonPointerIds = buttonPointerIds.filter((id) => id !== pointer.id);

    // reset joystick position and opacity if pointer is not active
    if (joystick.pointer?.id) return;

    joystickBase.setAlpha(idleOpacity);
    joystickThumb.setAlpha(idleOpacity);

    const defaultPosition = joystickDefaultPosition(scene);
    joystick.setPosition(defaultPosition.x, defaultPosition.y);
  });
};

//TODO: Implement power skill buttons
const initializePowerSkillButtons = (scene: CropsAndChickensScene) => {
  initializePowerSkillButton(
    scene,
    "crop_deposit_arrow",
    "slow\nchickens",
    () => {
      const skillSound = scene.sound.add("skill_slow_down");
      skillSound.play({ volume: 0.8 });
      const tintColor = 0x7f8fff;

      scene.normalChickens.forEach((chicken) => {
        chicken.chicken.setTint(tintColor);
      });
      scene.hunterChicken?.chicken.setTint(tintColor);

      scene.enemySpeedMultiplier = 0.5;
      scene.events.emit("enemySpeedMultiplierChanged", 0.5);
      scene.time.delayedCall(10000, () => {
        scene.normalChickens.forEach((chicken) => {
          chicken.chicken.clearTint();
        });
        scene.hunterChicken?.chicken.clearTint();

        scene.enemySpeedMultiplier = 1;
        scene.events.emit("enemySpeedMultiplierChanged", 1);
      });
    },
    0,
    15000,
    20000,
  );
  initializePowerSkillButton(
    scene,
    "crop_deposit_arrow",
    "kill nearby\nnormal\nchickens",
    () => {
      killNormalChickensAroundPlayer(scene, 5);
    },
    1,
    1000,
    10000,
  );
  initializePowerSkillButton(
    scene,
    "crop_deposit_arrow",
    "deposit\ncrops",
    () => {
      depositCrops(scene);
    },
    2,
    1000,
    15000,
  );
  initializePowerSkillButton(
    scene,
    "crop_deposit_arrow",
    "suicide",
    () => {
      killPlayer(scene, "Normal Chicken");
    },
    3,
    2000,
    3000,
  );
};

/**
 * Initializes a power skill button in the given scene.
 *
 * @param scene - The scene where the button will be added.
 * @param imageKey - The key of the image to be used for the button.
 * @param text - The text to be displayed on the button.
 * @param callback - The callback function to be executed when the button is pressed.
 * @param buttonIndex - The index of the button, used to determine its position.
 * @param effectDuration - The duration of the effect in milliseconds.
 * @param cooldownDuration - The duration of the cooldown in milliseconds.
 * @returns The created skill button.
 */
const initializePowerSkillButton = (
  scene: CropsAndChickensScene,
  imageKey: string,
  text: string,
  callback: (pointer: Phaser.Input.Pointer) => void,
  buttonIndex: number,
  effectDuration: number,
  cooldownDuration: number,
) => {
  // flag to track if the pointer is over the button
  // used for changing the cursor style
  let isPointerOverButton = false;

  // get the position of the button
  const { width, height } = scene.cameras.main;
  let buttonX, buttonY;
  if (isTouchDevice()) {
    // arrange buttons in a column on the right side of the screen from bottom to top
    buttonX = width - POWER_SKILL_BUTTON_SIZE - POWER_SKILL_BUTTON_MARGIN;
    buttonY =
      height -
      POWER_SKILL_BUTTON_SIZE * (2 * buttonIndex + 3) -
      POWER_SKILL_BUTTON_MARGIN * (2 * buttonIndex + 3);
  } else {
    // arrange buttons in a row at the bottom of the screen from left to right
    buttonX =
      width / 2 -
      POWER_SKILL_BUTTON_SIZE * (2 * buttonIndex - TOTAL_BUTTONS + 1) -
      POWER_SKILL_BUTTON_MARGIN * (2 * buttonIndex - TOTAL_BUTTONS + 1);
    buttonY = height - POWER_SKILL_BUTTON_SIZE - POWER_SKILL_BUTTON_MARGIN;
  }

  const skillButton = scene.add
    .circle(buttonX, buttonY, POWER_SKILL_BUTTON_SIZE, 0xffffff)
    .setScrollFactor(0)
    .setAlpha(POWER_SKILL_BUTTON_ALPHA)
    .setInteractive({
      cursor: "pointer",
    });

  const progressArc = scene.add.graphics({
    x: skillButton.x,
    y: skillButton.y,
  });

  const progressMask = scene.add.graphics({
    x: skillButton.x,
    y: skillButton.y,
  });
  skillButton.setMask(
    new Phaser.Display.Masks.GeometryMask(scene, progressMask),
  );

  // const skillButtonImage = scene.add
  //   .image(buttonX, buttonY, imageKey)
  //   .setScrollFactor(0)
  //   .setScale(PIXEL_SCALE);

  const skillButtonText = scene.add
    .text(buttonX, buttonY, text, {
      fontSize: "16px",
      fontFamily: "Basic",
      color: "#000000",
      align: "center",
      stroke: "#ffffff",
      strokeThickness: 2,
    })
    .setScrollFactor(0)
    .setOrigin(0.5);

  // ignore skill button in main camera
  scene.cameras.main.ignore(skillButton);
  // scene.cameras.main.ignore(skillButtonImage);
  scene.cameras.main.ignore(skillButtonText);
  scene.cameras.main.ignore(progressArc);
  scene.cameras.main.ignore(progressMask);

  const disableButton = () => {
    if (skillButton.input) skillButton.input.cursor = "default";
    if (isPointerOverButton) scene.input.setDefaultCursor("default");

    skillButton.setData("isOnEffectOrCooldown", true);
    skillButton.setAlpha(POWER_SKILL_BUTTON_ALPHA * 0.5);
    // skillButtonImage.setAlpha(0.5);
    skillButtonText.setAlpha(0.5);
  };

  const startEffect = () => {
    const dummy = { progress: 0 };
    scene.tweens.add({
      targets: dummy,
      progress: 1,
      duration: effectDuration,
      onUpdate: (tween) => {
        drawProgress(true, 1 - tween.progress, 0xffff00, 0.8);
      },
      onComplete: () => {
        startCooldown();
      },
    });
  };

  const startCooldown = () => {
    skillButton.fillColor = 0xffffff;

    const dummy = { progress: 0 };
    scene.tweens.add({
      targets: dummy,
      progress: 1,
      duration: cooldownDuration,
      onUpdate: (tween) => {
        drawProgress(false, tween.progress, 0xffffff, 0.5);
      },
      onComplete: () => {
        // play ready sound
        const skillReadySound = scene.sound.add("skill_ready");
        skillReadySound.play({ volume: 0.4 });

        // restore button state
        skillButton
          .setData("isOnEffectOrCooldown", false)
          .setAlpha(POWER_SKILL_BUTTON_ALPHA);
        skillButton.fillColor = 0xffff00;
        // skillButtonImage.setAlpha(1.0);
        skillButtonText.setAlpha(1.0);
        drawProgress(false, 0, 0xffffff, 0.0);

        // restore cursor
        if (skillButton.input) skillButton.input.cursor = "pointer";
        if (isPointerOverButton) scene.input.setDefaultCursor("pointer");
      },
    });
  };

  const drawProgress = (
    isEffectOn: boolean,
    progress: number,
    color: number,
    alpha: number,
  ) => {
    progressArc
      .clear()
      .lineStyle(PROGRESS_ARC_LINE_WIDTH, color, alpha)
      .beginPath()
      .arc(
        0,
        0,
        POWER_SKILL_BUTTON_SIZE + PROGRESS_ARC_OFFSET,
        Phaser.Math.DegToRad(270),
        Phaser.Math.DegToRad(270 + 360 * progress),
        false,
      )
      .strokePath();

    if (progress < 1) {
      progressArc
        .lineStyle(PROGRESS_ARC_LINE_WIDTH, color, alpha * 0.2)
        .beginPath()
        .arc(
          0,
          0,
          POWER_SKILL_BUTTON_SIZE + PROGRESS_ARC_OFFSET,
          Phaser.Math.DegToRad(270 + 360 * progress),
          Phaser.Math.DegToRad(270 + 360),
          false,
        )
        .strokePath();
    }

    if (isEffectOn) return;

    progressMask
      .clear()
      .fillStyle(0xffffff, 0.5)
      .beginPath()
      .moveTo(0, 0)
      .arc(
        0,
        0,
        POWER_SKILL_BUTTON_SIZE,
        Phaser.Math.DegToRad(270),
        Phaser.Math.DegToRad(270 + 360 * progress),
        false,
      )
      .lineTo(0, 0)
      .closePath()
      .fillPath();

    // draw the remaining part of the mask with lower opacity
    if (progress < 1) {
      progressMask
        .fillStyle(0xffffff, 0.2)
        .beginPath()
        .moveTo(0, 0)
        .arc(
          0,
          0,
          POWER_SKILL_BUTTON_SIZE,
          Phaser.Math.DegToRad(270 + 360 * progress),
          Phaser.Math.DegToRad(270 + 360),
          false,
        )
        .lineTo(0, 0)
        .closePath()
        .fillPath();
    }
  };

  skillButton.on("pointerover", () => {
    isPointerOverButton = true;
  });

  skillButton.on("pointerout", () => {
    isPointerOverButton = false;
  });

  skillButton.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    if (isTouchDevice()) buttonPointerIds.push(pointer.id);

    if (scene.isDead) return;
    if (skillButton.getData("isOnEffectOrCooldown")) return;

    disableButton();
    startEffect();

    callback(pointer);
  });

  // start cooldown immediately
  disableButton();
  startCooldown();

  return skillButton;
};

const initializeKeyboardControls = (scene: CropsAndChickensScene) => {
  scene.cursorKeys = scene.input.keyboard?.createCursorKeys();
  if (!scene.cursorKeys) return;

  const mmoLocalSettings = JSON.parse(
    localStorage.getItem("mmo_settings") ?? "{}",
  );
  const layout = mmoLocalSettings.layout ?? "QWERTY";

  // add WASD keys
  scene.cursorKeys.w = scene.input.keyboard?.addKey(
    layout === "QWERTY" ? "W" : "Z",
    false,
  );
  scene.cursorKeys.a = scene.input.keyboard?.addKey(
    layout === "QWERTY" ? "A" : "Q",
    false,
  );
  scene.cursorKeys.s = scene.input.keyboard?.addKey("S", false);
  scene.cursorKeys.d = scene.input.keyboard?.addKey("D", false);

  scene.input.keyboard?.removeCapture("SPACE");
};

/**
 * Initializes the controls for the scene.
 * @param scene The CropsAndChickensScene scene.
 */
export const initializeControls = (scene: CropsAndChickensScene) => {
  // create the HUD camera
  scene.hudCamera = scene.cameras.add();
  scene.hudCamera.ignore(scene.children.list);

  if (isTouchDevice()) {
    scene.input.addPointer(10);

    initializeJoystick(scene);
  }

  // initialize power skill buttons
  if (scene.isHardMode && scene.hasBetaAccess)
    initializePowerSkillButtons(scene);

  // initialize kaeyboard
  initializeKeyboardControls(scene);

  scene.input.setTopOnly(true);
};
