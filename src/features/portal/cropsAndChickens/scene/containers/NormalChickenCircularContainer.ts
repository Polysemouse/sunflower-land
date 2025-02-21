import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  BOARD_WIDTH,
  CHICKEN_SPEEDS,
  CHICKEN_SPRITE_PROPERTIES,
  DEPOSIT_CHEST_XY,
  SPRITE_FRAME_RATE,
} from "../../CropsAndChickensConstants";
import { BaseChickenContainer } from "./BaseChickenContainer";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { CropsAndChickensScene } from "../CropsAndChickensScene";

export type NormalChickenCircularRailType = "clockwise" | "counterClockwise";

interface Props {
  railType: NormalChickenCircularRailType;
  rail: number; // the rail the chicken is riding on
  scene: CropsAndChickensScene;
  player?: BumpkinContainer;
  killPlayer: () => void;
}

export class NormalChickenCircularContainer extends BaseChickenContainer {
  chunk: { x: number; y: number };
  railRadius: number;
  angleOffset = 0;

  constructor({ railType, rail, scene, player, killPlayer }: Props) {
    const randomAngleFromCenter = Phaser.Math.Angle.Random();
    const radiusOffset = Phaser.Math.RND.realInRange(-3.25, 3.25);

    const railRadius = (rail + radiusOffset) * SQUARE_WIDTH;
    const initialSidewaysRadiusDisplacement = Phaser.Math.RND.realInRange(
      -SQUARE_WIDTH / 2,
      SQUARE_WIDTH / 2,
    );

    const x =
      DEPOSIT_CHEST_XY +
      (railRadius + initialSidewaysRadiusDisplacement) *
        Math.cos(randomAngleFromCenter);
    const y =
      DEPOSIT_CHEST_XY +
      (railRadius + initialSidewaysRadiusDisplacement) *
        Math.sin(randomAngleFromCenter);

    const angleOffset = Phaser.Math.RND.realInRange(
      -CHICKEN_SPEEDS.maxStraightAngleOffset,
      CHICKEN_SPEEDS.maxStraightAngleOffset,
    );
    const chickenAngle =
      railType === "clockwise"
        ? randomAngleFromCenter + Math.PI / 2
        : randomAngleFromCenter - Math.PI / 2;
    super({
      x,
      y,
      angle: chickenAngle,
      spriteType: "chicken_normal",
      scene,
      player,
      killPlayer,
    });
    this.chunk = { x: 0, y: 0 };
    this.railRadius = railRadius;
    this.angleOffset = angleOffset;

    this.sprite.on(
      "animationupdate",
      (
        _animation: Phaser.Animations.Animation,
        frame: Phaser.Animations.AnimationFrame,
      ) => {
        if (frame.index !== CHICKEN_SPRITE_PROPERTIES.landingFrame) return;

        // get unwrapped position
        const unwrappedX = this.x + this.chunk.x * BOARD_WIDTH;
        const unwrappedY = this.y + this.chunk.y * BOARD_WIDTH;

        // calculate sideways radius displacement based on the direction
        const sidewaysRadiusDisplacement =
          Phaser.Math.Distance.Between(
            unwrappedX,
            unwrappedY,
            DEPOSIT_CHEST_XY,
            DEPOSIT_CHEST_XY,
          ) - railRadius;

        // try to reduce sideways displacement by changing the angle of the chicken
        this.angleOffset = Phaser.Math.Clamp(
          this.angleOffset +
            Phaser.Math.RND.realInRange(
              (-sidewaysRadiusDisplacement / CHICKEN_SPEEDS.forwardMax) *
                SPRITE_FRAME_RATE *
                this.speedMultiplier *
                0.02 -
                CHICKEN_SPEEDS.maxCircularAngleOffset,
              (-sidewaysRadiusDisplacement / CHICKEN_SPEEDS.forwardMax) *
                SPRITE_FRAME_RATE *
                this.speedMultiplier *
                0.02 +
                CHICKEN_SPEEDS.maxCircularAngleOffset,
            ),
          -CHICKEN_SPEEDS.maxCircularAngleOffset,
          CHICKEN_SPEEDS.maxCircularAngleOffset,
        );

        const correctAngle =
          Phaser.Math.Angle.Between(
            DEPOSIT_CHEST_XY,
            DEPOSIT_CHEST_XY,
            unwrappedX,
            unwrappedY,
          ) + (railType === "clockwise" ? Math.PI / 2 : -Math.PI / 2);
        this.angle =
          correctAngle +
          (railType === "clockwise" ? -this.angleOffset : this.angleOffset);
      },
    );
  }
}
