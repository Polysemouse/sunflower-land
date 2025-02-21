import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import {
  MachineInterpreter,
  PortalEvent,
} from "../lib/cropsAndChickensMachine";
import {
  BOARD_WIDTH,
  NORMAL_CHICKEN_STRAIGHT_RAIL_CONFIGURATIONS,
  CROP_SPAWN_CONFIGURATIONS,
  GAME_SECONDS,
  PLAYER_MAX_XY,
  PLAYER_MIN_XY,
  PLAYER_WALKING_SPEED,
  TIME_TICKING_SECONDS,
  TIME_TICKING_PREPARATION_SECONDS,
  ZOOM_OUT_SCALE,
  JOYSTICK_RADIUS,
  JOYSTICK_FORCE_MIN,
  HALLOWEEN_PLAYER_OPACITY,
  NORMAL_CHICKEN_CIRCULAR_RAIL_CONFIGURATIONS,
} from "../CropsAndChickensConstants";
import {
  NormalChickenStraightRailType,
  NormalChickenStraightContainer,
} from "./containers/NormalChickenStraightContainer";
import { HunterChickenContainer } from "./containers/HunterChickenContainer";
import { StorageAreaContainer } from "./containers/StorageAreaContainer";
import { DepositIndicatorContainer } from "./containers/DepositIndicatorContainer";
import { CropContainer } from "./containers/CropContainer";
import { EventObject } from "xstate";
import { hasFeatureAccess } from "lib/flags";
import { getZoomOutSetting, ZOOM_OUT_EVENT } from "../hooks/useIsZoomOut";
import { preloadAssets } from "./lib/preloadAssets";

import { getAttemptsLeft, getHolidayEvent } from "../lib/cropsAndChickensUtils";
import { getHolidayAsset } from "../lib/CropsAndChickensHolidayAsset";
import Decimal from "decimal.js-light";
import { CropsAndChickensActivityName } from "../CropsAndChickensActivities";
import { killPlayer } from "./lib/killPlayer";
import { depositCrops } from "./lib/depositCrops";
import { harvestCrop } from "./lib/harvestCrop";
import { endGame } from "./lib/endGame";
import { initializeControls } from "./lib/initializeControls";
import {
  NormalChickenCircularContainer,
  NormalChickenCircularRailType,
} from "./containers/NormalChickenCircularContainer";
import { initializePipelines } from "./lib/initializePipelines";

export class CropsAndChickensScene extends BaseScene {
  sceneId: SceneId = "crops_and_chickens";

  hudCamera?: Phaser.Cameras.Scene2D.Camera;

  joystickIndicatorBase: Phaser.GameObjects.Arc | undefined;
  joystickIndicatorDot: Phaser.GameObjects.Sprite | undefined;

  // player states
  isDead!: boolean;
  chunk!: { x: number; y: number };
  deaths!: number;
  hasGoneUp!: boolean;
  hasGotToTheOtherSide!: boolean;
  hasStopped!: boolean;
  activities!: Partial<Record<CropsAndChickensActivityName, Decimal>>;

  normalChickens: (
    | NormalChickenStraightContainer
    | NormalChickenCircularContainer
  )[] = [];
  hunterChicken?: HunterChickenContainer;
  storageArea?: StorageAreaContainer;
  depositIndicator?: DepositIndicatorContainer;

  achievementGetSound?:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  timeTickingSound?:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  timeTickingPreparationSound?:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;

