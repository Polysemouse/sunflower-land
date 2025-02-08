import { CropsAndChickensScene } from "../CropsAndChickensScene";
import Decimal from "decimal.js-light";
import { checkAchievements } from "./checkAchievements";
import { animateCropsDeposit } from "./animateCropsDeposit";
import { addActivity } from "./addActivity";
import { INDEX_TO_CROP } from "../../CropsAndChickensConstants";

/**
 * Deposits crops.
 * @param scene The CropsAndChickensScene scene.
 */
export const depositCrops = (scene: CropsAndChickensScene) => {
  // achievements
  checkAchievements(scene, "empty deposit");

  // skip function if there are nothing to deposit
  if (scene.inventoryCropIndexes.length === 0) return;

  // play sound
  const cropDepositSound = scene.sound.add("crop_deposit");
  cropDepositSound.play({ volume: 0.1 });

  // play target reached sound if target is reached
  if (
    scene.targetScore >= 0 &&
    scene.score < scene.targetScore &&
    scene.score + scene.inventory >= scene.targetScore
  ) {
    const targetReachedSound = scene.sound.add("target_reached");
    targetReachedSound.play({ volume: 1.0 });
  }

  // achievements
  checkAchievements(scene, "deposit");

  // score and remove all crops from inventory
  animateCropsDeposit(scene);
  scene.inventoryCropIndexes.forEach((cropIndex) => {
    addActivity(scene, `${INDEX_TO_CROP[cropIndex]} Deposited`, new Decimal(1));
  });
  scene.portalService?.send("CROP_DEPOSITED");
};
