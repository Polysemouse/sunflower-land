import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { isTouchDevice } from "features/world/lib/device";
import { CropsAndChickensScene } from "../CropsAndChickensScene";
import { JOYSTICK_RADIUS } from "../../CropsAndChickensConstants";
import { depositCrops } from "./depositCrops";
import { killPlayer } from "./killPlayer";

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
    .setDepth(1000000000)
    .setAlpha(idleOpacity);
  const joystickThumb = scene.add
    .circle(0, 0, JOYSTICK_RADIUS / 2, 0xffffff, 0.2)
    .setDepth(1000000000)
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
  const defaultPosition = joystickDefaultPosition(scene);

  const skillButton1 = scene.add
    .circle(defaultPosition.x + 150, defaultPosition.y, 30, 0xff0000)
    .setScrollFactor(0)
    .setDepth(1000000000)
    .setInteractive()
    .setPostPipeline("");
  skillButton1.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    buttonPointerIds.push(pointer.id);
    killPlayer(scene, "Normal Chicken");
  });
  scene.cameras.main.ignore(skillButton1);

  const skillButton2 = scene.add
    .circle(defaultPosition.x + 150, defaultPosition.y - 80, 30, 0x00ff00)
    .setScrollFactor(0)
    .setDepth(1000000000)
    .setInteractive()
    .setPostPipeline("");
  skillButton2.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    buttonPointerIds.push(pointer.id);
    depositCrops(scene);
  });

  scene.cameras.main.ignore(skillButton2);
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
  // Create the HUD camera
  scene.hudCamera = scene.cameras.add();
  scene.hudCamera.ignore(scene.children.list);

  // add hud text
  // const hudText = scene.add.text(20, 20, "test1234", {
  //   fontSize: "100px",
  //   fontFamily: "Arial",
  //   color: "#ffffff",
  //   align: "center",
  // });

  if (isTouchDevice()) {
    scene.input.addPointer(2);

    initializeJoystick(scene);
    // initializePowerSkillButtons(scene);
  }

  // Initialise Keyboard
  initializeKeyboardControls(scene);

  scene.input.setTopOnly(true);
};
