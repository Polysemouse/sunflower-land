import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { isTouchDevice } from "features/world/lib/device";
import { CropsAndChickensScene } from "../CropsAndChickensScene";
import { JOYSTICK_RADIUS } from "../../CropsAndChickensConstants";

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

  // swipe for pointer input
  scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    const setPositionX =
      centerX + (pointer.x - centerX) / scene.cameras.main.zoom;
    const setPositionY =
      centerY + (pointer.y - centerY) / scene.cameras.main.zoom;

    // set opacity and set joystick base to starting position
    joystickBase.setAlpha(1.0);
    joystickThumb.setAlpha(1.0);
    joystick.setPosition(setPositionX, setPositionY);
  });
  scene.input.on("pointerup", () => {
    // reset joystick position and opacity when swipe is done
    joystickBase.setAlpha(idleOpacity);
    joystickThumb.setAlpha(idleOpacity);

    const defaultPosition = scene.joystickDefaultPosition;
    joystick.setPosition(defaultPosition.x, defaultPosition.y);
  });
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
  if (isTouchDevice()) {
    initializeJoystick(scene);
  }

  // Initialise Keyboard
  initializeKeyboardControls(scene);

  scene.input.setTopOnly(true);
};
