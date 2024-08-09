import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  DEPOSIT_CHEST_XY,
  INDEX_TO_CROP,
} from "../../CropsAndChickensConstants";
import { getTotalCropsInGame } from "../../lib/cropsAndChickensUtils";

interface Props {
  scene: Phaser.Scene;
  player?: BumpkinContainer;
  harvestedCropIndexes: () => number[];
}

export class HarvestPopupContainer extends Phaser.GameObjects.Container {
  player?: BumpkinContainer;
  harvestedCropIndexes: () => number[];
  cropSprite?: Phaser.GameObjects.Sprite;
  label?: Phaser.GameObjects.BitmapText;
  cropIndex?: number;
  cropIndexTimeoutId?: NodeJS.Timeout;
  fadeTween?: Phaser.Tweens.Tween;

  constructor({ scene, player, harvestedCropIndexes }: Props) {
    super(scene, DEPOSIT_CHEST_XY, DEPOSIT_CHEST_XY);
    this.scene = scene;
    this.player = player;
    this.harvestedCropIndexes = harvestedCropIndexes;

    // create the sprite and label
    this.cropSprite = scene.add.sprite(-4, 0, "crop_harvested", 0);
    this.label = this.scene.add.bitmapText(6, -2, "Teeny Tiny Pixls", "", 5, 1);

    this.setDepth(1000000);
    this.setVisible(false); // hide the indicator initially

    // add the sprite to the container
    this.add(this.cropSprite);
    this.add(this.label);

    // add the container to the scene
    scene.add.existing(this);
  }

  public showPopup(cropIndex: number) {
    this.cropIndex = cropIndex;
    this.cropSprite?.setFrame(cropIndex);
    this.cropSprite?.setAlpha(1);
    this.label?.setAlpha(1);

    // set the label text
    this.label?.setText(
      `${this.harvestedCropIndexes().filter((i) => i === cropIndex).length}/${getTotalCropsInGame(INDEX_TO_CROP[cropIndex])}`,
    );

    // clear the previous timeout
    if (this.cropIndexTimeoutId) {
      clearTimeout(this.cropIndexTimeoutId);
      this.cropIndexTimeoutId = undefined;
    }

    // clear the previous fade tween
    if (this.fadeTween) {
      this.fadeTween.stop();
      this.fadeTween = undefined;
    }

    this.cropIndexTimeoutId = setTimeout(() => {
      // fade out the popup
      this.fadeTween = this.scene.tweens.add({
        targets: [this.cropSprite, this.label],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.cropIndex = undefined;
        },
      });
    }, 1000);
  }

  /**
   * Should be called in the game update loop.
   */
  update(): void {
    // show indicator if off screen
    if (this.player?.body?.position && this.cropIndex !== undefined) {
      this.movePopup(this.player.body.position.x, this.player.body.position.y);
    } else {
      // hide the indicator if the object is on the screen
      this.setVisible(false);
    }
  }

  /**
   * Move the deposit indicator.
   * @param playerX The x coordinates of the player's position.
   * @param playerY The y coordinates of the player's position.
   */
  movePopup(playerX: number, playerY: number) {
    // position the popup and make it visible
    this.setPosition(playerX, playerY - 20);
    this.setVisible(true);
  }
}
