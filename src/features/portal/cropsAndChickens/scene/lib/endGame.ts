import { CropsAndChickensScene } from "../CropsAndChickensScene";
import Decimal from "decimal.js-light";
import { addActivity } from "./addActivity";
import { checkAchievements } from "./checkAchievements";

/**
 * Ends the game.
 * @param scene The CropsAndChickensScene scene.
 */
export const endGame = (scene: CropsAndChickensScene) => {
  addActivity(scene, "Classic Mode Played", new Decimal(1));
  scene.portalService?.send("GAME_OVER");

  // play sound
  const sound = scene.sound.add("game_over");
  sound.play({ volume: 0.5 });

  // hide player
  scene.currentPlayer?.setVisible(false);

  // achievements
  checkAchievements(scene, "game over");
};
