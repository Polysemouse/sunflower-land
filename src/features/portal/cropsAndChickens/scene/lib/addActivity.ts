import { CropsAndChickensScene } from "../CropsAndChickensScene";
import { CropsAndChickensActivityName } from "../../CropsAndChickensActivities";
import Decimal from "decimal.js-light";

/**
 * Adds an activity to the scene.
 * @param scene The CropsAndChickensScene scene.
 * @param activity The activity name.
 * @param value The value to add.
 */
export const addActivity = (
  scene: CropsAndChickensScene,
  activity: CropsAndChickensActivityName,
  value: Decimal,
) => {
  scene.activities[activity] = scene.activities[activity]?.add(value) ?? value;
};
