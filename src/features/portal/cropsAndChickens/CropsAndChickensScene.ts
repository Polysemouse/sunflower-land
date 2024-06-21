import mapJson from "assets/map/crops_and_chickens.json";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SPAWNS } from "features/world/lib/spawn";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { Physics } from "phaser";
import { MachineInterpreter } from "./lib/cropsAndChickensMachine";
import {
  DEPOSIT_CHEST_XY,
  BOARD_OFFSET,
  BOARD_WIDTH,
  CHICKEN_SPAWN_CONFIGURATIONS,
  CHICKEN_SPEEDS,
  CHICKEN_SPRITE_PROPERTIES,
  CROP_DEPOSIT_AREA_DIMENSIONS,
  CROP_SPAWN_CONFIGURATIONS,
  GAME_SECONDS,
  PLAYER_DEATH_SPRITE_PROPERTIES,
  PLAYER_MAX_XY,
  PLAYER_MIN_XY,
  PLAYER_WALKING_SPEED,
  SCORE_TABLE,
  DEPOSIT_INDICATOR_PLAYER_DISTANCE,
} from "./CropsAndChickensConstants";

type ChickenDirection = "left" | "right" | "up" | "down";

export class CropsAndChickensScene extends BaseScene {
  sceneId: SceneId = "crops_and_chickens";

  isPlayerDead = false;
  chickens: Phaser.GameObjects.Sprite[] = [];
  collectedCropIndexes: number[] = [];

  cropDepositArrow?: Phaser.GameObjects.Sprite;

