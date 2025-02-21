import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  CHICKEN_RESPAWNING_RADIUS,
  CHICKEN_SPEEDS,
  CHICKEN_SPRITE_PROPERTIES,
  SPRITE_FRAME_RATE,
} from "../../CropsAndChickensConstants";
import { Physics } from "phaser";
import { CropsAndChickensScene } from "../CropsAndChickensScene";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { FrozenPipeline } from "../../pipelines/frozenPipeline";

const CHICKEN_HITBOX_DIMENSIONS = {
  width: 11,
  height: 8,
};

const SLOW_TINT_COLOR = 0x6f8fff;
const SLOW_SPEED_MULTIPLIER = 0.5;

type Direction = "left" | "right" | "up" | "down";

interface Props {
  x: number;
  y: number;
  angle: number; // angle in radians
  spriteType: "chicken_normal" | "chicken_hunter";
  scene: CropsAndChickensScene;
  player?: BumpkinContainer;
  killPlayer: () => void;
}

const getDirection = (angle: number): Direction => {
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
  isFrozen = false;
  isLockInPlace = false;
  isSlowedDown = false;
  frozenFrameIndex?: number;
  frozenDirection?: Direction;
  sprite: Phaser.GameObjects.Sprite;
  scene: CropsAndChickensScene;

  constructor({ x, y, angle, spriteType, scene, player, killPlayer }: Props) {
    super(scene, x, y);
    this.angle = angle;
    this.scene = scene;
    this.setSize(
      CHICKEN_HITBOX_DIMENSIONS.width,
      CHICKEN_HITBOX_DIMENSIONS.height,
    );

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
        frameRate:
          SPRITE_FRAME_RATE *
          this.speedMultiplier *
          (this.isSlowedDown ? SLOW_SPEED_MULTIPLIER : 1),
      });
    });

    // add chicken sprite with offset
    const direction = getDirection(this.angle);
    const spriteKey = `${spriteType}_${direction}_anim`;
    const spriteName = `${spriteType}_${direction}`;
    this.sprite = scene.add.sprite(0, -3, spriteName);

    this.baseSpeed = Phaser.Math.RND.realInRange(
      CHICKEN_SPEEDS.forwardMin,
      CHICKEN_SPEEDS.forwardMax,
    );

    const startFrame = Phaser.Math.RND.integerInRange(
      0,
      CHICKEN_SPRITE_PROPERTIES.frames - 1,
    );
    this.sprite.play({
      key: spriteKey,
      startFrame: startFrame,
    });

    this.sprite.on(
      "animationupdate",
      (
        _animation: Phaser.Animations.Animation,
        frame: Phaser.Animations.AnimationFrame,
      ) => {
        if (!this.body) return;

        // if chicken is far away from the player, reset the alpha
        if (
          !!player &&
          Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) >
            CHICKEN_RESPAWNING_RADIUS * SQUARE_WIDTH
        ) {
          this.setAlpha(1);
        }

        const direction = this.frozenDirection || getDirection(this.angle);
        const frameIndex =
          this.frozenFrameIndex !== undefined
            ? this.frozenFrameIndex
            : frame.index;
        this.sprite.setTexture(`${spriteType}_${direction}`, frameIndex - 1);

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
          const speed =
            this.baseSpeed *
            (this.isFrozen || this.isLockInPlace ? 0 : 1) *
            this.speedMultiplier *
            (this.isSlowedDown ? SLOW_SPEED_MULTIPLIER : 1);
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
        .setSize(
          CHICKEN_HITBOX_DIMENSIONS.width,
          CHICKEN_HITBOX_DIMENSIONS.height,
        )
        .setImmovable(true)
        .setCollideWorldBounds(false);

      scene.physics.add.overlap(
        player,
        this,
        () => {
          if (this.alpha < 1) return;

          killPlayer();
        },
        undefined,
        this,
      );
    }

    // add the sprite to the container
    this.add(this.sprite);

    // add the container to the scene
    scene.add.existing(this);
  }

  // freeze the chicken
  freeze = () => {
    this.isFrozen = true;
    this.frozenFrameIndex = this.sprite.anims.currentFrame?.index;
    this.frozenDirection = getDirection(this.angle);

    const frozenPipeline = (
      this.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
    ).pipelines.get("frozen") as FrozenPipeline;
    if (!frozenPipeline) return;

    this.sprite.setPipeline("frozen");
  };

  // restore the speed of the chicken
  restoreSpeed = () => {
    this.isSlowedDown = false;
    this.updateFrameRate(this.isSlowedDown);

    this.sprite.clearTint();
  };

  // slow down the chicken
  slowSpeed = () => {
    this.isSlowedDown = true;
    this.updateFrameRate(this.isSlowedDown);

    this.sprite.setTint(SLOW_TINT_COLOR);
  };

  // unfreeze the chicken
  unfreeze = () => {
    this.isFrozen = false;
    this.frozenFrameIndex = undefined;
    this.frozenDirection = undefined;

    this.sprite.resetPipeline();
  };

  // update the frame rate of the chicken sprite
  updateFrameRate = (isSlowedDown: boolean) => {
    if (!this.sprite.anims?.msPerFrame) return;
    this.sprite.anims.msPerFrame =
      1000 / (SPRITE_FRAME_RATE * (isSlowedDown ? SLOW_SPEED_MULTIPLIER : 1));
  };
}
