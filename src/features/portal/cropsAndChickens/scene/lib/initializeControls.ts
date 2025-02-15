import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { isTouchDevice } from "features/world/lib/device";
import { CropsAndChickensScene } from "../CropsAndChickensScene";
import { JOYSTICK_RADIUS } from "../../CropsAndChickensConstants";
import { killPlayer } from "./killPlayer";
import { depositCrops } from "./depositCrops";

const POWER_SKILL_BUTTON_SIZE = 28;
const POWER_SKILL_BUTTON_MARGIN = 9;
const POEWR_SKILL_BUTTON_ALPHA = 0.3;

const TOTAL_BUTTONS = 5;

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
    "chicken\nx2 speed",
    () => {
      scene.enemySpeedMultiplier = 2;
      scene.events.emit("enemySpeedMultiplierChanged", 2);
    },
    0,
    500,
    1000,
  );
  initializePowerSkillButton(
    scene,
    "crop_deposit_arrow",
    "chicken\nx1 speed",
    () => {
      scene.enemySpeedMultiplier = 1;
      scene.events.emit("enemySpeedMultiplierChanged", 1);
    },
    1,
    500,
    1000,
  );
  initializePowerSkillButton(
    scene,
    "crop_deposit_arrow",
    "chicken\nx0.5 speed",
    () => {
      scene.enemySpeedMultiplier = 0.5;
      scene.events.emit("enemySpeedMultiplierChanged", 0.5);
    },
    2,
    500,
    1000,
  );
  initializePowerSkillButton(
    scene,
    "crop_deposit_arrow",
    "deposit\ncrops",
    () => {
      depositCrops(scene);
    },
    3,
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
    4,
    1000,
    3000,
  );
};

const initializePowerSkillButton = (
  scene: CropsAndChickensScene,
  imageKey: string,
  text: string,
  callback: (pointer: Phaser.Input.Pointer) => void,
  buttonIndex: number,
  effectDuration: number,
  cooldownDuration: number,
) => {
  const { width, height } = scene.cameras.main;

  let isPointerOverButton = false;

  let buttonX, buttonY;

  if (isTouchDevice()) {
    buttonX = width - POWER_SKILL_BUTTON_SIZE - POWER_SKILL_BUTTON_MARGIN;
    buttonY =
      height -
      POWER_SKILL_BUTTON_SIZE * (2 * buttonIndex + 3) -
      POWER_SKILL_BUTTON_MARGIN * (2 * buttonIndex + 3);
  } else {
    buttonX =
      width / 2 -
      POWER_SKILL_BUTTON_SIZE * (2 * buttonIndex - 0.5 * (TOTAL_BUTTONS + 1)) -
      POWER_SKILL_BUTTON_MARGIN * (2 * buttonIndex - 0.5 * (TOTAL_BUTTONS + 1));
    buttonY = height - POWER_SKILL_BUTTON_SIZE - POWER_SKILL_BUTTON_MARGIN;
  }

  const skillButton = scene.add
    .circle(buttonX, buttonY, POWER_SKILL_BUTTON_SIZE, 0xffffff)
    .setScrollFactor(0)
    .setAlpha(POEWR_SKILL_BUTTON_ALPHA)
    .setInteractive({
      cursor: "pointer",
    });

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

  const cooldownGraphics = scene.add.graphics({
    x: skillButton.x,
    y: skillButton.y,
  });
  cooldownGraphics.setVisible(false);

  skillButton.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    if (isTouchDevice()) buttonPointerIds.push(pointer.id);

    if (skillButton.getData("isOnCooldown")) return;

    setUsedState();
    scene.time.delayedCall(effectDuration, () => {
      startCooldown();
    });

    callback(pointer);
  });

  skillButton.on("pointerover", () => {
    isPointerOverButton = true;
  });

  skillButton.on("pointerout", () => {
    isPointerOverButton = false;
  });

  const setUsedState = () => {
    if (skillButton.input) skillButton.input.cursor = "default";
    if (isPointerOverButton) scene.input.setDefaultCursor("default");

    skillButton.setData("isOnCooldown", true);
    skillButton.setAlpha(POEWR_SKILL_BUTTON_ALPHA * 0.5);
    // skillButtonImage.setAlpha(0.5);
    skillButtonText.setAlpha(0.5);
  };

  const startCooldown = () => {
    cooldownGraphics.setVisible(true);
    cooldownGraphics.clear();

    const dummy = { progress: 0 };
    scene.tweens.add({
      targets: dummy,
      progress: 1,
      duration: cooldownDuration,
      onUpdate: (tween) => {
        const progress = tween.progress;
        drawCooldownCircle(progress);
      },
      onComplete: () => {
        skillButton
          .setData("isOnCooldown", false)
          .setAlpha(POEWR_SKILL_BUTTON_ALPHA);
        // skillButtonImage.setAlpha(1.0);
        skillButtonText.setAlpha(1.0);

        if (skillButton.input) skillButton.input.cursor = "pointer";
        if (isPointerOverButton) scene.input.setDefaultCursor("pointer");

        cooldownGraphics.setVisible(false);
      },
    });
  };

  const drawCooldownCircle = (progress: number) => {
    cooldownGraphics.clear();
    cooldownGraphics.lineStyle(4, 0xffffff, 0.5);
    cooldownGraphics.beginPath();
    cooldownGraphics.arc(
      0,
      0,
      POWER_SKILL_BUTTON_SIZE + 5,
      Phaser.Math.DegToRad(270),
      Phaser.Math.DegToRad(270 + 360 * progress),
      false,
    );
    cooldownGraphics.strokePath();
  };

  scene.cameras.main.ignore(skillButton);
  scene.cameras.main.ignore(cooldownGraphics);

  setUsedState();
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

  // initialise Keyboard
  initializeKeyboardControls(scene);

  scene.input.setTopOnly(true);
};
