import { CropsAndChickensScene } from "../CropsAndChickensScene";
import Decimal from "decimal.js-light";
import { addActivity } from "./addActivity";
import { INDEX_TO_CROP } from "../../CropsAndChickensConstants";

/**
 * Harvests a crop.
 * @param scene The CropsAndChickensScene scene.
 * @param crops The crop sprites.
 * @param cropIndex The crop index.
 */
export const harvestCrop = (
  scene: CropsAndChickensScene,
  crops: Phaser.GameObjects.Sprite[],
  cropIndex: number,
) => {
  // destroy planted crop sprites
  crops.forEach((crop) => {
    if (crop.active) crop.destroy();
  });

  // play sound
  const sound = scene.sound.add("harvest");
  sound.play({ volume: 0.4 });

  // add crop to inventory
  addActivity(scene, `${INDEX_TO_CROP[cropIndex]} Harvested`, new Decimal(1));
  scene.portalService?.send("CROP_HARVESTED", { cropIndex: cropIndex });
};
