import mapJson from "assets/map/crops_and_chickens.json";

import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SPAWNS } from "features/world/lib/spawn";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { MachineInterpreter } from "../lib/cropsAndChickensMachine";
import {
  DEPOSIT_CHEST_XY,
  BOARD_OFFSET,
  BOARD_WIDTH,
  CHICKEN_SPAWN_CONFIGURATIONS,
  CHICKEN_SPRITE_PROPERTIES,
  CROP_SPAWN_CONFIGURATIONS,
  GAME_SECONDS,
  PLAYER_DEATH_SPRITE_PROPERTIES,
  PLAYER_MAX_XY,
  PLAYER_MIN_XY,
  PLAYER_WALKING_SPEED,
  SPRITE_FRAME_RATE,
  TIME_TICKING_SECONDS,
  TIME_TICKING_PREPARATION_SECONDS,
  ZOOM_OUT_SCALE,
  JOYSTICK_RADIUS,
  JOYSTICK_FORCE_MIN,
  HALLOWEEN_PLAYER_OPACITY,
} from "../CropsAndChickensConstants";
import { NormalChickenContainer } from "./containers/NormalChickenContainer";
import { HunterChickenContainer } from "./containers/HunterChickenContainer";
import { DarkModePipeline } from "../shaders/darkModeShader";
import {
  DARK_MODE_EVENT,
  getDarkModeSetting,
} from "lib/utils/hooks/useIsDarkMode";
import { StorageAreaContainer } from "./containers/StorageAreaContainer";
import { DepositIndicatorContainer } from "./containers/DepositIndicatorContainer";
import { CropContainer } from "./containers/CropContainer";
import { EventObject } from "xstate";
import { CropsAndChickensAchievementName } from "../CropsAndChickensAchievements";
import { hasFeatureAccess } from "lib/flags";
import { getZoomOutSetting, ZOOM_OUT_EVENT } from "../hooks/useIsZoomOut";
import { preloadAssets } from "./lib/preloadAssets";
import {
  AchievementTrigger,
  getEligibleAchievements,
} from "./lib/getEligibleAchievements";
import { isTouchDevice } from "features/world/lib/device";
import { getHolidayEvent } from "../lib/cropsAndChickensUtils";

type chickenType = "normal" | "hunter";

export class CropsAndChickensScene extends BaseScene {
  sceneId: SceneId = "crops_and_chickens";

  joystickIndicatorBase: Phaser.GameObjects.Arc | undefined;
  joystickIndicatorDot: Phaser.GameObjects.Sprite | undefined;

  // player states
  isDead!: boolean;
  chunk!: { x: number; y: number };
  deaths!: number;
  hasGoneUp!: boolean;
  hasGotToTheOtherSide!: boolean;
  hasStopped!: boolean;

