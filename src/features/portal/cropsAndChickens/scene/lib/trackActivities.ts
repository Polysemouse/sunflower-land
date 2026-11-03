import type { CropsAndChickensScene } from "../CropsAndChickensScene";
import type { CropsAndChickensActivityName } from "../../CropsAndChickensActivities";
import type Decimal from "decimal.js-light";

/**
 * Track activities in the game.
 * @param scene The CropsAndChickensScene scene.
 * @param activities The activities to add.
 */
export const trackActivities = (
  scene: CropsAndChickensScene,
  activities: Record<CropsAndChickensActivityName, Decimal>,
) => {
  scene.portalService?.send("TRACK_ACTIVITIES", {
    activities: activities,
  });
};
