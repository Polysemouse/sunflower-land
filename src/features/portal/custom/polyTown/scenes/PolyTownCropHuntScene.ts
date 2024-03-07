import mapJson from "../maps/poly_town_crop_hunt.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { polyTownNpcModalManager } from "../components/modals/PolyTownNPCModals";
import { POLY_TOWN_INTERACTABLE_DISTANCE } from "../lib/consts/consts";
import { POLY_TOWN_NPC_WEARABLES } from "../lib/consts/npcWearables";
import { POLY_TOWN_NPCS_LOCATIONS } from "../lib/consts/npcLocations";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { Physics } from "phaser";
import { SPAWNS } from "features/world/lib/spawn";
import { Label } from "features/world/containers/Label";
import { secondsToString } from "lib/utils/time";

type ChickenDirection = "left" | "right" | "up" | "down";

export class PolyTownCropHuntScene extends BaseScene {
  sceneId: SceneId = "poly_town_crop_hunt";

  boardOffset = SQUARE_WIDTH * 2;
  boardWidth = SQUARE_WIDTH * 52;
  playerMinXY = this.boardWidth * 0.5 + this.boardOffset;
  playerMaxXY = this.boardWidth * 1.5 + this.boardOffset;

  playerDead = false;
  gameStarted = false;

  playerDeathFrames = 10;
  playerDeathDimensions = {
    x: 15,
    y: 22,
  };

  cropDepositArea = {
    x: 52 * SQUARE_WIDTH,
    y: 52 * SQUARE_WIDTH,
    width: 5 * SQUARE_WIDTH,
    height: 5 * SQUARE_WIDTH,
  };

  playerScore = 0;
  inventoryScore = 0;
  collectedCropIndexes: number[] = [];

  scoreTable: { [key: number]: number } = {
    0: 1,
    1: 2,
    2: 5,
    3: 10,
    4: 20,
    5: 50,
    6: 100,
    7: 200,
    8: 500,
    9: 1000,
    10: 2000,
    11: 5000,
    12: 10000,
  };

  cropFranes = 13;

