import { SPAWNS } from "features/world/lib/spawn";
import { CropsAndChickensChickenName } from "../../CropsAndChickensChickenName";
import {
  HALLOWEEN_PLAYER_OPACITY,
  INDEX_TO_CROP,
  PLAYER_DEATH_SPRITE_PROPERTIES,
  SPRITE_FRAME_RATE,
} from "../../CropsAndChickensConstants";
import { getHolidayEvent } from "../../lib/cropsAndChickensUtils";
import { CropsAndChickensScene } from "../CropsAndChickensScene";
import Decimal from "decimal.js-light";
import { addActivity } from "./addActivity";
import { checkAchievements } from "./checkAchievements";
import { animateCropsDrop } from "./animateCropsDrop";

/**
 * Kills the player.
 * @param scene The CropsAndChickensScene scene.
 * @param chickenType The type of chicken that killed the player.
 */
export const killPlayer = (
  scene: CropsAndChickensScene,
  chickenType: CropsAndChickensChickenName,
) => {
  if (!scene.currentPlayer?.body || scene.isDead || !scene.isGamePlaying) {
    return;
  }

  // freeze player
  scene.isDead = true;
  scene.deaths += 1;
  scene.currentPlayer.setVisible(false);

  // play sound
  const sound = scene.sound.add("player_killed");
  sound.play({ volume: 0.4 });

  // achievements
  checkAchievements(
    scene,
    chickenType === "Normal Chicken"
      ? "player killed by normal chicken"
      : "player killed by hunter chicken",
  );

  // throw all crops out of the inventory
  animateCropsDrop(scene);
  addActivity(scene, `${chickenType} Collided`, new Decimal(1));
  scene.inventoryCropIndexes.forEach((cropIndex) => {
    addActivity(scene, `${INDEX_TO_CROP[cropIndex]} Dropped`, new Decimal(1));
  });
  scene.portalService?.send("PLAYER_KILLED");

  const spriteName = "player_death";
  const spriteKey = "player_death_anim";

  const playerDeath = scene.add.sprite(
    scene.currentPlayer.x,
    scene.currentPlayer.y - 1,
    spriteName,
  );
  scene.hudCamera?.ignore(playerDeath);
  playerDeath.setDepth(scene.currentPlayer.body.position.y);
  if (getHolidayEvent() === "halloween") {
    playerDeath.setAlpha(HALLOWEEN_PLAYER_OPACITY);
  }

  if (!scene.anims.exists(spriteKey as string)) {
    scene.anims.create({
      key: spriteKey,
      frames: scene.anims.generateFrameNumbers(spriteName, {
        start: 0,
        end: PLAYER_DEATH_SPRITE_PROPERTIES.frames - 1,
      }),
      repeat: 0,
      frameRate: SPRITE_FRAME_RATE,
    });
  }

  playerDeath.play({ key: spriteKey });
  if (scene.currentPlayer.directionFacing === "left") {
    playerDeath.setFlipX(true);
  }

  playerDeath.on("animationcomplete", async () => {
    if (!scene.currentPlayer) return;

    await new Promise((res) => setTimeout(res, 1000));

    scene.currentPlayer.x = SPAWNS().crops_and_chickens.default.x;
    scene.currentPlayer.y = SPAWNS().crops_and_chickens.default.y;

    scene.isDead = false;

    // show player if player is still playing
    if (scene.isGamePlaying) scene.currentPlayer.setVisible(true);

    if (playerDeath.active) playerDeath.destroy();
    scene.hunterChicken?.respawn();
  });
};
