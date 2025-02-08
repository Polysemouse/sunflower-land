import { CropsAndChickensAchievementName } from "../../CropsAndChickensAchievements";
import {
  CROP_TO_INDEX,
  GAME_SECONDS,
  TOTAL_CROP_TYPES,
} from "../../CropsAndChickensConstants";
import { getTotalCropsInGame } from "../../lib/cropsAndChickensUtils";
import { CropsAndChickensScene } from "../CropsAndChickensScene";

export type AchievementTrigger =
  | "deposit"
  | "empty deposit"
  | "game over"
  | "player killed by normal chicken"
  | "player killed by hunter chicken";

/**
 * Gets the eligible achievements for the scene.
 * @param scene The CropsAndChickensScene scene.
 * @param trigger The trigger for the achievement.
 * @returns The eligible achievements.
 */
export const getEligibleAchievements = (
  scene: CropsAndChickensScene,
  trigger: AchievementTrigger,
): CropsAndChickensAchievementName[] => {
  const achievementNames: CropsAndChickensAchievementName[] = [];

  const inventoryAndDepositedCropIndexes = [
    ...scene.inventoryCropIndexes,
    ...scene.depositedCropIndexes,
  ];

  switch (trigger) {
    case "deposit":
      if (
        inventoryAndDepositedCropIndexes.every(
          (cropIndex) => cropIndex === CROP_TO_INDEX["Potato"],
        ) &&
        inventoryAndDepositedCropIndexes.length ===
          getTotalCropsInGame("Potato") &&
        scene.harvestedCropIndexes.every(
          (cropIndex) => cropIndex === CROP_TO_INDEX["Potato"],
        ) &&
        scene.harvestedCropIndexes.length === getTotalCropsInGame("Potato") &&
        scene.secondsLeft >= GAME_SECONDS - 30
      ) {
        achievementNames.push("But It's Honest Work");
      }

      if (
        JSON.stringify(scene.inventoryCropIndexes) ===
        JSON.stringify(Array.from({ length: TOTAL_CROP_TYPES }, (_, i) => i))
      ) {
        achievementNames.push("Ultimate Chain");
      }

      break;
    case "empty deposit":
      if (
        !scene.hasGotToTheOtherSide &&
        scene.harvestedCropIndexes.length === 0 &&
        scene.deaths === 0 &&
        !scene.hasStopped &&
        !scene.hasGoneUp &&
        Math.max(Math.abs(scene.chunk.x), Math.abs(scene.chunk.y)) >= 1
      ) {
        scene.hasGotToTheOtherSide = true;
        achievementNames.push("Rush to the Other Side");
      }

      break;
    case "game over":
      if (
        scene.depositedCropIndexes.every(
          (cropIndex) => cropIndex === CROP_TO_INDEX["Kale"],
        ) &&
        scene.depositedCropIndexes.length === getTotalCropsInGame("Kale") &&
        scene.harvestedCropIndexes.every(
          (cropIndex) => cropIndex === CROP_TO_INDEX["Kale"],
        ) &&
        scene.harvestedCropIndexes.length === getTotalCropsInGame("Kale")
      ) {
        achievementNames.push("Dcol");
      }

      if (scene.score === 1337) {
        achievementNames.push("Elite Gamer");
      }

      if (scene.score >= 25000) {
        achievementNames.push("Grandmaster");
      }

      if (!scene.hasGoneUp && scene.score >= 2000) {
        achievementNames.push("Never Gonna Move You Up");
      }

      if (!scene.hasStopped && scene.score >= 10000) {
        achievementNames.push("Relentless");
      }

      if (
        scene.harvestedCropIndexes.filter(
          (cropIndex) => cropIndex === CROP_TO_INDEX["Radish"],
        ).length === getTotalCropsInGame("Radish")
      ) {
        achievementNames.push("Ring of Fire");
      }

      if (
        scene.depositedCropIndexes.filter(
          (cropIndex) => cropIndex === CROP_TO_INDEX["Wheat"],
        ).length === getTotalCropsInGame("Wheat")
      ) {
        achievementNames.push("Wheat King");
      }

      break;
    case "player killed by normal chicken":
    case "player killed by hunter chicken":
      if (
        scene.inventoryCropIndexes.every(
          (cropIndex) => cropIndex === CROP_TO_INDEX["Cauliflower"],
        ) &&
        scene.inventoryCropIndexes.length === getTotalCropsInGame("Cauliflower")
      ) {
        achievementNames.push("White Death");
      }

      switch (trigger) {
        case "player killed by hunter chicken":
          if (
            scene.inventoryCropIndexes.filter(
              (cropIndex) => cropIndex === CROP_TO_INDEX["Wheat"],
            ).length === getTotalCropsInGame("Wheat")
          ) {
            achievementNames.push("Grain Offering");
          }

          break;
      }

      break;
  }

  return achievementNames;
};
