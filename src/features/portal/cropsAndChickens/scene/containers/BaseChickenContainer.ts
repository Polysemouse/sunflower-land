import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  CHICKEN_SPEEDS,
  CHICKEN_SPRITE_PROPERTIES,
  SPRITE_FRAME_RATE,
} from "../../CropsAndChickensConstants";
import { Physics } from "phaser";

interface Props {
  x: number;
  y: number;
  angle: number; // angle in radians
  spriteType: "chicken_normal" | "chicken_hunter";
  scene: Phaser.Scene;
  player?: BumpkinContainer;
  killPlayer: () => void;
}

const getDirection = (angle: number): "left" | "right" | "up" | "down" => {
  const normalizedAngle = Phaser.Math.Angle.Normalize(angle);
  if (normalizedAngle < Math.PI / 4 || normalizedAngle >= (7 * Math.PI) / 4) {
    return "right";
  }
  if (normalizedAngle < (3 * Math.PI) / 4) {
    return "down";
  }
  if (normalizedAngle < (5 * Math.PI) / 4) {
    return "left";
  }
  return "up";
};

export class BaseChickenContainer extends Phaser.GameObjects.Container {
  angle: number; // angle in radians
  baseSpeed: number;
  speedMultiplier = 1;
  chicken: Phaser.GameObjects.Sprite;

  constructor({ x, y, angle, spriteType, scene, player, killPlayer }: Props) {
    super(scene, x, y);
    this.angle = angle;
    this.scene = scene;

    // create sprite animations
    ["left", "right", "up", "down"].forEach((direction) => {
      const spriteKey = `${spriteType}_${direction}_anim`;
      if (scene.anims.exists(spriteKey)) return;

      const spriteName = `${spriteType}_${direction}`;
      scene.anims.create({
        key: spriteKey,
        frames: scene.anims.generateFrameNumbers(spriteName, {
          start: 0,
          end: CHICKEN_SPRITE_PROPERTIES.frames - 1,
        }),
        repeat: -1,
        frameRate: SPRITE_FRAME_RATE,
      });
    });

    // add chicken sprite with offset
    const direction = getDirection(this.angle);
    const spriteKey = `${spriteType}_${direction}_anim`;
    const spriteName = `${spriteType}_${direction}`;
    this.chicken = scene.add.sprite(5.5, 3, spriteName);

    this.baseSpeed = Phaser.Math.RND.realInRange(
      CHICKEN_SPEEDS.forwardMin,
      CHICKEN_SPEEDS.forwardMax,
    );

    const startFrame = Phaser.Math.RND.integerInRange(
      0,
      CHICKEN_SPRITE_PROPERTIES.frames - 1,
    );
    this.chicken.play({
      key: spriteKey,
      startFrame: startFrame,
    });

    this.chicken.on(
      "animationupdate",
      (
        _animation: Phaser.Animations.Animation,
        frame: Phaser.Animations.AnimationFrame,
      ) => {
        if (!this.body) return;

        const direction = getDirection(this.angle);
        this.chicken.setTexture(`${spriteType}_${direction}`, frame.index - 1);

        if (frame.index === CHICKEN_SPRITE_PROPERTIES.landingFrame) {
          this.baseSpeed = Phaser.Math.Clamp(
            this.baseSpeed +
              Phaser.Math.RND.realInRange(
                -0.5 * (this.baseSpeed - CHICKEN_SPEEDS.forwardMin) - 2,
                0.5 * (CHICKEN_SPEEDS.forwardMax - this.baseSpeed) + 2,
              ),
            CHICKEN_SPEEDS.forwardMin,
            CHICKEN_SPEEDS.forwardMax,
          );
        }

        if (frame.index < CHICKEN_SPRITE_PROPERTIES.landingFrame) {
          const speed = this.baseSpeed * this.speedMultiplier;
          this.body.velocity.x = speed * Math.cos(this.angle);
          this.body.velocity.y = speed * Math.sin(this.angle);
        }

        if (frame.index >= CHICKEN_SPRITE_PROPERTIES.landingFrame) {
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
    this.add(this.chicken);

    // add the container to the scene
    scene.add.existing(this);
  }
}