  chickens: NormalChickenContainer[] = [];
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
      map: { json: mapJson },
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
  };

  /**
   * Gets the joystick default position.
   */
  private get joystickDefaultPosition() {
    return {
      x: this.cameras.main.centerX,
      y:
        this.cameras.main.centerY +
        (this.cameras.main.height * 0.3) / this.cameras.main.zoom,
    };
  }

  /**
   * Gets the joystick scale.
   */
  private get joystickScale() {
    return 1 / this.cameras.main.zoom;
  }

  /**
   * Whether the player is moving.
   */
  private get isMoving() {
    return this.movementAngle !== undefined && this.walkingSpeed !== 0;
  }

  /**
   * Whether the player has beta access.
   */
  private get hasBetaAccess() {
    if (!this.portalServiceContext?.state) return false;

    return hasFeatureAccess(
      this.portalServiceContext.state,
      "CROPS_AND_CHICKENS_BETA_TESTING",
    );
  }

  /**
   * The portal service.
   */
  private get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }

  /**
   * The portal service context.
   */
  private get portalServiceContext() {
    return this.portalService?.state.context;
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
  private get inventory() {
    return this.portalServiceContext?.inventory ?? 0;
  }

  /**
   * The target score.
   */
  private get target() {
    return (
      this.portalServiceContext?.state?.minigames.prizes["crops-and-chickens"]
        ?.score ?? 0
    );
  }

  /**
   * The existing achievement names.
   */
  private get existingAchievementNames() {
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

  /**
   * Whether the player has read the rules.
   */
  private get isRulesRead() {
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
    this.initialiseCropsAndChickensControls();

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
      killPlayer: () => this.killPlayer("hunter"),
    });

    this.storageArea = new StorageAreaContainer({
      scene: this,
      player: this.currentPlayer,
      depositCrops: () => this.depositCrops(),
    });

    this.depositIndicator = new DepositIndicatorContainer({
      scene: this,
      player: this.currentPlayer,
      hasCropsInInventory: () => this.inventoryCropIndexes.length > 0,
    });

    // reload scene when player hit retry
    const onRetry = (event: EventObject) => {
      if (event.type === "RETRY") {
        this.changeScene(this.sceneId);
      }
    };
    this.portalService?.onEvent(onRetry);

    // cleanup event listeners when scene is shut down
    this.events.on("shutdown", () => {
      this.portalService?.off(onRetry);
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });

      // cleanup event listeners for settings
      window.removeEventListener(DARK_MODE_EVENT as any, this.onSetDarkMode);
      window.removeEventListener(ZOOM_OUT_EVENT as any, this.onSetZoomOut);
    });
  }

  /**
   * Called every time there is a frame update.
   */
  update() {
    // set joystick state in machine
    this.portalService?.send("SET_IS_JOYSTICK_ACTIVE", {
      isJoystickActive: !!this.joystick?.force,
    });

    // set player speed
    this.walkingSpeed =
      this.isRulesRead && !this.isDead && !this.isCameraFading
        ? PLAYER_WALKING_SPEED
        : 0;

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
      this.endGame();
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
      this.chickens.forEach((chicken) => {
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
   * Initialises the controls.
   */
  public initialiseCropsAndChickensControls() {
    if (isTouchDevice()) {
      // Initialise joystick
      const { centerX, centerY } = this.cameras.main;

      const idleOpacity = 0.4;
      const joystickBase = this.add
        .circle(0, 0, JOYSTICK_RADIUS, 0x000000, 0.2)
        .setDepth(1000000000)
        .setAlpha(idleOpacity);
      const joystickThumb = this.add
        .circle(0, 0, JOYSTICK_RADIUS / 2, 0xffffff, 0.2)
        .setDepth(1000000000)
        .setAlpha(idleOpacity);

      const joystick = new VirtualJoystick(this, {
        x: 0,
        y: 0,
        base: joystickBase,
        thumb: joystickThumb,
        forceMin: 0,
      });

      this.joystick = joystick;

      // swipe for pointer input
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        const setPositionX =
          centerX + (pointer.x - centerX) / this.cameras.main.zoom;
        const setPositionY =
          centerY + (pointer.y - centerY) / this.cameras.main.zoom;

        // set opacity and set joystick base to starting position
        joystickBase.setAlpha(1.0);
        joystickThumb.setAlpha(1.0);
        joystick.setPosition(setPositionX, setPositionY);
      });
      this.input.on("pointerup", () => {
        // reset joystick position and opacity when swipe is done
        joystickBase.setAlpha(idleOpacity);
        joystickThumb.setAlpha(idleOpacity);

        const defaultPosition = this.joystickDefaultPosition;
        joystick.setPosition(defaultPosition.x, defaultPosition.y);
      });
    }

    // Initialise Keyboard
    this.cursorKeys = this.input.keyboard?.createCursorKeys();
    if (this.cursorKeys) {
      const mmoLocalSettings = JSON.parse(
        localStorage.getItem("mmo_settings") ?? "{}",
      );
      const layout = mmoLocalSettings.layout ?? "QWERTY";

      // add WASD keys
      this.cursorKeys.w = this.input.keyboard?.addKey(
        layout === "QWERTY" ? "W" : "Z",
        false,
      );
      this.cursorKeys.a = this.input.keyboard?.addKey(
        layout === "QWERTY" ? "A" : "Q",
        false,
      );
      this.cursorKeys.s = this.input.keyboard?.addKey("S", false);
      this.cursorKeys.d = this.input.keyboard?.addKey("D", false);

      this.input.keyboard?.removeCapture("SPACE");
    }

    this.input.setTopOnly(true);
  }

  /**
   * Updates the player.
   */
  updatePlayer() {
    if (!this.currentPlayer?.body) return;

    // joystick is active if force is greater than zero
    this.movementAngle =
      this.joystick?.force &&
      this.joystick.force >= JOYSTICK_FORCE_MIN * this.joystickScale
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
        this.walkingSpeed * Math.cos((this.movementAngle * Math.PI) / 180),
        this.walkingSpeed * Math.sin((this.movementAngle * Math.PI) / 180),
      );
    } else {
      currentPlayerBody.setVelocity(0, 0);
    }

    // set joystick indicator dot if joystick is active
    if (this.joystick && this.joystick.force) {
      const angle = (this.joystick.angle / 180.0) * Math.PI;
      const distance = Math.min(
        this.joystick.force,
        JOYSTICK_RADIUS * this.joystickScale,
      );
      const offset = { x: 5, y: 1 };
      const scale = 0.22 / this.joystickScale;

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

    this.joystickIndicatorBase?.setDepth(this.currentPlayer.y - 0.0001);
    this.currentPlayer.setDepth(this.currentPlayer.y);
  }

  /**
   * Changes the dark mode setting when the event is triggered.
   * @param event The event.
   */
  private onSetDarkMode = (event: CustomEvent) => {
    // get pipeline
    const darkModePipeline = this.cameras.main.getPostPipeline(
      "DarkModePipeline",
    ) as DarkModePipeline;
    if (!darkModePipeline) return;

    // set dark mode
    darkModePipeline.isDarkMode = event.detail;
  };

  /**
   * Changes the zoom out setting when the event is triggered.
   * @param event The event.
   */
  private onSetZoomOut = (event: CustomEvent) => {
    // does not zoom out if not on small screen
    const zoomOutScale = this.isSmallScreen ? ZOOM_OUT_SCALE : this.initialZoom;

    // set zoom out
    this.cameras.main.zoom = event.detail ? zoomOutScale : this.initialZoom;

    if (!this.joystick) return;

    // update joystick position and size
    (this.joystick as any).radius = JOYSTICK_RADIUS * this.joystickScale;
    (this.joystick?.base as Phaser.GameObjects.Arc)?.setScale(
      this.joystickScale,
    );
    (this.joystick?.thumb as Phaser.GameObjects.Arc)?.setScale(
      this.joystickScale,
    );

    const defaultPosition = this.joystickDefaultPosition;
    this.joystick?.setPosition(defaultPosition.x, defaultPosition.y);
  };

  /**
   * Initializes the listeners.
   */
  private initializeListeners = () => {
    // add dark mode shader
    (
      this.renderer as Phaser.Renderer.WebGL.WebGLRenderer
    ).pipelines?.addPostPipeline("DarkModePipeline", DarkModePipeline);
    this.cameras.main.setPostPipeline(DarkModePipeline);

    // add event listener for settings
    window.addEventListener(DARK_MODE_EVENT as any, this.onSetDarkMode);
    this.onSetDarkMode({ detail: getDarkModeSetting() } as CustomEvent);
    window.addEventListener(ZOOM_OUT_EVENT as any, this.onSetZoomOut);
    this.onSetZoomOut({ detail: getZoomOutSetting() } as CustomEvent);

    // get pipeline
    const darkModePipeline = this.cameras.main.getPostPipeline(
      "DarkModePipeline",
    ) as DarkModePipeline;
    if (!darkModePipeline) return;

    // set light sources
    darkModePipeline.lightSources = [{ x: 0.5, y: 0.5 }];
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
          harvestCrop: (crops, cropIndex) => this.harvestCrop(crops, cropIndex),
        }),
    );
  }

  /**
   * Creates normal chickens for a given direction.
   * @param direction The direction.
   * @returns All normal chickens for a given direction.
   */
  private createNormalChickens = (
    direction: "left" | "right" | "up" | "down",
  ) => {
    return CHICKEN_SPAWN_CONFIGURATIONS.flatMap((config) =>
      Array.from(
        { length: config.count },
        () =>
          new NormalChickenContainer({
            x:
              direction === "left" || direction === "right"
                ? Phaser.Math.RND.realInRange(0, BOARD_WIDTH) + BOARD_OFFSET
                : SQUARE_WIDTH *
                    (config.track + Phaser.Math.RND.realInRange(-2, 2)) +
                  CHICKEN_SPRITE_PROPERTIES.frameHeight / 2,
            y:
              direction === "up" || direction === "down"
                ? Phaser.Math.RND.realInRange(0, BOARD_WIDTH) + BOARD_OFFSET
                : SQUARE_WIDTH *
                    (config.track + Phaser.Math.RND.realInRange(-2, 2)) +
                  CHICKEN_SPRITE_PROPERTIES.frameHeight / 2,
            direction: direction,
            scene: this,
            player: this.currentPlayer,
            killPlayer: () => this.killPlayer("normal"),
          }),
      ),
    );
  };

  /**
   * Creates all normal chickens in the game.
   * @returns All normal chickens in the game.
   */
  private createAllNormalChickens = () => {
    const chickensFacingLeft = this.createNormalChickens("left");
    const chickensFacingRight = this.createNormalChickens("right");
    const chickensFacingUp = this.createNormalChickens("up");
    const chickensFacingDown = this.createNormalChickens("down");

    this.chickens = [
      ...chickensFacingLeft,
      ...chickensFacingRight,
      ...chickensFacingUp,
      ...chickensFacingDown,
    ];
  };

  /**
   * Animates depositing crops.
   */
  private animateDepositingCrops = () => {
    // skip function if player not found
    if (!this.currentPlayer) return;
    const player = this.currentPlayer;

    // animate for each crop in inventory
    this.inventoryCropIndexes.forEach(async (cropIndex, index) => {
      const cropSprite = this.add.sprite(
        player.x,
        player.y,
        "crop_harvested",
        cropIndex,
      );

      // adjust the angle and distance for the crop to radiate outward
      const angle = Phaser.Math.Angle.Random();
      const distance = Phaser.Math.RND.between(16, 20);

      this.tweens.add({
        targets: cropSprite,
        x: player.x + distance * Math.cos(angle),
        y: player.y + distance * Math.sin(angle),
        duration: 200,
        ease: "Quad.easeOut",
        onUpdate: () => {
          cropSprite.setDepth(cropSprite.y);
        },
        onComplete: (
          _: Phaser.Tweens.Tween,
          targets: Phaser.GameObjects.Sprite[],
        ) => {
          // fading tween starts when movement tween is complete
          targets.forEach((cropSprite) => {
            this.tweens.add({
              targets: cropSprite,
              x: DEPOSIT_CHEST_XY,
              y: DEPOSIT_CHEST_XY,
              duration: 250,
              delay: index * 50, // delay each crop animation slightly
              ease: "Cubic.easeIn",
              onUpdate: () => {
                cropSprite.setDepth(cropSprite.y);
              },
              onComplete: () => {
                if (cropSprite.active) cropSprite.destroy();
                const sound = this.sound.add("crop_deposit_pop");
                sound.play({
                  volume: 0.1,
                  detune: Phaser.Math.RND.between(-300, 300),
                });
              },
            });
          });
        },
      });
    });
  };

  /**
   * Harvests a crop.
   * @param crops The crop sprites.
   * @param cropIndex The crop index.
   */
  private harvestCrop = (
    crops: Phaser.GameObjects.Sprite[],
    cropIndex: number,
  ) => {
    // destroy planted crop sprites
    crops.forEach((crop) => {
      if (crop.active) crop.destroy();
    });

    // play sound
    const sound = this.sound.add("harvest");
    sound.play({ volume: 0.1 });

    // add crop to inventory
    this.portalService?.send("CROP_HARVESTED", { cropIndex: cropIndex });
  };

  /**
   * Deposits crops.
   */
  private depositCrops = () => {
    // achievements
    this.checkAchievements("empty deposit");

    // skip function if there are nothing to deposit
    if (this.inventoryCropIndexes.length === 0) return;

    // play sound
    const cropDepositSound = this.sound.add("crop_deposit");
    cropDepositSound.play({ volume: 0.1 });

    // play target reached sound if target is reached
    if (
      this.target >= 0 &&
      this.score < this.target &&
      this.score + this.inventory >= this.target
    ) {
      const targetReachedSound = this.sound.add("target_reached");
      targetReachedSound.play({ volume: 1.0 });
    }

    // achievements
    this.checkAchievements("deposit");

    // score and remove all crops from inventory
    this.animateDepositingCrops();
    this.portalService?.send("CROP_DEPOSITED");
  };

  /**
   * Animates dropping crops when player is killed.
   */
  private animateDroppingCrops = () => {
    // skip function if player not found
    if (!this.currentPlayer) return;
    const player = this.currentPlayer;

    // animate for each crop in inventory
    this.inventoryCropIndexes.forEach((cropIndex) => {
      const cropSprite = this.add.sprite(
        player.x,
        player.y,
        "crop_harvested",
        cropIndex,
      );

      // adjust the angle and distance for the crop to radiate outward
      const angle = Phaser.Math.Angle.Random();
      const distance = Phaser.Math.RND.between(30, 50);

      this.tweens.add({
        targets: cropSprite,
        x: player.x + distance * Math.cos(angle),
        y: player.y + distance * Math.sin(angle),
        duration: 400,
        ease: "Quad.easeOut",
        onUpdate: () => {
          cropSprite.setDepth(cropSprite.y);
        },
        onComplete: (
          _: Phaser.Tweens.Tween,
          targets: Phaser.GameObjects.Sprite[],
        ) => {
          // fading tween starts when movement tween is complete
          targets.forEach((cropSprite) => {
            this.tweens.add({
              targets: cropSprite,
              alpha: 0, // fade out to completely transparent
              delay: 500,
              duration: 500, // fade out duration
              onComplete: () => {
                if (cropSprite.active) cropSprite.destroy(); // destroy sprite after fading out
              },
            });
          });
        },
      });
    });
  };

  /**
   * Kills the player then respawns the player.
   */
  private killPlayer = (chickenType: chickenType) => {
    if (!this.currentPlayer?.body || this.isDead || !this.isGamePlaying) {
      return;
    }

    // freeze player
    this.isDead = true;
    this.deaths += 1;
    this.currentPlayer.setVisible(false);

    // play sound
    const sound = this.sound.add("player_killed");
    sound.play({ volume: 0.25 });

    // achievements
    this.checkAchievements(
      chickenType === "normal"
        ? "player killed by normal chicken"
        : "player killed by hunter chicken",
    );

    // throw all crops out of the inventory
    this.animateDroppingCrops();
    this.portalService?.send("PLAYER_KILLED");

    const spriteName = "player_death";
    const spriteKey = "player_death_anim";

    const playerDeath = this.add.sprite(
      this.currentPlayer.x,
      this.currentPlayer.y - 1,
      spriteName,
    );
    playerDeath.setDepth(this.currentPlayer.body.position.y);
    if (getHolidayEvent() === "halloween") {
      playerDeath.setAlpha(HALLOWEEN_PLAYER_OPACITY);
    }

    if (!this.anims.exists(spriteKey as string)) {
      this.anims.create({
        key: spriteKey,
        frames: this.anims.generateFrameNumbers(spriteName, {
          start: 0,
          end: PLAYER_DEATH_SPRITE_PROPERTIES.frames - 1,
        }),
        repeat: 0,
        frameRate: SPRITE_FRAME_RATE,
      });
    }

    playerDeath.play({ key: spriteKey });
    if (this.currentPlayer.directionFacing === "left") {
      playerDeath.setFlipX(true);
    }

    playerDeath.on("animationcomplete", async () => {
      if (!this.currentPlayer) return;

      await new Promise((res) => setTimeout(res, 1000));

      this.currentPlayer.x = SPAWNS().crops_and_chickens.default.x;
      this.currentPlayer.y = SPAWNS().crops_and_chickens.default.y;

      this.isDead = false;

      // show player if player is still playing
      if (this.isGamePlaying) this.currentPlayer.setVisible(true);

      if (playerDeath.active) playerDeath.destroy();
      this.hunterChicken?.respawn();
    });
  };

  /**
   * Ends the game.
   */
  private endGame = () => {
    this.portalService?.send("GAME_OVER");

    // play sound
    const sound = this.sound.add("game_over");
    sound.play({ volume: 0.5 });

    // hide player
    this.currentPlayer?.setVisible(false);

    // achievements
    this.checkAchievements("game over");
  };

  private checkAchievements = (trigger: AchievementTrigger) => {
    if (!this.hasBetaAccess) return;

    const achievementNames = getEligibleAchievements(this, trigger);

    if (achievementNames.length > 0) this.unlockAchievements(achievementNames);
  };

  private unlockAchievements = (
    achievementNames: CropsAndChickensAchievementName[],
  ) => {
    // if no new achievements, return
    if (
      achievementNames.every((name) =>
        this.existingAchievementNames?.includes(name),
      )
    ) {
      return;
    }

    if (!this.achievementGetSound?.isPlaying)
      this.achievementGetSound?.play({ volume: 0.3 });
    this.portalService?.send("UNLOCKED_ACHIEVEMENTS", {
      achievementNames: achievementNames,
    });
  };
}
