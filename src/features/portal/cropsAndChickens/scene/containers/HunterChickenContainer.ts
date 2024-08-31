import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  CHICKEN_SPEEDS,
  CHICKEN_SPRITE_PROPERTIES,
  HUNTER_CHICKEN_INITIAL_DISTANCE,
  HUNTER_CHICKEN_SPEED_MULTIPLIER,
  SPRITE_FRAME_RATE,
} from "../../CropsAndChickensConstants";
import { Physics } from "phaser";
import { SPAWNS } from "features/world/lib/spawn";

interface Props {
  scene: Phaser.Scene;
  player?: BumpkinContainer;
  isChickenFrozen: () => boolean;
  killPlayer: () => void;
}

export class HunterChickenContainer extends Phaser.GameObjects.Container {
  player?: BumpkinContainer;

  constructor({ scene, player, isChickenFrozen, killPlayer }: Props) {
    super(scene, 0, 0);
    this.scene = scene;
    this.player = player;
    this.respawn();

    ["left", "right", "up", "down"].forEach((animDirection) => {
      const animSpriteName = `chicken_hunter_${animDirection}`;
      const animSpriteKey = `chicken_hunter_${animDirection}_anim`;

      if (scene.anims.exists(animSpriteKey)) return;

      scene.anims.create({
        key: animSpriteKey,
        frames: scene.anims.generateFrameNumbers(animSpriteName, {
          start: 0,
          end: CHICKEN_SPRITE_PROPERTIES.frames - 1,
        }),
        repeat: -1,
        frameRate: SPRITE_FRAME_RATE,
      });
    });

    let direction = "down";

    const spriteName = `chicken_hunter_${direction}`;
    const spriteKey = `chicken_hunter_${direction}_anim`;

    // offset when calculating angles and distances to player
    const playerCoordinatesOffset = {
      x: -5,
      y: 0,
    };

    const playerCoordinates = player
      ? {
          x: player.x + playerCoordinatesOffset.x,
          y: player.y + playerCoordinatesOffset.y,
        }
      : {
          x: SPAWNS().crops_and_chickens.default.x + playerCoordinatesOffset.x,
          y: SPAWNS().crops_and_chickens.default.y + playerCoordinatesOffset.y,
        };
    let angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      playerCoordinates.x,
      playerCoordinates.y,
    );

    // add chicken sprite with offset
    const chicken = scene.add.sprite(5.5, 3, spriteName);

    const hunterChickenForwardMin =
      CHICKEN_SPEEDS.forwardMin * HUNTER_CHICKEN_SPEED_MULTIPLIER;
    const hunterChickenForwardMax =
      CHICKEN_SPEEDS.forwardMax * HUNTER_CHICKEN_SPEED_MULTIPLIER;

    const startFrame = CHICKEN_SPRITE_PROPERTIES.frames - 1; // start frame starts form 0
    const landingFrame = 4; // frame index starts form 1

    let forwardSpeed = 0;

    chicken.play({ key: spriteKey, startFrame: startFrame });

    chicken.on(
      "animationupdate",
      (
        _animation: Phaser.Animations.Animation,
        frame: Phaser.Animations.AnimationFrame,
      ) => {
        if (!this.body || !player) return;

        chicken.setTexture(`chicken_hunter_${direction}`, frame.index - 1);

        const distance = Phaser.Math.Distance.Between(
          player.x + playerCoordinatesOffset.x,
          player.y + playerCoordinatesOffset.y,
          this.x,
          this.y,
        );

        if (frame.index === landingFrame) {
          forwardSpeed = Phaser.Math.Clamp(
            forwardSpeed +
              Phaser.Math.RND.realInRange(
                -0.5 * (forwardSpeed - hunterChickenForwardMin) - 2,
                0.5 * (hunterChickenForwardMax - forwardSpeed) + 2,
              ),
            hunterChickenForwardMin,
            hunterChickenForwardMax,
          );

          if (distance >= HUNTER_CHICKEN_INITIAL_DISTANCE) {
            forwardSpeed *= Math.pow(
              distance / HUNTER_CHICKEN_INITIAL_DISTANCE,
              2,
            );
          }

          if (isChickenFrozen()) forwardSpeed = 0;

          angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            player.x + playerCoordinatesOffset.x,
            player.y + playerCoordinatesOffset.y,
          );

          if (angle >= -Math.PI / 4 && angle <= Math.PI / 4) {
            direction = "right";
          } else if (angle > Math.PI / 4 && angle <= (3 * Math.PI) / 4) {
            direction = "down";
          } else if (
            (angle > (3 * Math.PI) / 4 && angle <= Math.PI) ||
            (angle >= -Math.PI && angle < (-3 * Math.PI) / 4)
          ) {
            direction = "left";
          } else {
            direction = "up";
          }
        }

        if (frame.index < landingFrame) {
          this.body.velocity.x = forwardSpeed * Math.cos(angle);
          this.body.velocity.y = forwardSpeed * Math.sin(angle);
        }

        if (frame.index >= landingFrame) {
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
        }
      },
    );

    scene.physics.add.existing(this);

    if (!!this.body && !!player) {
      (this.body as Physics.Arcade.Body)
        .setSize(11, 8)
        .setOffset(0, 2) // set offset to ensure correct rendering depth
        .setImmovable(true)
        .setCollideWorldBounds(false);

      scene.physics.add.overlap(player, this, killPlayer, undefined, this);
    }

    // add the sprite to the container
    this.add(chicken);

    // add the container to the scene
    scene.add.existing(this);
  }

  /**
   * Respawns the chicken.
   */
  public respawn = () => {
    const initialAngle = Phaser.Math.Angle.Random();
    const playerCoordinates = this.player
      ? { x: this.player.x, y: this.player.y }
      : SPAWNS().crops_and_chickens.default;

    this.x =
      playerCoordinates.x +
      HUNTER_CHICKEN_INITIAL_DISTANCE * Math.cos(initialAngle);
    this.y =
      playerCoordinates.y +
      HUNTER_CHICKEN_INITIAL_DISTANCE * Math.sin(initialAngle);
  };
}
