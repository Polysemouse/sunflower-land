import mapJson from "assets/map/crops_and_chickens.json";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SPAWNS } from "features/world/lib/spawn";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { Physics } from "phaser";
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
  DEPOSIT_INDICATOR_PLAYER_DISTANCE,
  SPRITE_FRAME_RATE,
  TIME_TICKING_SECONDS,
} from "../CropsAndChickensConstants";
import { NormalChickenContainer } from "./containers/NormalChickenContainer";
import { HunterChickenContainer } from "./containers/HunterChickenContainer";
import { DarkModePipeline } from "../shaders/darkModeShader";
import { getDarkModeSetting } from "lib/utils/hooks/useIsDarkMode";
import { StorageAreaContainer } from "./containers/StorageAreaContainer";

export class CropsAndChickensScene extends BaseScene {
  sceneId: SceneId = "crops_and_chickens";

  isTimeTickingSoundPlayed = false;
  isPlayerDead = false;
  timeTickingSound?:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  chickens: NormalChickenContainer[] = [];
  hunterChicken?: HunterChickenContainer;
  collectedCropIndexes: number[] = [];
  storageArea?: StorageAreaContainer;

  cropDepositArrow?: Phaser.GameObjects.Sprite;

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
      }
    );
    this.load.spritesheet(
      "chicken_normal_right",
      "world/chicken_normal_right_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      }
    );
    this.load.spritesheet(
      "chicken_normal_up",
      "world/chicken_normal_up_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      }
    );
    this.load.spritesheet(
      "chicken_normal_down",
      "world/chicken_normal_down_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      }
    );

    // hunter chicken spritesheets
    this.load.spritesheet(
      "chicken_hunter_left",
      "world/chicken_hunter_left_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      }
    );
    this.load.spritesheet(
      "chicken_hunter_right",
      "world/chicken_hunter_right_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      }
    );
    this.load.spritesheet(
      "chicken_hunter_up",
      "world/chicken_hunter_up_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      }
    );
    this.load.spritesheet(
      "chicken_hunter_down",
      "world/chicken_hunter_down_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      }
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

    // crop deposit arrow
    this.load.spritesheet(
      "crop_deposit_arrow",
      "world/crop_deposit_arrow.png",
      {
        frameWidth: 11,
        frameHeight: 10,
      }
    );

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

    // shut down the sound when the scene changes
    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });
  }

  /**
   * Called when the scene is created.
   */
  async create() {
    this.map = this.make.tilemap({
      key: "main-map",
    });

    super.create();

    this.initializeStates();
    this.initializeShaders();

    this.createAllCrops();
    this.createAllNormalChickens();

    this.storageArea = new StorageAreaContainer({
      scene: this,
      player: this.currentPlayer,
      depositCrops: () => this.depositCrops(),
    });
    this.hunterChicken = new HunterChickenContainer({
      scene: this,
      player: this.currentPlayer,
      isChickenFrozen: () =>
        this.isPlayerDead || this.isPlayerInDepositArea || !this.isGamePlaying,
      killPlayer: () => this.killPlayer(),
    });

    // reload scene when player hit retry
    this.portalService?.onEvent((event) => {
      if (event.type === "RETRY") {
        this.changeScene(this.sceneId);
      }
    });

    // resume player speed after player read the rules
    this.portalService?.onEvent((event) => {
      if (event.type === "CONTINUE") {
        this.walkingSpeed = PLAYER_WALKING_SPEED;
      }
    });

    // create an off screen indicator
    this.cropDepositArrow = this.add.sprite(
      DEPOSIT_CHEST_XY,
      DEPOSIT_CHEST_XY,
      "crop_deposit_arrow"
    );
    this.cropDepositArrow.setDepth(1000000);
    this.cropDepositArrow.setVisible(false); // hide the indicator initially

    this.tweens.add({
      targets: this.cropDepositArrow,
      alpha: { from: 1, to: 0 },
      duration: 500, // duration of the blink (half cycle)
      yoyo: true,
      repeat: -1, // repeat indefinitely
    });
  }

  /**
   * Called every time there is a frame update.
   */
  update() {
    // set joystick state in machine
    this.portalService?.send("SET_JOYSTICK_ACTIVE", {
      isJoystickActive: !!this.joystick?.force,
    });

    // toggle dark mode
    (
      this.cameras.main.getPostPipeline("DarkModePipeline") as DarkModePipeline
    ).isDarkMode = getDarkModeSetting();

    if (
      !this.isTimeTickingSoundPlayed &&
      this.secondsLeft <= TIME_TICKING_SECONDS &&
      this.secondsLeft >= 1
    ) {
      this.isTimeTickingSoundPlayed = true;
      this.timeTickingSound = this.sound.add("time_ticking");
      this.timeTickingSound?.play({ volume: 0.2 });
    }

    if (this.isGamePlaying && this.secondsLeft <= 0) {
      this.endGame();
      this.timeTickingSound?.stop();
    }

    // start game if player decides to move
    if (!this.isGamePlaying && this.isMoving) {
      this.portalService?.send("START");
    }

    if (!this.currentPlayer || !this.currentPlayer.body) {
      return;
    }

    // warp player
    const playerX = Phaser.Math.Wrap(
      this.currentPlayer.x,
      PLAYER_MIN_XY,
      PLAYER_MAX_XY
    );
    const playerY = Phaser.Math.Wrap(
      this.currentPlayer.y,
      PLAYER_MIN_XY,
      PLAYER_MAX_XY
    );
    this.currentPlayer.x = playerX;
    this.currentPlayer.y = playerY;

    // warp chickens around player
    this.chickens.forEach((chicken) => {
      chicken.x = Phaser.Math.Wrap(
        chicken.x,
        playerX - BOARD_WIDTH / 2,
        playerX + BOARD_WIDTH / 2
      );
      chicken.y = Phaser.Math.Wrap(
        chicken.y,
        playerY - BOARD_WIDTH / 2,
        playerY + BOARD_WIDTH / 2
      );
      chicken.setDepth(chicken.y);
    });

    if (this.hunterChicken) {
      this.hunterChicken.x = Phaser.Math.Wrap(
        this.hunterChicken.x,
        playerX - BOARD_WIDTH / 2,
        playerX + BOARD_WIDTH / 2
      );
      this.hunterChicken.y = Phaser.Math.Wrap(
        this.hunterChicken.y,
        playerY - BOARD_WIDTH / 2,
        playerY + BOARD_WIDTH / 2
      );
      this.hunterChicken.setDepth(this.hunterChicken.y);
    }

    // show indicator if off screen
    if (
      !this.cameras.main.worldView.contains(DEPOSIT_CHEST_XY, DEPOSIT_CHEST_XY)
    ) {
      this.moveCropDepositIndicator(playerX, playerY);
    } else {
      // hide the indicator if the object is on the screen
      this.cropDepositArrow?.setVisible(false);
    }

    super.update();
  }

  /**
   * Initializes the game state.
   */
  private initializeStates = () => {
    this.isTimeTickingSoundPlayed = false;
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
   * Moves the crop deposit arrow indicator.
   */
  moveCropDepositIndicator(playerX: number, playerY: number) {
    const angle = Phaser.Math.Angle.Between(
      playerX,
      playerY,
      DEPOSIT_CHEST_XY,
      DEPOSIT_CHEST_XY
    );

    // calculate the position of the indicator
    const indicatorX =
      playerX + Math.cos(angle) * DEPOSIT_INDICATOR_PLAYER_DISTANCE;
    const indicatorY =
      playerY + Math.sin(angle) * DEPOSIT_INDICATOR_PLAYER_DISTANCE;

    // position the indicator sprite and make it visible
    this.cropDepositArrow?.setPosition(indicatorX, indicatorY);
    this.cropDepositArrow?.setVisible(this.collectedCropIndexes.length > 0);

    // rotate the indicator to point towards the object
    this.cropDepositArrow?.setRotation(angle);
  }

  /**
   * Creates a crop.
   * @param x The x coordinate of the crop.
   * @param y The y coordinate of the crop.
   * @returns The crop group for that crop.
   */
  private createCrop(cropIndex: number, x: number, y: number) {
    // wrap crop positions around the board
    x = Phaser.Math.Wrap(x, BOARD_OFFSET, BOARD_OFFSET + BOARD_WIDTH);
    y = Phaser.Math.Wrap(y, BOARD_OFFSET, BOARD_OFFSET + BOARD_WIDTH);

    const spriteName = "crop_planted";

    const crops = [
      this.add.sprite(x, y, spriteName, cropIndex),
      this.add.sprite(x + BOARD_WIDTH, y, spriteName, cropIndex),
      this.add.sprite(x, y + BOARD_WIDTH, spriteName, cropIndex),
      this.add.sprite(x + BOARD_WIDTH, y + BOARD_WIDTH, spriteName, cropIndex),
    ];

    crops.forEach((crop) => {
      this.physics.add.existing(crop);
      crop.setDepth(crop.y);

      if (!crop.body) return;
      if (!this.currentPlayer) return;

      (crop.body as Physics.Arcade.Body)
        .setSize(16, 12)
        .setOffset(0, 11)
        .setImmovable(true)
        .setCollideWorldBounds(true);

      this.physics.add.overlap(
        this.currentPlayer,
        crop,
        () => {
          crops.forEach((crop) => crop.destroy());
          const sound = this.sound.add("harvest");
          sound.play({ volume: 0.1 });

          const cropIndex = Number(crop.frame.name);
          this.collectedCropIndexes = [...this.collectedCropIndexes, cropIndex];
          const cropPoint = SCORE_TABLE[cropIndex].points;
          this.portalService?.send("CROP_HARVESTED", { points: cropPoint });
        },
        undefined,
        this
      );
    });

    return crops;
  }

  /**
   * Creates all the crops for the map.
   */
  private createAllCrops() {
    return CROP_SPAWN_CONFIGURATIONS.map((config) =>
      this.createCrop(
        config.cropIndex,
        SQUARE_WIDTH * config.x + 8,
        SQUARE_WIDTH * config.y + 1
      )
    );
  }

  /**
   * Creates normal chickens for a given direction.
   * @param direction The direction.
   * @returns All normal chickens for a given direction.
   */
  private createNormalChickens = (
    direction: "left" | "right" | "up" | "down"
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
          })
      )
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
    this.collectedCropIndexes.forEach(async (cropIndex, index) => {
      const cropSprite = this.add.sprite(
        player.x,
        player.y,
        "crop_harvested",
        cropIndex
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
          targets: Phaser.GameObjects.Sprite[]
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
                cropSprite.destroy();
                const sound = this.sound.add("crop_deposit_pop");
                sound.play({ volume: 0.1 });
              },
            });
          });
        },
      });
    });
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
        cropIndex
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
          targets: Phaser.GameObjects.Sprite[]
        ) => {
          // fading tween starts when movement tween is complete
          targets.forEach((cropSprite) => {
            this.tweens.add({
              targets: cropSprite,
              alpha: 0, // fade out to completely transparent
              delay: 500,
              duration: 500, // fade out duration
              onComplete: () => {
                cropSprite.destroy(); // destroy sprite after fading out
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
    if (!this.currentPlayer || this.isPlayerDead || !this.isGamePlaying) {
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
      spriteName
    );
    playerDeath.setDepth(playerDeath.y);

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

      playerDeath.destroy();
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
