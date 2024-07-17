import mapJson from "assets/map/crops_and_chickens.json";
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
  SCORE_TABLE,
  SPRITE_FRAME_RATE,
  TIME_TICKING_SECONDS,
} from "../CropsAndChickensConstants";
import { NormalChickenContainer } from "./containers/NormalChickenContainer";
import { HunterChickenContainer } from "./containers/HunterChickenContainer";
import { DarkModePipeline } from "../shaders/darkModeShader";
import { getDarkModeSetting } from "lib/utils/hooks/useIsDarkMode";
import { StorageAreaContainer } from "./containers/StorageAreaContainer";
import { DepositIndicatorContainer } from "./containers/DepositIndicatorContainer";
import { CropContainer } from "./containers/CropContainer";
import { EventObject } from "xstate";

export class CropsAndChickensScene extends BaseScene {
  sceneId: SceneId = "crops_and_chickens";

  isPlayerDead = false;
  collectedCropIndexes: number[] = [];

  chickens: NormalChickenContainer[] = [];
  hunterChicken?: HunterChickenContainer;
  storageArea?: StorageAreaContainer;
  depositIndicator?: DepositIndicatorContainer;

  timeTickingSound?:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;

  constructor() {
    super({
      name: "crops_and_chickens",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  /**
   * The portal service.
   */
  private get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }

  /**
   * The number of seconds left for the game.
   */
  private get secondsLeft() {
    const endAt = this.portalService?.state.context.endAt;
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

    // player death spritesheets
    this.load.spritesheet("player_death", "world/player_death.png", {
      frameWidth: PLAYER_DEATH_SPRITE_PROPERTIES.frameWidth,
      frameHeight: PLAYER_DEATH_SPRITE_PROPERTIES.frameHeight,
    });

    // normal chicken spritesheets
    this.load.spritesheet(
      "chicken_normal_left",
      "world/chicken_normal_left_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      },
    );
    this.load.spritesheet(
      "chicken_normal_right",
      "world/chicken_normal_right_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      },
    );
    this.load.spritesheet(
      "chicken_normal_up",
      "world/chicken_normal_up_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      },
    );
    this.load.spritesheet(
      "chicken_normal_down",
      "world/chicken_normal_down_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      },
    );

    // hunter chicken spritesheets
    this.load.spritesheet(
      "chicken_hunter_left",
      "world/chicken_hunter_left_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      },
    );
    this.load.spritesheet(
      "chicken_hunter_right",
      "world/chicken_hunter_right_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      },
    );
    this.load.spritesheet(
      "chicken_hunter_up",
      "world/chicken_hunter_up_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      },
    );
    this.load.spritesheet(
      "chicken_hunter_down",
      "world/chicken_hunter_down_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      },
    );

    // crops spritesheets
    this.load.spritesheet("crop_planted", "world/crops_planted.png", {
      frameWidth: 16,
      frameHeight: 20,
    });
    this.load.spritesheet("crop_harvested", "world/crops_harvested.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    // deposit indicator
    this.load.image("crop_deposit_arrow", "world/crop_deposit_arrow.png");

    // ambience SFX
    if (!this.sound.get("nature_1")) {
      const nature1 = this.sound.add("nature_1");
      nature1.play({ loop: true, volume: 0.01 });
    }

    // sound effects
    this.load.audio("crop_deposit", "world/crop_deposit.mp3");
    this.load.audio("crop_deposit_pop", "world/crop_deposit_pop.mp3");
    this.load.audio("harvest", "world/harvest.mp3");
    this.load.audio("player_killed", "world/player_killed.mp3");
    this.load.audio("time_ticking", "world/time_ticking.mp3");
    this.load.audio("game_over", "world/game_over.mp3");
  }

  /**
   * Called when the scene is created.
   */
  async create() {
    this.map = this.make.tilemap({
      key: "main-map",
    });

    super.create();

    // remove camera bounds so that the camera does not stop at the edge of the map when player wraps around
    this.cameras.main.removeBounds();

    this.initializeStates();
    this.initializeShaders();

    this.createAllCrops();
    this.createAllNormalChickens();

    this.hunterChicken = new HunterChickenContainer({
      scene: this,
      player: this.currentPlayer,
      isChickenFrozen: () =>
        this.isPlayerDead || this.isPlayerInDepositArea || !this.isGamePlaying,
      killPlayer: () => this.killPlayer(),
    });

    this.storageArea = new StorageAreaContainer({
      scene: this,
      player: this.currentPlayer,
      depositCrops: () => this.depositCrops(),
    });

    this.depositIndicator = new DepositIndicatorContainer({
      scene: this,
      player: this.currentPlayer,
      hasCropsInInventory: () => this.collectedCropIndexes.length > 0,
    });

    // reload scene when player hit retry
    const onRetry = (event: EventObject) => {
      if (event.type === "RETRY") {
        this.changeScene(this.sceneId);
      }
    };
    this.portalService?.onEvent(onRetry);

    // resume player speed after player read the rules
    this.portalService?.onEvent((event) => {
      if (event.type === "CONTINUE") {
        this.walkingSpeed = PLAYER_WALKING_SPEED;
      }
    });

    // cleanup event listeners when scene is shut down
    this.events.on("shutdown", () => {
      this.portalService?.off(onRetry);
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });
  }

  /**
   * Called every time there is a frame update.
   */
  update() {
    // update shader rendering
    this.updateShaders();

    // set joystick state in machine
    this.portalService?.send("SET_JOYSTICK_ACTIVE", {
      isJoystickActive: !!this.joystick?.force,
    });

    // play ticking sound if time is going to run out
    if (
      this.isGamePlaying &&
      !this.timeTickingSound &&
      this.secondsLeft <= TIME_TICKING_SECONDS &&
      this.secondsLeft > 0
    ) {
      this.timeTickingSound = this.sound.add("time_ticking");
      this.timeTickingSound.play({ volume: 0.2 });
    }

    // start game if player decides to move
    if (!this.isGamePlaying && this.isMoving) {
      this.portalService?.send("START");
    }

    // end game when time is up
    if (this.isGamePlaying && this.secondsLeft <= 0) {
      this.endGame();
      this.timeTickingSound?.stop();
      this.timeTickingSound = undefined;
    }

    // warp entities
    if (this.currentPlayer) {
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

    super.update();
  }

  /**
   * Initializes the game state.
   */
  private initializeStates = () => {
    this.isPlayerDead = false;
    this.chickens = [];
    this.collectedCropIndexes = [];

    this.walkingSpeed = 0;
    this.currentPlayer?.setVisible(true);

    this.time.addEvent({
      delay: 500,
      callback: () => {
        if (this.isRulesRead) {
          this.walkingSpeed = PLAYER_WALKING_SPEED;
        }
      },
      callbackScope: this,
    });
  };

  /**
   * Initializes the camera shader.
   */
  private initializeShaders = () => {
    (
      this.renderer as Phaser.Renderer.WebGL.WebGLRenderer
    ).pipelines.addPostPipeline("DarkModePipeline", DarkModePipeline);
    this.cameras.main.setPostPipeline(DarkModePipeline);
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
            killPlayer: () => this.killPlayer(),
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
   * Updates the camera shader.
   */
  private updateShaders = () => {
    // get pipeline
    const darkModePipeline = this.cameras.main.getPostPipeline(
      "DarkModePipeline",
    ) as DarkModePipeline;

    // toggle dark mode
    darkModePipeline.isDarkMode = getDarkModeSetting();

    if (this.currentPlayer) {
      // calculate the player's position relative to the camera
      const relativeX =
        ((this.currentPlayer.x - this.cameras.main.worldView.x) /
          this.cameras.main.width) *
        this.cameras.main.zoom;
      const relativeY =
        ((this.currentPlayer.y - this.cameras.main.worldView.y) /
          this.cameras.main.height) *
        this.cameras.main.zoom;

      // set the light sources
      darkModePipeline.lightSources = [{ x: relativeX, y: relativeY }];
    }
  };

  /**
   * Animates depositing crops.
   */
  private animateDepositingCrops = () => {
    // skip function if player not found
    if (!this.currentPlayer) return;
    const player = this.currentPlayer;

    // animate for each crop in inventory
    this.collectedCropIndexes.forEach(async (cropIndex, index) => {
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
    this.collectedCropIndexes = [...this.collectedCropIndexes, cropIndex];
    const cropPoint = SCORE_TABLE[cropIndex].points;
    this.portalService?.send("CROP_HARVESTED", { points: cropPoint });
  };

  /**
   * Deposits crops.
   */
  private depositCrops = () => {
    // skip function if there are nothing to deposit
    if (this.collectedCropIndexes.length === 0) return;

    // play sound
    const sound = this.sound.add("crop_deposit");
    sound.play({ volume: 0.1 });

    // score and remove all crops from inventory
    this.animateDepositingCrops();
    this.collectedCropIndexes = [];
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
    this.collectedCropIndexes.forEach((cropIndex) => {
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
  private killPlayer = () => {
    if (!this.currentPlayer?.body || this.isPlayerDead || !this.isGamePlaying) {
      return;
    }

    // freeze player
    this.walkingSpeed = 0;
    this.isPlayerDead = true;
    this.currentPlayer.setVisible(false);

    // play sound
    const sound = this.sound.add("player_killed");
    sound.play({ volume: 0.25 });

    // throw all crops out of the inventory
    this.animateDroppingCrops();
    this.collectedCropIndexes = [];
    this.portalService?.send("KILL_PLAYER");

    const spriteName = "player_death";
    const spriteKey = "player_death_anim";

    const playerDeath = this.add.sprite(
      this.currentPlayer.x,
      this.currentPlayer.y - 1,
      spriteName,
    );
    playerDeath.setDepth(this.currentPlayer.body.position.y);

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
      if (!this.currentPlayer) {
        return;
      }

      await new Promise((res) => setTimeout(res, 1000));

      this.currentPlayer.x = SPAWNS().crops_and_chickens.default.x;
      this.currentPlayer.y = SPAWNS().crops_and_chickens.default.y;

      this.isPlayerDead = false;

      // does not allow player from walking around if player respawns after time is out
      if (this.isGamePlaying) {
        this.walkingSpeed = PLAYER_WALKING_SPEED;
        this.currentPlayer.setVisible(true);
      }

      if (playerDeath.active) playerDeath.destroy();
      this.hunterChicken?.respawn();
    });
  };

  /**
   * Ends the game.
   */
  private endGame = () => {
    this.portalService?.send("GAME_OVER");
    this.collectedCropIndexes = [];

    // play sound
    const sound = this.sound.add("game_over");
    sound.play({ volume: 0.5 });

    // freeze player
    this.walkingSpeed = 0;
    this.currentPlayer?.setVisible(false);
  };
}
