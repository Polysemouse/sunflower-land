import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { isTouchDevice } from "features/world/lib/device";
import { CropsAndChickensScene } from "../CropsAndChickensScene";
import { JOYSTICK_RADIUS } from "../../CropsAndChickensConstants";
import { killNormalChickensAroundPlayer } from "./killNormalChickensAroundPlayer";
import { PowerSkillButtonContainer } from "../containers/PowerSkillButtonContainer";

//TODO: Move constants to CropsAndChickensConstants
const BUTTON_RADIUS = 28;
const BUTTON_MARGIN = 9;
const TOTAL_BUTTONS = 3;

/**
 * Gets the joystick default position.
 * @param scene The CropsAndChickensScene scene.
 */
const getJoystickDefaultPosition = (scene: CropsAndChickensScene) => {
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
  const defaultPosition = getJoystickDefaultPosition(scene);
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
    if (scene.buttonPointerIds.includes(pointer.id)) return;
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
    scene.buttonPointerIds = scene.buttonPointerIds.filter(
      (id) => id !== pointer.id,
    );

    // reset joystick position and opacity if pointer is not active
    if (joystick.pointer?.id) return;

    joystickBase.setAlpha(idleOpacity);
    joystickThumb.setAlpha(idleOpacity);

    const defaultPosition = getJoystickDefaultPosition(scene);
    joystick.setPosition(defaultPosition.x, defaultPosition.y);
  });
};

//TODO: Implement power skill buttons properly
const initializePowerSkillButtons = (scene: CropsAndChickensScene) => {
  const { width, height } = scene.cameras.main;

  const buttonPositions = Array.from({ length: TOTAL_BUTTONS }, (_, i) => {
    let buttonX, buttonY;
    if (isTouchDevice()) {
      // arrange buttons in a column on the right side of the screen from bottom to top
      buttonX = width - BUTTON_RADIUS - BUTTON_MARGIN;
      buttonY =
        height - BUTTON_RADIUS * (2 * i + 3) - BUTTON_MARGIN * (2 * i + 3);
    } else {
      // arrange buttons in a row at the bottom of the screen from left to right
      buttonX =
        width / 2 -
        BUTTON_RADIUS * (2 * i - TOTAL_BUTTONS + 1) -
        BUTTON_MARGIN * (2 * i - TOTAL_BUTTONS + 1);
      buttonY = height - BUTTON_RADIUS - BUTTON_MARGIN;
    }

    return { x: buttonX, y: buttonY };
  });

  scene.powerSkillButtons = [
    new PowerSkillButtonContainer({
      scene,
      powerSkillName: "Slow Mo Chickens",
      x: buttonPositions[0].x,
      y: buttonPositions[0].y,
      tempText: "slow\nchicken",
      hotkey: "M",
      cooldownDuration: 20000,
      effectDuration: 10000,
      callback: () => {
        const skillSound = scene.sound.add("skill_slow_down");
        skillSound.play({ volume: 0.8 });

        scene.normalChickens.forEach((chicken) => {
          chicken.slowSpeed();
        });
        scene.hunterChicken?.slowSpeed();

        scene.time.delayedCall(10000, () => {
          scene.normalChickens.forEach((chicken) => {
            chicken.restoreSpeed();
          });
          scene.hunterChicken?.restoreSpeed();
        });
      },
    }),
    new PowerSkillButtonContainer({
      scene,
      powerSkillName: "Frozen Hunter",
      x: buttonPositions[1].x,
      y: buttonPositions[1].y,
      tempText: "freeze\nhunter\nchicken",
      hotkey: "N",
      cooldownDuration: 15000,
      effectDuration: 15000,
      callback: () => {
        const skillSound = scene.sound.add("skill_freeze");
        skillSound.play({ volume: 0.5 });

        scene.hunterChicken?.freeze();

        scene.time.delayedCall(15000, () => {
          scene.hunterChicken?.unfreeze();
        });
      },
    }),
    new PowerSkillButtonContainer({
      scene,
      powerSkillName: "Eggsplosion",
      x: buttonPositions[2].x,
      y: buttonPositions[2].y,
      tempText: "kill nearby\nnormal\nchickens",
      hotkey: "B",
      cooldownDuration: 10000,
      effectDuration: 1000,
      callback: () => {
        killNormalChickensAroundPlayer(scene, 5);
      },
    }),
  ];
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

  // initialize keyboard
  initializeKeyboardControls(scene);

  scene.input.setTopOnly(true);
};
