import {
  CHICKEN_SPRITE_PROPERTIES,
  PLAYER_DEATH_SPRITE_PROPERTIES,
} from "../../CropsAndChickensConstants";
import { CropsAndChickensScene } from "../CropsAndChickensScene";

export const preloadAssets = (scene: CropsAndChickensScene) => {
  // player death spritesheets
  scene.load.spritesheet(
    "player_death",
    "crops-and-chickens/player_death.png",
    {
      frameWidth: PLAYER_DEATH_SPRITE_PROPERTIES.frameWidth,
      frameHeight: PLAYER_DEATH_SPRITE_PROPERTIES.frameHeight,
    },
  );

  // normal chicken spritesheets
  scene.load.spritesheet(
    "chicken_normal_left",
    "crops-and-chickens/chicken_normal_left_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_normal_right",
    "crops-and-chickens/chicken_normal_right_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_normal_up",
    "crops-and-chickens/chicken_normal_up_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_normal_down",
    "crops-and-chickens/chicken_normal_down_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );

  // hunter chicken spritesheets
  scene.load.spritesheet(
    "chicken_hunter_left",
    "crops-and-chickens/chicken_hunter_left_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_hunter_right",
    "crops-and-chickens/chicken_hunter_right_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_hunter_up",
    "crops-and-chickens/chicken_hunter_up_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_hunter_down",
    "crops-and-chickens/chicken_hunter_down_movements.png",
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );

  // crops spritesheets
  scene.load.spritesheet(
    "crop_planted",
    "crops-and-chickens/crops_planted.png",
    {
      frameWidth: 16,
      frameHeight: 20,
    },
  );
  scene.load.spritesheet(
    "crop_harvested",
    "crops-and-chickens/crops_harvested.png",
    {
      frameWidth: 16,
      frameHeight: 16,
    },
  );

  // deposit indicator
  scene.load.image(
    "crop_deposit_arrow",
    "crops-and-chickens/crop_deposit_arrow.png",
  );

  // joystick indicator
  scene.load.image(
    "joystick_indicator_dot",
    "crops-and-chickens/joystick_indicator_dot.png",
  );

  // ambience SFX
  if (!scene.sound.get("nature_1")) {
    const nature1 = scene.sound.add("nature_1");
    nature1.play({ loop: true, volume: 0.01 });
  }

  // sound effects
  scene.load.audio("achievement_get", "crops-and-chickens/achievement_get.mp3");
  scene.load.audio("crop_deposit", "crops-and-chickens/crop_deposit.mp3");
  scene.load.audio(
    "crop_deposit_pop",
    "crops-and-chickens/crop_deposit_pop.mp3",
  );
  scene.load.audio("game_over", "crops-and-chickens/game_over.mp3");
  scene.load.audio("harvest", "crops-and-chickens/harvest.mp3");
  scene.load.audio("target_reached", "crops-and-chickens/target_reached.mp3");
  scene.load.audio("player_killed", "crops-and-chickens/player_killed.mp3");
  scene.load.audio("time_ticking", "crops-and-chickens/time_ticking.mp3");
  scene.load.audio(
    "time_ticking_preparation",
    "crops-and-chickens/time_ticking_preparation.mp3",
  );
};