  // the crops positions in board coordinates
  addCropConfigurations: { cropIndex: number; x: number; y: number }[] = [
    // layer 1
    { cropIndex: 0, x: 48, y: 45 },
    { cropIndex: 0, x: 52, y: 45 },
    { cropIndex: 0, x: 56, y: 45 },
    { cropIndex: 1, x: 60, y: 45 },
    // ---
    { cropIndex: 0, x: 61, y: 48 },
    { cropIndex: 0, x: 61, y: 52 },
    { cropIndex: 0, x: 61, y: 56 },
    { cropIndex: 1, x: 61, y: 60 },
    // ---
    { cropIndex: 0, x: 58, y: 61 },
    { cropIndex: 0, x: 54, y: 61 },
    { cropIndex: 0, x: 50, y: 61 },
    { cropIndex: 1, x: 46, y: 61 },
    // ---
    { cropIndex: 0, x: 45, y: 58 },
    { cropIndex: 0, x: 45, y: 54 },
    { cropIndex: 0, x: 45, y: 50 },
    { cropIndex: 1, x: 45, y: 46 },

    // layer 2
    { cropIndex: 3, x: 42, y: 41 },
    { cropIndex: 2, x: 46, y: 41 },
    { cropIndex: 1, x: 50, y: 41 },
    { cropIndex: 1, x: 54, y: 41 },
    { cropIndex: 1, x: 58, y: 41 },
    { cropIndex: 2, x: 62, y: 41 },
    // ---
    { cropIndex: 3, x: 65, y: 42 },
    { cropIndex: 2, x: 65, y: 46 },
    { cropIndex: 1, x: 65, y: 50 },
    { cropIndex: 1, x: 65, y: 54 },
    { cropIndex: 1, x: 65, y: 58 },
    { cropIndex: 2, x: 65, y: 62 },
    // ---
    { cropIndex: 3, x: 64, y: 65 },
    { cropIndex: 2, x: 60, y: 65 },
    { cropIndex: 1, x: 56, y: 65 },
    { cropIndex: 1, x: 52, y: 65 },
    { cropIndex: 1, x: 48, y: 65 },
    { cropIndex: 2, x: 44, y: 65 },
    // ---
    { cropIndex: 3, x: 41, y: 64 },
    { cropIndex: 2, x: 41, y: 60 },
    { cropIndex: 1, x: 41, y: 56 },
    { cropIndex: 1, x: 41, y: 52 },
    { cropIndex: 1, x: 41, y: 48 },
    { cropIndex: 2, x: 41, y: 44 },

    // layer 3
    { cropIndex: 4, x: 40, y: 37 },
    { cropIndex: 3, x: 44, y: 37 },
    { cropIndex: 2, x: 48, y: 37 },
    { cropIndex: 2, x: 52, y: 37 },
    { cropIndex: 2, x: 56, y: 37 },
    { cropIndex: 3, x: 60, y: 37 },
    { cropIndex: 4, x: 64, y: 37 },
    { cropIndex: 5, x: 68, y: 37 },
    // ---
    { cropIndex: 4, x: 69, y: 40 },
    { cropIndex: 3, x: 69, y: 44 },
    { cropIndex: 2, x: 69, y: 48 },
    { cropIndex: 2, x: 69, y: 52 },
    { cropIndex: 2, x: 69, y: 56 },
    { cropIndex: 3, x: 69, y: 60 },
    { cropIndex: 4, x: 69, y: 64 },
    { cropIndex: 5, x: 69, y: 68 },
    // ---
    { cropIndex: 4, x: 66, y: 69 },
    { cropIndex: 3, x: 62, y: 69 },
    { cropIndex: 2, x: 58, y: 69 },
    { cropIndex: 2, x: 54, y: 69 },
    { cropIndex: 2, x: 50, y: 69 },
    { cropIndex: 3, x: 46, y: 69 },
    { cropIndex: 4, x: 42, y: 69 },
    { cropIndex: 5, x: 38, y: 69 },
    // ---
    { cropIndex: 4, x: 37, y: 66 },
    { cropIndex: 3, x: 37, y: 62 },
    { cropIndex: 2, x: 37, y: 58 },
    { cropIndex: 2, x: 37, y: 54 },
    { cropIndex: 2, x: 37, y: 50 },
    { cropIndex: 3, x: 37, y: 46 },
    { cropIndex: 4, x: 37, y: 42 },
    { cropIndex: 5, x: 37, y: 38 },

    // layer 4
    { cropIndex: 8, x: 34, y: 33 },
    { cropIndex: 7, x: 38, y: 33 },
    { cropIndex: 6, x: 42, y: 33 },
    { cropIndex: 5, x: 46, y: 33 },
    { cropIndex: 4, x: 50, y: 33 },
    { cropIndex: 4, x: 54, y: 33 },
    { cropIndex: 4, x: 58, y: 33 },
    { cropIndex: 5, x: 62, y: 33 },
    { cropIndex: 6, x: 66, y: 33 },
    { cropIndex: 7, x: 70, y: 33 },
    // ---
    { cropIndex: 8, x: 73, y: 34 },
    { cropIndex: 7, x: 73, y: 38 },
    { cropIndex: 6, x: 73, y: 42 },
    { cropIndex: 5, x: 73, y: 46 },
    { cropIndex: 4, x: 73, y: 50 },
    { cropIndex: 4, x: 73, y: 54 },
    { cropIndex: 4, x: 73, y: 58 },
    { cropIndex: 5, x: 73, y: 62 },
    { cropIndex: 6, x: 73, y: 66 },
    { cropIndex: 7, x: 73, y: 70 },
    // ---
    { cropIndex: 8, x: 72, y: 73 },
    { cropIndex: 7, x: 68, y: 73 },
    { cropIndex: 6, x: 64, y: 73 },
    { cropIndex: 5, x: 60, y: 73 },
    { cropIndex: 4, x: 56, y: 73 },
    { cropIndex: 4, x: 52, y: 73 },
    { cropIndex: 4, x: 48, y: 73 },
    { cropIndex: 5, x: 44, y: 73 },
    { cropIndex: 6, x: 40, y: 73 },
    { cropIndex: 7, x: 36, y: 73 },
    // ---
    { cropIndex: 8, x: 33, y: 72 },
    { cropIndex: 7, x: 33, y: 68 },
    { cropIndex: 6, x: 33, y: 64 },
    { cropIndex: 5, x: 33, y: 60 },
    { cropIndex: 4, x: 33, y: 56 },
    { cropIndex: 4, x: 33, y: 52 },
    { cropIndex: 4, x: 33, y: 48 },
    { cropIndex: 5, x: 33, y: 44 },
    { cropIndex: 6, x: 33, y: 40 },
    { cropIndex: 7, x: 33, y: 36 },

    // layer 5
    { cropIndex: 10, x: 32, y: 29 },
    { cropIndex: 9, x: 36, y: 29 },
    { cropIndex: 8, x: 40, y: 29 },
    { cropIndex: 7, x: 44, y: 29 },
    { cropIndex: 6, x: 48, y: 29 },
    { cropIndex: 6, x: 52, y: 29 },
    { cropIndex: 6, x: 56, y: 29 },
    { cropIndex: 7, x: 60, y: 29 },
    { cropIndex: 8, x: 64, y: 29 },
    { cropIndex: 9, x: 68, y: 29 },
    { cropIndex: 10, x: 72, y: 29 },
    { cropIndex: 11, x: 76, y: 29 },
    // ---
    { cropIndex: 10, x: 77, y: 32 },
    { cropIndex: 9, x: 77, y: 36 },
    { cropIndex: 8, x: 77, y: 40 },
    { cropIndex: 7, x: 77, y: 44 },
    { cropIndex: 6, x: 77, y: 48 },
    { cropIndex: 6, x: 77, y: 52 },
    { cropIndex: 6, x: 77, y: 56 },
    { cropIndex: 7, x: 77, y: 60 },
    { cropIndex: 8, x: 77, y: 64 },
    { cropIndex: 9, x: 77, y: 68 },
    { cropIndex: 10, x: 77, y: 72 },
    { cropIndex: 11, x: 77, y: 76 },
    // ---
    { cropIndex: 10, x: 74, y: 77 },
    { cropIndex: 9, x: 70, y: 77 },
    { cropIndex: 8, x: 66, y: 77 },
    { cropIndex: 7, x: 62, y: 77 },
    { cropIndex: 6, x: 58, y: 77 },
    { cropIndex: 6, x: 54, y: 77 },
    { cropIndex: 6, x: 50, y: 77 },
    { cropIndex: 7, x: 46, y: 77 },
    { cropIndex: 8, x: 42, y: 77 },
    { cropIndex: 9, x: 38, y: 77 },
    { cropIndex: 10, x: 34, y: 77 },
    { cropIndex: 11, x: 30, y: 77 },
    // ---
    { cropIndex: 10, x: 29, y: 74 },
    { cropIndex: 9, x: 29, y: 70 },
    { cropIndex: 8, x: 29, y: 66 },
    { cropIndex: 7, x: 29, y: 62 },
    { cropIndex: 6, x: 29, y: 58 },
    { cropIndex: 6, x: 29, y: 54 },
    { cropIndex: 6, x: 29, y: 50 },
    { cropIndex: 7, x: 29, y: 46 },
    { cropIndex: 8, x: 29, y: 42 },
    { cropIndex: 9, x: 29, y: 38 },
    { cropIndex: 10, x: 29, y: 34 },
    { cropIndex: 11, x: 29, y: 30 },

    // layer 6
    { cropIndex: 12, x: 27, y: 27 },
  ];

