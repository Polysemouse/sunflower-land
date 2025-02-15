import {
  CHICKEN_DEATH_SPRITE_PROPERTIES,
  CHICKEN_SPRITE_PROPERTIES,
  PLAYER_DEATH_SPRITE_PROPERTIES,
} from "../../CropsAndChickensConstants";
import { getHolidayAsset } from "../../lib/CropsAndChickensHolidayAsset";
import { getHolidayEvent } from "../../lib/cropsAndChickensUtils";
import { CropsAndChickensScene } from "../CropsAndChickensScene";

/**
 * Preloads assets.
 * @param scene The CropsAndChickensScene scene.
 */
export const preloadAssets = (scene: CropsAndChickensScene) => {
  const holidayEvent = getHolidayEvent();

  // halloween tilesheet
  scene.load.image(
    "halloween-tilesheet",
    "crops-and-chickens/tilesets/halloween-tilesheet.png",
  );

  // christmas tilesheet
  scene.load.image(
    "christmas-tilesheet",
    "crops-and-chickens/tilesets/christmas-tilesheet.png",
  );

  // player death spritesheets
  scene.load.spritesheet(
    "player_death",
    "crops-and-chickens/player_death.png",
    {
      frameWidth: PLAYER_DEATH_SPRITE_PROPERTIES.frameWidth,
      frameHeight: PLAYER_DEATH_SPRITE_PROPERTIES.frameHeight,
    },
  );

  // chicken death spritesheets
  scene.load.spritesheet(
    "chicken_death",
    "crops-and-chickens/chicken_death.png",
    {
      frameWidth: CHICKEN_DEATH_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_DEATH_SPRITE_PROPERTIES.frameHeight,
    },
  );

  // normal chicken spritesheets
  scene.load.spritesheet(
    "chicken_normal_left",
    getHolidayAsset("chicken_normal_left_movements", holidayEvent),
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_normal_right",
    getHolidayAsset("chicken_normal_right_movements", holidayEvent),
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_normal_up",
    getHolidayAsset("chicken_normal_up_movements", holidayEvent),
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_normal_down",
    getHolidayAsset("chicken_normal_down_movements", holidayEvent),
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );

  // hunter chicken spritesheets
  scene.load.spritesheet(
    "chicken_hunter_left",
    getHolidayAsset("chicken_hunter_left_movements", holidayEvent),
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_hunter_right",
    getHolidayAsset("chicken_hunter_right_movements", holidayEvent),
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_hunter_up",
    getHolidayAsset("chicken_hunter_up_movements", holidayEvent),
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );
  scene.load.spritesheet(
    "chicken_hunter_down",
    getHolidayAsset("chicken_hunter_down_movements", holidayEvent),
    {
      frameWidth: CHICKEN_SPRITE_PROPERTIES.frameWidth,
      frameHeight: CHICKEN_SPRITE_PROPERTIES.frameHeight,
    },
  );

  // crops spritesheets
  scene.load.spritesheet(
    "crops_planted",
    getHolidayAsset("crops_planted", holidayEvent),
    {
      frameWidth: 16,
      frameHeight: 20,
    },
  );
  scene.load.spritesheet(
    "crops_harvested",
    getHolidayAsset("crops_harvested", holidayEvent),
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
  scene.load.audio(
    "achievement_get",
    "crops-and-chickens/audio/achievement_get.mp3",
  );
  scene.load.audio("crop_deposit", "crops-and-chickens/audio/crop_deposit.mp3");
  scene.load.audio(
    "crop_deposit_pop",
    "crops-and-chickens/audio/crop_deposit_pop.mp3",
  );
  scene.load.audio("game_over", "crops-and-chickens/audio/game_over.mp3");
  scene.load.audio("harvest", getHolidayAsset("audio_harvest", holidayEvent));
  scene.load.audio(
    "target_reached",
    "crops-and-chickens/audio/target_reached.mp3",
  );
  scene.load.audio(
    "chicken_killed",
    "crops-and-chickens/audio/chicken_killed.mp3",
  );
  scene.load.audio(
    "skill_chicken_explosion",
    "crops-and-chickens/audio/skill_chicken_explosion.mp3",
  );

  scene.load.audio(
    "player_killed",
    getHolidayAsset("audio_player_killed", holidayEvent),
  );
  scene.load.audio("time_ticking", "crops-and-chickens/audio/time_ticking.mp3");
  scene.load.audio(
    "time_ticking_preparation",
    "crops-and-chickens/audio/time_ticking_preparation.mp3",
  );
};
