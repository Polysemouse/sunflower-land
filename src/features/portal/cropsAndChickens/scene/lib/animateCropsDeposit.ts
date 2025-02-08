import { DEPOSIT_CHEST_XY } from "../../CropsAndChickensConstants";
import { CropsAndChickensScene } from "../CropsAndChickensScene";

/**
 * Animates depositing crops.
 * @param scene The CropsAndChickensScene scene.
 */
export const animateCropsDeposit = (scene: CropsAndChickensScene) => {
  // skip function if player not found
  if (!scene.currentPlayer) return;
  const player = scene.currentPlayer;

  // animate for each crop in inventory
  scene.inventoryCropIndexes.forEach(async (cropIndex, index) => {
    const cropSprite = scene.add.sprite(
      player.x,
      player.y,
      "crops_harvested",
      cropIndex,
    );

    // adjust the angle and distance for the crop to radiate outward
    const angle = Phaser.Math.Angle.Random();
    const distance = Phaser.Math.RND.between(16, 20);

    scene.tweens.add({
      targets: cropSprite,
      x: player.x + distance * Math.cos(angle),
      y: player.y + distance * Math.sin(angle),
      duration: 200,
      ease: "Quad.easeOut",
      onUpdate: () => {
        cropSprite.setDepth(cropSprite.y);
      },
      onComplete: (
        _: Phaser.Tweens.Tween,
        targets: Phaser.GameObjects.Sprite[],
      ) => {
        // fading tween starts when movement tween is complete
        targets.forEach((cropSprite) => {
          scene.tweens.add({
            targets: cropSprite,
            x: DEPOSIT_CHEST_XY,
            y: DEPOSIT_CHEST_XY,
            duration: 250,
            delay: index * 50, // delay each crop animation slightly
            ease: "Cubic.easeIn",
            onUpdate: () => {
              cropSprite.setDepth(cropSprite.y);
            },
            onComplete: () => {
              if (cropSprite.active) cropSprite.destroy();
              const sound = scene.sound.add("crop_deposit_pop");
              sound.play({
                volume: 0.1,
                detune: Phaser.Math.RND.between(-300, 300),
              });
            },
          });
        });
      },
    });
  });
};
