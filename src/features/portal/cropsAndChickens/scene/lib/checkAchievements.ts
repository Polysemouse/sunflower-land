import {
  AchievementTrigger,
  getEligibleAchievements,
} from "./getEligibleAchievements";
import { CropsAndChickensAchievementName } from "../../CropsAndChickensAchievements";
import { CropsAndChickensScene } from "../CropsAndChickensScene";

/**
 * Unlocks achievements.
 * @param scene The CropsAndChickensScene scene.
 * @param achievementNames The achievement names to unlock.
 */
const unlockAchievements = (
  scene: CropsAndChickensScene,
  achievementNames: CropsAndChickensAchievementName[],
) => {
  // if no new achievements, return
  if (
    achievementNames.every((name) =>
      scene.existingAchievementNames?.includes(name),
    )
  ) {
    return;
  }

  if (!scene.achievementGetSound?.isPlaying)
    scene.achievementGetSound?.play({ volume: 0.3 });
  scene.portalService?.send("UNLOCKED_ACHIEVEMENTS", {
    achievementNames: achievementNames,
  });
};

/**
 * Checks for achievements.
 * @param scene The CropsAndChickensScene scene.
 * @param trigger The trigger for the achievement.
 */
export const checkAchievements = (
  scene: CropsAndChickensScene,
  trigger: AchievementTrigger,
) => {
  if (!scene.hasBetaAccess) return;

  const achievementNames = getEligibleAchievements(scene, trigger);

  //TODO: enable achievements
  // if (achievementNames.length > 0) unlockAchievements(scene, achievementNames);
};