  constructor() {
    super({
      name: "crops_and_chickens",
      map: { json: getHolidayAsset("map", getHolidayEvent()) },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
    this.setDefaultStates();
  }

  /**
   * Sets the default states.
   */
  private setDefaultStates = () => {
    this.isDead = false;
    this.chunk = { x: 0, y: 0 };
    this.deaths = 0;
    this.hasGoneUp = false;
    this.hasGotToTheOtherSide = false;
    this.hasStopped = false;
    this.activities = {};
  };

  /**
   * Whether the player is moving.
   */
  private get isMoving() {
    return this.movementAngle !== undefined && this.playerWalkingSpeed !== 0;
  }

  /**
   * Whether the player has beta access.
   */
  get hasBetaAccess() {
    if (!this.portalServiceContext?.state) return false;

    return hasFeatureAccess(
      this.portalServiceContext.state,
      "CROPS_AND_CHICKENS_BETA_TESTING",
    );
  }

  /**
   * The portal service.
   */
  get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }

  /**
   * The portal service context.
   */
  private get portalServiceContext() {
    return this.portalService?.state.context;
  }

  /**
   * Whether the game is in hard mode.
   */
  get isHardMode() {
    return this.portalServiceContext?.gameMode === "hard";
  }

  /**
   * The deposited crop indexes.
   */
  public get depositedCropIndexes() {
    return this.portalServiceContext?.depositedCropIndexes ?? [];
  }

  /**
   * The harvested crop indexes.
   */
  public get harvestedCropIndexes() {
    return this.portalServiceContext?.harvestedCropIndexes ?? [];
  }

  /**
   * The inventory crop indexes.
   */
  public get inventoryCropIndexes() {
    return this.portalServiceContext?.inventoryCropIndexes ?? [];
  }

  /**
   * The score.
   */
  public get score() {
    return this.portalServiceContext?.score ?? 0;
  }

  /**
   * The inventory score.
   */
  get inventory() {
    return this.portalServiceContext?.inventory ?? 0;
  }

  /**
   * The target score.
   */
  get targetScore() {
    return (
      this.portalServiceContext?.state?.minigames.prizes["crops-and-chickens"]
        ?.score ?? 0
    );
  }

  /**
   * The existing achievement names.
   */
  get existingAchievementNames() {
    const achievements =
      this.portalServiceContext?.state?.minigames.games["crops-and-chickens"]
        ?.achievements ?? {};

    return Object.keys(achievements);
  }

  /**
   * The number of seconds left for the game.
   */
  public get secondsLeft() {
    const endAt = this.portalServiceContext?.endAt;
    const secondsLeft = !endAt
      ? GAME_SECONDS
      : Math.max(endAt - Date.now(), 0) / 1000;
    return secondsLeft;
  }

  get attemptsLeft() {
    const minigame =
      this.portalServiceContext?.state?.minigames.games["crops-and-chickens"];

    return getAttemptsLeft(minigame);
  }

  /**
   * Whether the player has read the rules.
   */
  get isRulesRead() {
    return (
      this.portalService?.state.matches("ready") === true ||
      this.portalService?.state.matches("playing") === true
    );
  }

  /**
   * Whether the game is in the playing state.
   */
  private get isGamePlaying() {
    return this.portalService?.state.matches("playing") === true;
  }

  /**
   * Whether the player is in the deposit area.
   */
  private get isPlayerInDepositArea() {
    if (!this.currentPlayer || !this.storageArea) return false;
    return this.physics.overlap(this.storageArea, this.currentPlayer);
  }

  /**
   * The player walking speed.
   */
  private get playerWalkingSpeed() {
    if (!this.isRulesRead || this.isDead || this.isCameraFading) return 0;

    return PLAYER_WALKING_SPEED;
  }

  /**
   * Called when the scene is preloaded.
   */
  preload() {
    super.preload();

    preloadAssets(this);
  }

  /**
   * Called when the scene is created.
   */
  async create() {
    this.map = this.make.tilemap({
      key: "main-map",
    });

    this.portalService?.send("SET_IS_SMALL_SCREEN", {
      isSmallScreen: this.isSmallScreen,
    });

    super.create();

    // initialize pipelines
    initializePipelines(this);

    // add joystick indicator on top of the player
    this.joystickIndicatorBase = this.add
      .circle(0, 0, 10, 0x000000, 0.1)
      .setVisible(false);
    this.joystickIndicatorDot = this.add
      .sprite(0, 0, "joystick_indicator_dot")
      .setVisible(false)
      .setDepth(1000000);

    // remove camera bounds so that the camera does not stop at the edge of the map when player wraps around
    this.cameras.main.removeBounds();

    this.achievementGetSound = this.sound.add("achievement_get");

    this.setDefaultStates();
    this.initializeListeners();

    this.createAllCrops();
    this.createAllNormalChickens();

    if (this.currentPlayer && getHolidayEvent() === "halloween") {
      this.currentPlayer.setAlpha(HALLOWEEN_PLAYER_OPACITY);
    }

    this.hunterChicken = new HunterChickenContainer({
      scene: this,
      player: this.currentPlayer,
      isChickenFrozen: () =>
        this.isDead || this.isPlayerInDepositArea || !this.isGamePlaying,
      killPlayer: () => killPlayer(this, "Hunter Chicken"),
    });

    this.storageArea = new StorageAreaContainer({
      scene: this,
      player: this.currentPlayer,
      depositCrops: () => depositCrops(this),
    });

    this.depositIndicator = new DepositIndicatorContainer({
      scene: this,
      player: this.currentPlayer,
      hasCropsInInventory: () => this.inventoryCropIndexes.length > 0,
    });

    // reload scene when player hit retry
    const onRetry = (event: EventObject) => {
      const type = event.type as PortalEvent["type"];
      if (type !== "START_CLASSIC_MODE" && type !== "START_HARD_MODE") return;
      if (!this.isHardMode && this.attemptsLeft <= 0) return;

      this.changeScene(this.sceneId);
    };
    this.portalService?.onEvent(onRetry);

    // cleanup event listeners when scene is shut down
    this.events.on("shutdown", () => {
      this.portalService?.off(onRetry);
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });

      // cleanup event listeners for settings
      window.removeEventListener(ZOOM_OUT_EVENT as any, this.onSetZoomOut);
    });

