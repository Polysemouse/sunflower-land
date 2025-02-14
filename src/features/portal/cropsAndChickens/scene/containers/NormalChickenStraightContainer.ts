import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  BOARD_WIDTH,
  CHICKEN_SPEEDS,
  CHICKEN_SPRITE_PROPERTIES,
  SPRITE_FRAME_RATE,
} from "../../CropsAndChickensConstants";
import { BaseChickenContainer } from "./BaseChickenContainer";
import { SQUARE_WIDTH } from "features/game/lib/constants";

export type NormalChickenStraightRailType = "left" | "right" | "up" | "down";

interface Props {
  railType: NormalChickenStraightRailType;
  rail: number; // the rail the chicken is riding on
  scene: Phaser.Scene;
  player?: BumpkinContainer;
  killPlayer: () => void;
}

export class NormalChickenStraightContainer extends BaseChickenContainer {
  chunk: { x: number; y: number };
  railPosition: number;
  railAngle = 0;
  angleOffset = 0;

  constructor({ railType, rail, scene, player, killPlayer }: Props) {
    const randomPosition = Phaser.Math.RND.realInRange(0, BOARD_WIDTH * 2);
    const railOffset = Phaser.Math.RND.realInRange(-2, 2);
    let spriteOffset;
    switch (railType) {
      case "left":
      case "right":
        spriteOffset = 2;
        break;
      case "up":
      case "down":
        spriteOffset = 2.5;
        break;
    }
    const railPosition = (rail + railOffset) * SQUARE_WIDTH + spriteOffset;
    const initialSidewaysDisplacement = Phaser.Math.RND.realInRange(
      -SQUARE_WIDTH / 2,
      SQUARE_WIDTH / 2,
    );

    const x =
      railType === "left" || railType === "right"
        ? randomPosition
        : railPosition + initialSidewaysDisplacement;
    const y =
      railType === "up" || railType === "down"
        ? randomPosition
        : railPosition + initialSidewaysDisplacement;

    let railAngle;
    switch (railType) {
      case "left":
        railAngle = Math.PI;
        break;
      case "right":
        railAngle = 0;
        break;
      case "up":
        railAngle = Math.PI / 2;
        break;
      case "down":
        railAngle = -Math.PI / 2;
        break;
    }
    const angleOffset = Phaser.Math.RND.realInRange(
      -CHICKEN_SPEEDS.maxStraightAngleOffset,
      CHICKEN_SPEEDS.maxStraightAngleOffset,
    );
    const angle = railAngle + angleOffset;
    super({
      x,
      y,
      angle,
      spriteType: "chicken_normal",
      scene,
      player,
      killPlayer,
    });
    this.chunk = { x: 0, y: 0 };
    this.railPosition = railPosition;
    this.railAngle = railAngle;
    this.angleOffset = angleOffset;

    this.chicken.on(
      "animationupdate",
      (
        _animation: Phaser.Animations.Animation,
        frame: Phaser.Animations.AnimationFrame,
      ) => {
        if (frame.index !== CHICKEN_SPRITE_PROPERTIES.landingFrame) return;

        // get unwrapped position
        const unwrappedX = this.x + this.chunk.x * BOARD_WIDTH;
        const unwrappedY = this.y + this.chunk.y * BOARD_WIDTH;

        // calculate sidewaysDisplacement based on the direction
        let sidewaysDisplacement;
        switch (railType) {
          case "left":
            sidewaysDisplacement = railPosition - unwrappedY;
            break;
          case "right":
            sidewaysDisplacement = unwrappedY - railPosition;
            break;
          case "up":
            sidewaysDisplacement = railPosition - unwrappedX;
            break;
          case "down":
            sidewaysDisplacement = unwrappedX - railPosition;
            break;
        }

        // try to reduce sideways displacement by changing the angle of the chicken
        this.angleOffset = Phaser.Math.Clamp(
          this.angleOffset +
            Phaser.Math.RND.realInRange(
              (-sidewaysDisplacement / CHICKEN_SPEEDS.forwardMax) *
                SPRITE_FRAME_RATE *
                0.005 -
                CHICKEN_SPEEDS.maxStraightAngleOffset,
              (-sidewaysDisplacement / CHICKEN_SPEEDS.forwardMax) *
                SPRITE_FRAME_RATE *
                0.005 +
                CHICKEN_SPEEDS.maxStraightAngleOffset,
            ),
          -CHICKEN_SPEEDS.maxStraightAngleOffset,
          CHICKEN_SPEEDS.maxStraightAngleOffset,
        );
        this.angle = this.railAngle + this.angleOffset;
      },
    );
  }
}