  chickenMinXY = this.boardOffset;
  chickenMaxXY = this.boardWidth * 2 + this.boardOffset;
  chickenFrames = 6;
  chickenDimensions = {
    x: 13,
    y: 14,
  };
  chickenForwardSpeed = {
    min: 40,
    max: 80,
  };
  maxChickenSidewaysSpeed = 4;

  // the number of chickens per track in board coordinates
  addChickenConfigurations: { count: number; track: number }[] = [
    { count: 15, track: 29 },
    { count: 10, track: 33 },
    { count: 6, track: 37 },
    { count: 3, track: 41 },
    { count: 1, track: 45 },
    { count: 1, track: 61 },
    { count: 3, track: 65 },
    { count: 6, track: 69 },
    { count: 10, track: 73 },
    { count: 15, track: 77 },
  ];

  // chickens
  chickens: Phaser.GameObjects.Sprite[] = [];

  scoreBoard: Label | undefined = undefined;

  countdownTime = 0.2 * 60 * 1000; // 2 minutes * 60 seconds * 1000 milliseconds
  timer: Phaser.Time.TimerEvent | undefined = undefined;

  constructor() {
    super({
      name: "poly_town_crop_hunt",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    // spritesheets
    this.load.spritesheet("player_death", "world/poly_town_player_death.png", {
      frameWidth: this.playerDeathDimensions.x,
      frameHeight: this.playerDeathDimensions.y,
    });
    this.load.spritesheet("chicken_left", "world/chicken_left_movements.png", {
      frameWidth: this.chickenDimensions.x,
      frameHeight: this.chickenDimensions.y,
    });
    this.load.spritesheet(
      "chicken_right",
      "world/chicken_right_movements.png",
      {
        frameWidth: this.chickenDimensions.x,
        frameHeight: this.chickenDimensions.y,
      }
    );
    this.load.spritesheet("chicken_up", "world/chicken_up_movements.png", {
      frameWidth: this.chickenDimensions.x,
      frameHeight: this.chickenDimensions.y,
    });
    this.load.spritesheet("chicken_down", "world/chicken_down_movements.png", {
      frameWidth: this.chickenDimensions.x,
      frameHeight: this.chickenDimensions.y,
    });
    this.load.spritesheet("crop", "world/poly_town_crop_hunt_crops.png", {
      frameWidth: 16,
      frameHeight: 20,
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

    this.initialisePolyTownNpcs();

    this.createScoreBoard();

    this.createStorageArea();

    this.createAllCrops();

    this.createChickenAnimations();
    this.createAllChickens();
  }

  update(time: number, delta: number) {
    if (!this.currentPlayer || !this.currentPlayer.body) {
      return;
    }

    if (!this.gameStarted && this.movementAngle !== undefined) {
      this.gameStarted = true;
      this.timer = this.time.addEvent({
        delay: this.countdownTime,
        callback: this.endGame,
        callbackScope: this,
      });
    }

    const boardOffsetY =
      this.currentPlayer.y - this.cameras.main.getWorldPoint(0, 0).y - 15;

    this.currentPlayer.x = Phaser.Math.Wrap(
      this.currentPlayer.x,
      this.playerMinXY,
      this.playerMaxXY
    );
    this.currentPlayer.y = Phaser.Math.Wrap(
      this.currentPlayer.y,
      this.playerMinXY,
      this.playerMaxXY
    );

    const remainingTime = Math.max(
      0,
      this.countdownTime - (this.timer?.getElapsed() ?? 0)
    );
    this.scoreBoard
      ?.setPosition(
        this.currentPlayer.x +
          ((this.currentPlayer.body?.velocity.x ?? 0) * delta) / 1000,
        this.currentPlayer.y -
          boardOffsetY +
          ((this.currentPlayer.body?.velocity.y ?? 0) * delta) / 1000
      )
      .setText(
        `SCORE: ${this.playerScore}\nINVENTORY: ${
          this.inventoryScore
        }\nTIME LEFT: ${secondsToString(remainingTime / 1000, {
          length: "full",
          unitSeparator: " ",
        }).toUpperCase()}`
      );
    this.scoreBoard?.body?.gameObject?.setVelocity(10, 10);

    this.chickens.forEach((chicken) => {
      chicken.x = Phaser.Math.Wrap(
        chicken.x,
        this.chickenMinXY,
        this.chickenMaxXY
      );
      chicken.y = Phaser.Math.Wrap(
        chicken.y,
        this.chickenMinXY,
        this.chickenMaxXY
      );
      chicken.setDepth(chicken.y);
    });

    super.update(time, delta);
  }

  private createScoreBoard() {
    this.scoreBoard = new Label(this, "", "brown");
    this.scoreBoard.setDepth(10000000);
    this.add.existing(this.scoreBoard);
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
          end: this.chickenFrames - 1,
        }),
        repeat: -1,
        frameRate: 10,
      });
    });
  }

  private createStorageArea() {
    const storageArea = this.add.sprite(
      this.cropDepositArea.x,
      this.cropDepositArea.y,
      ""
    );
    this.physics.add.existing(storageArea);
    storageArea.setVisible(false);

    if (!storageArea.body) return;
    if (!this.currentPlayer) return;

    (storageArea.body as Physics.Arcade.Body)
      .setSize(this.cropDepositArea.width, this.cropDepositArea.height)
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
    x = Phaser.Math.Wrap(
      x,
      this.boardOffset,
      this.boardOffset + this.boardWidth
    );
    y = Phaser.Math.Wrap(
      y,
      this.boardOffset,
      this.boardOffset + this.boardWidth
    );

    const spriteName = "crop";

    const crops = [
      this.add.sprite(x, y, spriteName, cropIndex),
      this.add.sprite(x + this.boardWidth, y, spriteName, cropIndex),
      this.add.sprite(x, y + this.boardWidth, spriteName, cropIndex),
      this.add.sprite(
        x + this.boardWidth,
        y + this.boardWidth,
        spriteName,
        cropIndex
      ),
    ];

    crops.forEach((crop, index) => {
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
          this.inventoryScore += this.scoreTable[cropIndex];
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
    return this.addCropConfigurations.map((config) =>
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
    x = Phaser.Math.Wrap(
      x,
      this.boardOffset,
      this.boardOffset + this.boardWidth
    );
    y = Phaser.Math.Wrap(
      y,
      this.boardOffset,
      this.boardOffset + this.boardWidth
    );

    const spriteName = `chicken_${direction}`;
    const spriteKey = `chicken_${direction}_anim`;

    const chickens = [
      this.add.sprite(x, y, spriteName),
      this.add.sprite(x + this.boardWidth, y, spriteName),
      this.add.sprite(x, y + this.boardWidth, spriteName),
      this.add.sprite(x + this.boardWidth, y + this.boardWidth, spriteName),
    ];

    const startFrame = Phaser.Math.RND.integerInRange(
      0,
      this.chickenFrames - 1
    );
    let forwardSpeed = Phaser.Math.RND.realInRange(
      this.chickenForwardSpeed.min,
      this.chickenForwardSpeed.max
    );
    let sidewaysSpeed = Phaser.Math.RND.realInRange(
      -this.maxChickenSidewaysSpeed,
      this.maxChickenSidewaysSpeed
    );

    chickens.forEach((chicken, index) => {
      chicken.play({ key: spriteKey, startFrame: startFrame });

      chicken.on(
        "animationupdate",
        (
          _animation: Phaser.Animations.Animation,
          frame: Phaser.Animations.AnimationFrame
        ) => {
          if (index === 0 && frame.index === 4) {
            forwardSpeed = Phaser.Math.Clamp(
              forwardSpeed +
                Phaser.Math.RND.realInRange(
                  -0.5 * (forwardSpeed - this.chickenForwardSpeed.min) - 2,
                  0.5 * (this.chickenForwardSpeed.max - forwardSpeed) + 2
                ),
              this.chickenForwardSpeed.min,
              this.chickenForwardSpeed.max
            );
            sidewaysSpeed = Phaser.Math.Clamp(
              sidewaysSpeed +
                Phaser.Math.RND.realInRange(
                  0.2 *
                    (direction === "left" || direction === "right"
                      ? y - SQUARE_WIDTH * 4 - chicken.y
                      : x - SQUARE_WIDTH * 4 - chicken.x) -
                    2,
                  0.2 *
                    (direction === "left" || direction === "right"
                      ? y + SQUARE_WIDTH * 4 - chicken.y
                      : x + SQUARE_WIDTH * 4 - chicken.x) +
                    2
                ),
              -this.maxChickenSidewaysSpeed,
              this.maxChickenSidewaysSpeed
            );
          }
          if (!chicken.body) return;

          if (frame.index < 4) {
            chicken.body.velocity.x =
              direction === "left"
                ? -forwardSpeed
                : direction === "right"
                ? forwardSpeed
                : sidewaysSpeed;
            chicken.body.velocity.y =
              direction === "up"
                ? -forwardSpeed
                : direction === "down"
                ? forwardSpeed
                : sidewaysSpeed;
          }
          if (frame.index >= 4) {
            chicken.body.velocity.x = 0;
            chicken.body.velocity.y = 0;
          }
        }
      );
      this.physics.add.existing(chicken);

      if (!chicken.body) return;
      if (!this.currentPlayer) return;

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
    });

    return chickens;
  }

  /**
   * Creates chickens for a given direction.
   */
  private createChickens(direction: ChickenDirection) {
    return this.addChickenConfigurations
      .flatMap((config) =>
        Array.from({ length: config.count }, () =>
          this.createChicken(
            direction === "left" || direction === "right"
              ? Phaser.Math.RND.realInRange(0, this.boardWidth) +
                  this.boardOffset
              : SQUARE_WIDTH *
                  (config.track + Phaser.Math.RND.realInRange(-2, 2)) +
                  this.chickenDimensions.y / 2,
            direction === "up" || direction === "down"
              ? Phaser.Math.RND.realInRange(0, this.boardWidth) +
                  this.boardOffset
              : SQUARE_WIDTH *
                  (config.track + Phaser.Math.RND.realInRange(-2, 2)) +
                  this.chickenDimensions.y / 2,
            direction
          )
        )
      )
      .flatMap((chicken) => chicken);
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

  /**
   * Initialize NPCs.
   */
  private initialisePolyTownNpcs() {
    POLY_TOWN_NPCS_LOCATIONS.filter(
      (bumpkin) => bumpkin.scene === "poly_town_crop_hunt"
    ).forEach((bumpkin) => {
      const defaultClick = () => {
        const distance = Phaser.Math.Distance.BetweenPoints(
          container,
          this.currentPlayer as BumpkinContainer
        );

        if (distance > POLY_TOWN_INTERACTABLE_DISTANCE) {
          container.speak("You are too far away");
          return;
        }
        polyTownNpcModalManager.open({
          npc: bumpkin.npc,
          changeScene: this.changeScene,
        });
      };

      const container = new BumpkinContainer({
        scene: this,
        x: bumpkin.x,
        y: bumpkin.y,
        clothing: {
          ...(bumpkin.clothing ?? POLY_TOWN_NPC_WEARABLES[bumpkin.npc]),
          updatedAt: 0,
        },
        onClick: bumpkin.onClick ?? defaultClick,
        name: bumpkin.npc,
        direction: bumpkin.direction ?? "right",
      });

      container.setDepth(bumpkin.y);
      (container.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 20)
        .setOffset(0, 0)
        .setImmovable(true)
        .setCollideWorldBounds(true);

      this.physics.world.enable(container);
      this.colliders?.add(container);
      this.triggerColliders?.add(container);
    });
  }

  private depositCrops() {
    if (!this.currentPlayer || this.collectedCropIndexes.length === 0) {
      return;
    }

    // play sound
    const sound = this.sound.add("crop_deposit");
    sound.play({ volume: 0.1 });

    // score nad throw all crops out of the inventory
    this.collectedCropIndexes.forEach(
      (cropIndex) => (this.playerScore += this.scoreTable[cropIndex])
    );
    this.collectedCropIndexes = [];
    this.inventoryScore = 0;
  }

  private killPlayer() {
    if (!this.currentPlayer || this.playerDead) {
      return;
    }

    // freeze player
    const originalWalkingSpeed = this.walkingSpeed;
    this.walkingSpeed = 0;
    this.playerDead = true;
    this.currentPlayer.setVisible(false);

    // play sound
    const sound = this.sound.add("player_death");
    sound.play({ volume: 0.1 });

    // throw all crops out of the inventory
    this.collectedCropIndexes = [];
    this.inventoryScore = 0;

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
          end: this.playerDeathFrames - 1,
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

      this.currentPlayer.x = SPAWNS.poly_town_crop_hunt.default.x;
      this.currentPlayer.y = SPAWNS.poly_town_crop_hunt.default.y;

      this.playerDead = false;
      this.walkingSpeed = originalWalkingSpeed;
      this.currentPlayer.setVisible(true);

      playerDeath.destroy();
    });
  }

  private endGame() {
    return undefined;
  }
}