    // initialize controls after everything is set up so that the HUD camera can be set up properly
    initializeControls(this);
  }

  /**
   * Called every time there is a frame update.
   */
  update() {
    // set joystick state in machine
    this.portalService?.send("SET_IS_JOYSTICK_ACTIVE", {
      isJoystickActive: !!this.joystick?.force,
    });

    // check if player has gone up
    if (
      this.currentPlayer?.body &&
      this.currentPlayer.body.velocity.y < -1e-8
    ) {
      this.hasGoneUp = true;
    }

    // play ticking preparation sound
    if (
      this.isGamePlaying &&
      !this.timeTickingPreparationSound &&
      this.secondsLeft <= TIME_TICKING_PREPARATION_SECONDS &&
      this.secondsLeft > 0
    ) {
      this.timeTickingPreparationSound = this.sound.add(
        "time_ticking_preparation",
      );
      this.timeTickingPreparationSound.play({ volume: 0.4 });
    }

    // play ticking sound if time is going to run out
    if (
      this.isGamePlaying &&
      !this.timeTickingSound &&
      this.secondsLeft <= TIME_TICKING_SECONDS &&
      this.secondsLeft > 0
    ) {
      this.timeTickingSound = this.sound.add("time_ticking");
      this.timeTickingSound.play({ volume: 0.5 });
    }

    // end game when time is up
    if (this.isGamePlaying && this.secondsLeft <= 0) {
      endGame(this);
      this.timeTickingSound?.stop();
      this.timeTickingSound = undefined;
    }

    // warp entities
    if (this.currentPlayer?.body) {
      // calculate which chunk the player is in
      if (this.currentPlayer.x < PLAYER_MIN_XY) {
        this.chunk.x -= 1;
      } else if (this.currentPlayer.x > PLAYER_MAX_XY) {
        this.chunk.x += 1;
      }
      if (this.currentPlayer.y < PLAYER_MIN_XY) {
        this.chunk.y -= 1;
      } else if (this.currentPlayer.y > PLAYER_MAX_XY) {
        this.chunk.y += 1;
      }

      // check if player has stopped moving
      if (
        this.isGamePlaying &&
        this.currentPlayer.body.velocity.x === 0 &&
        this.currentPlayer.body.velocity.y === 0
      ) {
        this.hasStopped = true;
      }

      // warp player
      const playerX = Phaser.Math.Wrap(
        this.currentPlayer.x,
        PLAYER_MIN_XY,
        PLAYER_MAX_XY,
      );
      const playerY = Phaser.Math.Wrap(
        this.currentPlayer.y,
        PLAYER_MIN_XY,
        PLAYER_MAX_XY,
      );
      this.currentPlayer.x = playerX;
      this.currentPlayer.y = playerY;

      // warp chickens around player
      this.normalChickens.forEach((chicken) => {
        // calculate which chunk the chicken is in
        const chickenMinX = playerX - BOARD_WIDTH / 2;
        const chickenMaxX = playerX + BOARD_WIDTH / 2;
        const chickenMinY = playerY - BOARD_WIDTH / 2;
        const chickenMaxY = playerY + BOARD_WIDTH / 2;
        if (chicken.x < chickenMinX) {
          chicken.chunk.x -= 1;
        } else if (chicken.x > chickenMaxX) {
          chicken.chunk.x += 1;
        }
        if (chicken.y < chickenMinY) {
          chicken.chunk.y -= 1;
        } else if (chicken.y > chickenMaxY) {
          chicken.chunk.y += 1;
        }

        // warp chicken
        chicken.x = Phaser.Math.Wrap(
          chicken.x,
          playerX - BOARD_WIDTH / 2,
          playerX + BOARD_WIDTH / 2,
        );
        chicken.y = Phaser.Math.Wrap(
          chicken.y,
          playerY - BOARD_WIDTH / 2,
          playerY + BOARD_WIDTH / 2,
        );
        chicken.setDepth(chicken.y);
      });

      // warp hunter chicken around player
      if (this.hunterChicken) {
        this.hunterChicken.x = Phaser.Math.Wrap(
          this.hunterChicken.x,
          playerX - BOARD_WIDTH / 2,
          playerX + BOARD_WIDTH / 2,
        );
        this.hunterChicken.y = Phaser.Math.Wrap(
          this.hunterChicken.y,
          playerY - BOARD_WIDTH / 2,
          playerY + BOARD_WIDTH / 2,
        );
        this.hunterChicken.setDepth(this.hunterChicken.y);
      }
    }

    // update deposit indicator position
    this.depositIndicator?.update();

    // start game if player decides to moves
    // must be called after setting hasStopped
    if (!this.isGamePlaying && this.isMoving) {
      this.portalService?.send("START");
    }

    this.updatePlayer();
    super.update();
  }

  /**
   * Updates the player.
   */
  updatePlayer() {
    if (!this.currentPlayer?.body) return;

    // joystick is active if force is greater than zero
    this.movementAngle =
      this.joystick?.force && this.joystick.force >= JOYSTICK_FORCE_MIN
        ? this.joystick?.angle
        : undefined;

    // use keyboard control if joystick is not active
    if (this.movementAngle === undefined) {
      if (document.activeElement?.tagName === "INPUT") return;

      const left =
        (this.cursorKeys?.left.isDown || this.cursorKeys?.a?.isDown) ?? false;
      const right =
        (this.cursorKeys?.right.isDown || this.cursorKeys?.d?.isDown) ?? false;
      const up =
        (this.cursorKeys?.up.isDown || this.cursorKeys?.w?.isDown) ?? false;
      const down =
        (this.cursorKeys?.down.isDown || this.cursorKeys?.s?.isDown) ?? false;

      this.movementAngle = this.keysToAngle(left, right, up, down);
    }

    // change player direction if angle is changed from left to right or vise versa
    if (
      this.movementAngle !== undefined &&
      Math.abs(this.movementAngle) !== 90
    ) {
      this.isFacingLeft = Math.abs(this.movementAngle) > 90;
      this.isFacingLeft
        ? this.currentPlayer.faceLeft()
        : this.currentPlayer.faceRight();
    }

    // set player velocity
    const currentPlayerBody = this.currentPlayer
      .body as Phaser.Physics.Arcade.Body;
    if (this.movementAngle !== undefined) {
      currentPlayerBody.setVelocity(
        this.playerWalkingSpeed *
          Math.cos((this.movementAngle * Math.PI) / 180),
        this.playerWalkingSpeed *
          Math.sin((this.movementAngle * Math.PI) / 180),
      );
    } else {
      currentPlayerBody.setVelocity(0, 0);
    }

    // set joystick indicator dot if joystick is active
    if (this.joystick && this.joystick.force) {
      const angle = (this.joystick.angle / 180.0) * Math.PI;
      const distance = Math.min(this.joystick.force, JOYSTICK_RADIUS);
      const offset = { x: 5, y: 1 };
      const scale = 0.22;

      this.joystickIndicatorBase
        ?.setVisible(true)
        .setPosition(
          currentPlayerBody.x + offset.x,
          currentPlayerBody.y + offset.y,
        );
      this.joystickIndicatorDot
        ?.setVisible(true)
        .setPosition(
          currentPlayerBody.x + offset.x + distance * Math.cos(angle) * scale,
          currentPlayerBody.y + offset.y + distance * Math.sin(angle) * scale,
        );
    } else {
      this.joystickIndicatorBase?.setVisible(false);
      this.joystickIndicatorDot?.setVisible(false);
    }

    //this.sendPositionToServer();

    this.soundEffects?.forEach((audio) =>
      audio.setVolumeAndPan(
        this.currentPlayer?.x ?? 0,
        this.currentPlayer?.y ?? 0,
      ),
    );

    this.walkAudioController?.handleWalkSound(this.isMoving);

    if (this.isMoving) {
      this.currentPlayer.walk();
    } else {
      this.currentPlayer.idle();
    }

    this.joystickIndicatorBase?.setDepth(this.currentPlayer.y - 1e-4);
    this.currentPlayer.setDepth(this.currentPlayer.y);
  }

  /**
   * Changes the zoom out setting when the event is triggered.
   * @param event The event.
   */
  private onSetZoomOut = (event: CustomEvent) => {
    // does not zoom out if not on small screen
    const zoomOutScale = this.isSmallScreen ? ZOOM_OUT_SCALE : this.initialZoom;

    // set zoom out
    this.cameras.main.zoom = event.detail ? zoomOutScale : this.initialZoom;
  };

  /**
   * Initializes the listeners.
   */
  private initializeListeners = () => {
    // add event listener for settings
    window.addEventListener(ZOOM_OUT_EVENT as any, this.onSetZoomOut);
    this.onSetZoomOut({ detail: getZoomOutSetting() } as CustomEvent);
  };

  /**
   * Creates all the crops for the map.
   */
  private createAllCrops() {
    return CROP_SPAWN_CONFIGURATIONS.map(
      (config) =>
        new CropContainer({
          x: SQUARE_WIDTH * config.x,
          y: SQUARE_WIDTH * config.y,
          cropIndex: config.cropIndex,
          scene: this,
          player: this.currentPlayer,
          harvestCrop: (crops, cropIndex) =>
            harvestCrop(this, crops, cropIndex),
        }),
    );
  }

  /**
   * Creates normal chickens for a given straight rail.
   * @param railType The rail type.
   * @returns All normal chickens for a given straight rail.
   */
  private createNormalChickensStraight = (
    railType: NormalChickenStraightRailType,
  ) => {
    return NORMAL_CHICKEN_STRAIGHT_RAIL_CONFIGURATIONS.flatMap((config) =>
      Array.from(
        { length: config.count },
        () =>
          new NormalChickenStraightContainer({
            railType: railType,
            rail: config.rail,
            scene: this,
            player: this.currentPlayer,
            killPlayer: () => killPlayer(this, "Normal Chicken"),
          }),
      ),
    );
  };

  /**
   * Creates normal chickens for a given circular rail.
   * @param railType The rail type.
   * @returns All normal chickens for a given circular rail.
   */
  private createNormalChickensCircular = (
    railType: NormalChickenCircularRailType,
  ) => {
    return NORMAL_CHICKEN_CIRCULAR_RAIL_CONFIGURATIONS.flatMap((config) =>
      Array.from(
        { length: config.count },
        () =>
          new NormalChickenCircularContainer({
            railType: railType,
            rail: config.rail,
            scene: this,
            player: this.currentPlayer,
            killPlayer: () => killPlayer(this, "Normal Chicken"),
          }),
      ),
    );
  };

  /**
   * Creates all normal chickens in the game.
   * @returns All normal chickens in the game.
   */
  private createAllNormalChickens = () => {
    const chickensFacingLeft = this.createNormalChickensStraight("left");
    const chickensFacingRight = this.createNormalChickensStraight("right");
    const chickensFacingUp = this.createNormalChickensStraight("up");
    const chickensFacingDown = this.createNormalChickensStraight("down");

    this.normalChickens = [
      ...chickensFacingLeft,
      ...chickensFacingRight,
      ...chickensFacingUp,
      ...chickensFacingDown,
    ];

    if (this.isHardMode) {
      const chickensClockwise = this.createNormalChickensCircular("clockwise");
      const chickensCounterClockwise =
        this.createNormalChickensCircular("counterClockwise");
      this.normalChickens.push(...chickensClockwise);
      this.normalChickens.push(...chickensCounterClockwise);
    }
  };
}
