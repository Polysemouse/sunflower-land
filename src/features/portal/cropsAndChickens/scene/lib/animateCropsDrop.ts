import { CropsAndChickensScene } from "../CropsAndChickensScene";

/**
 * Animates dropping crops when player is killed.
 * @param scene The CropsAndChickensScene scene.
 */
export const animateCropsDrop = (scene: CropsAndChickensScene) => {
  // skip function if player not found
  if (!scene.currentPlayer) return;
  const player = scene.currentPlayer;

  // animate for each crop in inventory
  scene.inventoryCropIndexes.forEach((cropIndex) => {
    const cropSprite = scene.add.sprite(
      player.x,
      player.y,
      "crops_harvested",
      cropIndex,
    );

    // adjust the angle and distance for the crop to radiate outward
    const angle = Phaser.Math.Angle.Random();
    const distance = Phaser.Math.RND.between(30, 50);

    scene.tweens.add({
      targets: cropSprite,
      x: player.x + distance * Math.cos(angle),
      y: player.y + distance * Math.sin(angle),
      duration: 400,
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
            alpha: 0, // fade out to completely transparent
            delay: 500,
            duration: 500, // fade out duration
            onComplete: () => {
              if (cropSprite.active) cropSprite.destroy(); // destroy sprite after fading out
            },
          });
        });
      },
    });
  });
};
