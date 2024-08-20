import {
  CHICKEN_SPRITE_PROPERTIES,
  PLAYER_DEATH_SPRITE_PROPERTIES,
} from "../../CropsAndChickensConstants";
import { CropsAndChickensScene } from "../CropsAndChickensScene";

export const preloadAssets = (scene: CropsAndChickensScene) => {
  // player death spritesheets
  scene.load.spritesheet("player_death", "world/player_death.png", {
    frameWidth: PLAYER_DEATH_SPRITE_PROPERTIES.frameWidth,
    frameHeight: PLAYER_DEATH_SPRITE_PROPERTIES.frameHeight,
  });

  // normal chicken spritesheets
  scene.load.spritesheet(
    "chicken_normal_left",
    "world/chicken_normal_left_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_normal_right",
    "world/chicken_normal_right_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_normal_up",
    "world/chicken_normal_up_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_normal_down",
    "world/chicken_normal_down_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );

  // hunter chicken spritesheets
  scene.load.spritesheet(
    "chicken_hunter_left",
    "world/chicken_hunter_left_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_hunter_right",
    "world/chicken_hunter_right_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_hunter_up",
    "world/chicken_hunter_up_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_hunter_down",
    "world/chicken_hunter_down_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );

  // crops spritesheets
  scene.load.spritesheet("crop_planted", "world/crops_planted.png", {
    frameWidth: 16,
    frameHeight: 20,
  });
  scene.load.spritesheet("crop_harvested", "world/crops_harvested.png", {
    frameWidth: 16,
    frameHeight: 16,
  });

  // deposit indicator
  scene.load.image("crop_deposit_arrow", "world/crop_deposit_arrow.png");

  // ambience SFX
  if (!scene.sound.get("nature_1")) {
    const nature1 = scene.sound.add("nature_1");
    nature1.play({ loop: true, volume: 0.01 });
  }

  // sound effects
  scene.load.audio("achievement_get", "world/achievement_get.mp3");
  scene.load.audio("crop_deposit", "world/crop_deposit.mp3");
  scene.load.audio("crop_deposit_pop", "world/crop_deposit_pop.mp3");
  scene.load.audio("game_over", "world/game_over.mp3");
  scene.load.audio("harvest", "world/harvest.mp3");
  scene.load.audio("target_reached", "world/target_reached.mp3");
  scene.load.audio("player_killed", "world/player_killed.mp3");
  scene.load.audio("time_ticking", "world/time_ticking.mp3");
  scene.load.audio(
    "time_ticking_preparation",
    "world/time_ticking_preparation.mp3",
  );
};
