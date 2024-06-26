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
  direction: "left" | "right" | "up" | "down";
  scene: Phaser.Scene;
  player?: BumpkinContainer;
  killPlayer: () => void;
}

export class NormalChickenContainer extends Phaser.GameObjects.Container {
  constructor({ x, y, direction, scene, player, killPlayer }: Props) {
    super(scene, x - 4.5, y - 5); // with position soffset
    this.scene = scene;

    const spriteName = `chicken_normal_${direction}`;
    const spriteKey = `chicken_normal_${direction}_anim`;

    if (!scene.anims.exists(spriteKey)) {
      scene.anims.create({
        key: spriteKey,
        frames: scene.anims.generateFrameNumbers(spriteName, {
          start: 0,
          end: CHICKEN_SPRITE_PROPERTIES.frames - 1,
        }),
        repeat: -1,
        frameRate: SPRITE_FRAME_RATE,
      });
    }

    // add chicken sprite with offset
    const chicken = scene.add.sprite(5.5, 5, spriteName);

    const startFrame = Phaser.Math.RND.integerInRange(
      0,
      CHICKEN_SPRITE_PROPERTIES.frames - 1
    ); // start frame starts form 0
    const landingFrame = 4; // frame index starts form 1
    const jumpingDuration = (landingFrame - 1) / SPRITE_FRAME_RATE;

    let forwardSpeed = Phaser.Math.RND.realInRange(
      CHICKEN_SPEEDS.forwardMin,
      CHICKEN_SPEEDS.forwardMax
    );
    let sidewaysSpeed = Phaser.Math.RND.realInRange(
      -CHICKEN_SPEEDS.sidewaysMax,
      CHICKEN_SPEEDS.sidewaysMax
    );
    let sidewaysDisplacement = 0;

    chicken.play({ key: spriteKey, startFrame: startFrame });

    chicken.on(
      "animationupdate",
      (
        _animation: Phaser.Animations.Animation,
        frame: Phaser.Animations.AnimationFrame
      ) => {
        if (frame.index === landingFrame) {
          forwardSpeed = Phaser.Math.Clamp(
            forwardSpeed +
              Phaser.Math.RND.realInRange(
                -0.5 * (forwardSpeed - CHICKEN_SPEEDS.forwardMin) - 2,
                0.5 * (CHICKEN_SPEEDS.forwardMax - forwardSpeed) + 2
              ),
            CHICKEN_SPEEDS.forwardMin,
            CHICKEN_SPEEDS.forwardMax
          );
          sidewaysSpeed = Phaser.Math.Clamp(
            sidewaysSpeed +
              Phaser.Math.RND.realInRange(
                -sidewaysDisplacement * 0.1 - CHICKEN_SPEEDS.sidewaysMax,
                -sidewaysDisplacement * 0.1 + CHICKEN_SPEEDS.sidewaysMax
              ),
            -CHICKEN_SPEEDS.sidewaysMax,
            CHICKEN_SPEEDS.sidewaysMax
          );
          sidewaysDisplacement += sidewaysSpeed * jumpingDuration;
        }
        if (!this.body) return;

        if (frame.index < landingFrame) {
          this.body.velocity.x =
            direction === "left"
              ? -forwardSpeed
              : direction === "right"
              ? forwardSpeed
              : sidewaysSpeed;
          this.body.velocity.y =
            direction === "up"
              ? -forwardSpeed
              : direction === "down"
              ? forwardSpeed
              : sidewaysSpeed;
        }
        if (frame.index >= landingFrame) {
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
        }
      }
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
}