  initializeStates = () => {
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

  constructor() {
    super({
      name: "crops_and_chickens",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  public get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }

  get secondsLeft() {
    const endAt = this.portalService?.state.context.endAt;
    const secondsLeft = !endAt
      ? GAME_SECONDS
      : Math.max(endAt - Date.now(), 0) / 1000;
    return secondsLeft;
  }

  get isRulesRead() {
    return (
      this.portalService?.state.matches("ready") === true ||
      this.portalService?.state.matches("playing") === true
    );
  }

  get isGameStarted() {
    return this.portalService?.state.matches("playing") === true;
  }

  preload() {
    super.preload();

    // spritesheets
    this.load.spritesheet("player_death", "world/player_death.png", {
      frameWidth: PLAYER_DEATH_SPRITE_PROPERTIES.frameWidth,
      frameHeight: PLAYER_DEATH_SPRITE_PROPERTIES.frameHeight,
    });
    this.load.spritesheet("chicken_left", "world/chicken_left_movements.png", {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    });
    this.load.spritesheet(
      "chicken_right",
      "world/chicken_right_movements.png",
      {
        frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
        frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
      }
    );
    this.load.spritesheet("chicken_up", "world/chicken_up_movements.png", {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    });
    this.load.spritesheet("chicken_down", "world/chicken_down_movements.png", {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    });
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

    // crop deposit arrow
    this.load.spritesheet("crop_harvested", "world/crops_harvested.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    // ambience SFX
    if (!this.sound.get("nature_1")) {
      const nature1 = this.sound.add("nature_1");
      nature1.play({ loop: true, volume: 0.01 });
    }

    // load Sound Effects
    this.load.audio("crop_deposit", "world/crop_deposit.mp3");
    this.load.audio("harvest", "world/harvest.mp3");
    this.load.audio("player_death", "world/player_death.mp3");

    // shut down the sound when the scene changes
    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "main-map",
    });

    super.create();

    this.initializeStates();

    this.createStorageArea();

    this.createAllCrops();

    this.createChickenAnimations();
    this.createAllChickens();

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

  update() {
    if (!this.currentPlayer || !this.currentPlayer.body) {
      return;
    }

    if (this.isGameStarted && this.secondsLeft <= 0) {
      this.endGame();
    }

    // start game if player decides to move
    if (!this.isGameStarted && this.isMoving) {
      this.portalService?.send("START");
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
   * Creates animations for chickens.
   */
  private createChickenAnimations() {
    ["left", "right", "up", "down"].forEach((direction) => {
      const spriteName = `chicken_${direction}`;
      const spriteKey = `chicken_${direction}_anim`;
      this.anims.create({
        key: spriteKey,
        frames: this.anims.generateFrameNumbers(spriteName, {
          start: 0,
          end: CHICKEN_SPRITE_PROPERTIES.frames - 1,
        }),
        repeat: -1,
        frameRate: 10,
      });
    });
  }

  private createStorageArea() {
    const storageArea = this.add.sprite(
      CROP_DEPOSIT_AREA_DIMENSIONS.x,
      CROP_DEPOSIT_AREA_DIMENSIONS.y,
      ""
    );
    this.physics.add.existing(storageArea);
    storageArea.setVisible(false);

    if (!storageArea.body) return;
    if (!this.currentPlayer) return;

    (storageArea.body as Physics.Arcade.Body)
      .setSize(
        CROP_DEPOSIT_AREA_DIMENSIONS.width,
        CROP_DEPOSIT_AREA_DIMENSIONS.height
      )
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(false);

    this.physics.add.overlap(
      this.currentPlayer,
      storageArea,
      () => {
        this.depositCrops();
      },
      undefined,
      this
    );
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
   * Creates a chicken.
   * @param x The x coordinate of the chicken.
   * @param y The y coordinate of the chicken.
   * @param direction The chicken direction.
   * @returns The chicken group for that chicken.
   */
  private createChicken(x: number, y: number, direction: ChickenDirection) {
    const spriteName = `chicken_${direction}`;
    const spriteKey = `chicken_${direction}_anim`;

    const chicken = this.add.sprite(x, y, spriteName);

    const startFrame = Phaser.Math.RND.integerInRange(
      0,
      CHICKEN_SPRITE_PROPERTIES.frames - 1
    );
    let forwardSpeed = Phaser.Math.RND.realInRange(
      CHICKEN_SPEEDS.forwardMin,
      CHICKEN_SPEEDS.forwardMax
    );

    chicken.play({ key: spriteKey, startFrame: startFrame });

    chicken.on(
      "animationupdate",
      (
        _animation: Phaser.Animations.Animation,
        frame: Phaser.Animations.AnimationFrame
      ) => {
        if (frame.index === 4) {
          forwardSpeed = Phaser.Math.Clamp(
            forwardSpeed +
              Phaser.Math.RND.realInRange(
                -0.5 * (forwardSpeed - CHICKEN_SPEEDS.forwardMin) - 2,
                0.5 * (CHICKEN_SPEEDS.forwardMax - forwardSpeed) + 2
              ),
            CHICKEN_SPEEDS.forwardMin,
            CHICKEN_SPEEDS.forwardMax
          );
        }
        if (!chicken.body) return;

        if (frame.index < 4) {
          chicken.body.velocity.x =
            direction === "left"
              ? -forwardSpeed
              : direction === "right"
              ? forwardSpeed
              : 0;
          chicken.body.velocity.y =
            direction === "up"
              ? -forwardSpeed
              : direction === "down"
              ? forwardSpeed
              : 0;
        }
        if (frame.index >= 4) {
          chicken.body.velocity.x = 0;
          chicken.body.velocity.y = 0;
        }
      }
    );
    this.physics.add.existing(chicken);

    if (!!chicken.body && !!this.currentPlayer) {
      (chicken.body as Physics.Arcade.Body)
        .setSize(11, 9)
        .setOffset(1, 3)
        .setImmovable(true)
        .setCollideWorldBounds(false);

      this.physics.add.overlap(
        this.currentPlayer,
        chicken,
        () => {
          this.killPlayer();
        },
        undefined,
        this
      );
    }

    return chicken;
  }

  /**
   * Creates chickens for a given direction.
   */
  private createChickens(direction: ChickenDirection) {
    return CHICKEN_SPAWN_CONFIGURATIONS.flatMap((config) =>
      Array.from({ length: config.count }, () =>
        this.createChicken(
          direction === "left" || direction === "right"
            ? Phaser.Math.RND.realInRange(0, BOARD_WIDTH) + BOARD_OFFSET
            : SQUARE_WIDTH *
                (config.track + Phaser.Math.RND.realInRange(-2, 2)) +
                CHICKEN_SPRITE_PROPERTIES.frameHeight / 2,
          direction === "up" || direction === "down"
            ? Phaser.Math.RND.realInRange(0, BOARD_WIDTH) + BOARD_OFFSET
            : SQUARE_WIDTH *
                (config.track + Phaser.Math.RND.realInRange(-2, 2)) +
                CHICKEN_SPRITE_PROPERTIES.frameHeight / 2,
          direction
        )
      )
    );
  }

  /**
   * Creates all the chickens for the map.
   */
  private createAllChickens() {
    const chickensFacingLeft = this.createChickens("left");
    const chickensFacingRight = this.createChickens("right");
    const chickensFacingUp = this.createChickens("up");
    const chickensFacingDown = this.createChickens("down");

    this.chickens = [
      ...chickensFacingLeft,
      ...chickensFacingRight,
      ...chickensFacingUp,
      ...chickensFacingDown,
    ];
  }

  private depositCrops() {
    if (this.collectedCropIndexes.length === 0) {
      return;
    }

    // play sound
    const sound = this.sound.add("crop_deposit");
    sound.play({ volume: 0.1 });

    // score and throw all crops out of the inventory
    this.animateDepositingCrops();
    this.collectedCropIndexes = [];
    this.portalService?.send("CROP_DEPOSITED");
  }

  private killPlayer() {
    if (!this.currentPlayer || this.isPlayerDead) {
      return;
    }

    // freeze player
    this.walkingSpeed = 0;
    this.isPlayerDead = true;
    this.currentPlayer.setVisible(false);

    // play sound
    const sound = this.sound.add("player_death");
    sound.play({ volume: 0.1 });

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
        frameRate: 10,
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
      if (this.isGameStarted) {
        this.walkingSpeed = PLAYER_WALKING_SPEED;
        this.currentPlayer.setVisible(true);
      }

      playerDeath.destroy();
    });
  }

  private animateDepositingCrops() {
    if (!this.currentPlayer) {
      return;
    }
    const player = this.currentPlayer;

    this.collectedCropIndexes.forEach(async (cropIndex, index) => {
      const cropSprite = this.add.sprite(
        player.x,
        player.y,
        "crop_harvested",
        cropIndex
      );

      // adjust the angle and distance for the crop to radiate outward
      const angle = Phaser.Math.RND.angle();
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
              delay: index * 100, // delay each crop animation slightly
              ease: "Cubic.easeIn",
              onUpdate: () => {
                cropSprite.setDepth(cropSprite.y);
              },
              onComplete: () => cropSprite.destroy(),
            });
          });
        },
      });
    });
  }

  private animateDroppingCrops() {
    if (!this.currentPlayer) {
      return;
    }
    const player = this.currentPlayer;

    this.collectedCropIndexes.forEach((cropIndex) => {
      const cropSprite = this.add.sprite(
        player.x,
        player.y,
        "crop_harvested",
        cropIndex
      );

      // adjust the angle and distance for the crop to radiate outward
      const angle = Phaser.Math.RND.angle();
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
  }

  private endGame() {
    this.portalService?.send("GAME_OVER");
    this.collectedCropIndexes = [];

    // freeze player
    this.walkingSpeed = 0;
    this.currentPlayer?.setVisible(false);
  }
}
