import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  CHICKEN_SPRITE_PROPERTIES,
  HUNTER_CHICKEN_INITIAL_DISTANCE,
  HUNTER_CHICKEN_SPEED_MULTIPLIER,
} from "../../CropsAndChickensConstants";
import { SPAWNS } from "features/world/lib/spawn";
import { BaseChickenContainer } from "./BaseChickenContainer";

interface Props {
  scene: Phaser.Scene;
  player?: BumpkinContainer;
  isChickenFrozen: () => boolean;
  killPlayer: () => void;
}

const getNormalizedPlayerCoordinates = (player?: BumpkinContainer) => {
  const playerCoordinatesOffset = {
    x: -5.5,
    y: 0,
  };

  return player
    ? {
        x: player.x + playerCoordinatesOffset.x,
        y: player.y + playerCoordinatesOffset.y,
      }
    : {
        x: SPAWNS().crops_and_chickens.default.x + playerCoordinatesOffset.x,
        y: SPAWNS().crops_and_chickens.default.y + playerCoordinatesOffset.y,
      };
};

const getAngleTowardsPlayer = (
  x: number,
  y: number,
  player?: BumpkinContainer,
) => {
  const normalizedPlayerCoordinates = getNormalizedPlayerCoordinates(player);
  const angleTowardsPlayer = Phaser.Math.Angle.Between(
    x,
    y,
    normalizedPlayerCoordinates.x,
    normalizedPlayerCoordinates.y,
  );
  return angleTowardsPlayer;
};

const getDistanceBetweenPlayer = (
  x: number,
  y: number,
  player?: BumpkinContainer,
) => {
  const playerCoordinates = getNormalizedPlayerCoordinates(player);
  return Phaser.Math.Distance.Between(
    playerCoordinates.x,
    playerCoordinates.y,
    x,
    y,
  );
};

const getRespawnState = (player?: BumpkinContainer) => {
  const initialAngle = Phaser.Math.Angle.Random();

  const playerCoordinates = getNormalizedPlayerCoordinates(player);
  const x =
    playerCoordinates.x +
    HUNTER_CHICKEN_INITIAL_DISTANCE * Math.cos(initialAngle);
  const y =
    playerCoordinates.y +
    HUNTER_CHICKEN_INITIAL_DISTANCE * Math.sin(initialAngle);
  const angleTowardsPlayer = getAngleTowardsPlayer(x, y, player);

  return {
    angle: angleTowardsPlayer,
    x,
    y,
  };
};

export class HunterChickenContainer extends BaseChickenContainer {
  player?: BumpkinContainer;

  constructor({ scene, player, isChickenFrozen, killPlayer }: Props) {
    const respawnState = getRespawnState(player);
    super({
      x: respawnState.x,
      y: respawnState.y,
      angle: respawnState.angle,
      spriteType: "chicken_hunter",
      scene,
      player,
      killPlayer,
    });

    // set initial speed multiplier
    this.speedMultiplier = 0;

    this.chicken.on(
      "animationupdate",
      (
        _animation: Phaser.Animations.Animation,
        frame: Phaser.Animations.AnimationFrame,
      ) => {
        if (!this.body || !player) return;
        if (frame.index !== CHICKEN_SPRITE_PROPERTIES.landingFrame) return;

        const distance = getDistanceBetweenPlayer(this.x, this.y, player);
        this.angle = getAngleTowardsPlayer(this.x, this.y, player);

        if (isChickenFrozen()) {
          this.speedMultiplier = 0;
        } else {
          // increase speed of the chicken if it is too far from the player
          this.speedMultiplier = HUNTER_CHICKEN_SPEED_MULTIPLIER;
          if (distance >= HUNTER_CHICKEN_INITIAL_DISTANCE) {
            this.speedMultiplier *= Math.pow(
              distance / HUNTER_CHICKEN_INITIAL_DISTANCE,
              2,
            );
          }
        }
      },
    );
  }

  /**
   * Respawns the chicken.
   */
  public respawn = () => {
    const respawnState = getRespawnState(this.player);
    this.angle = respawnState.angle;
    this.x = respawnState.x;
    this.y = respawnState.y;
  };
}
