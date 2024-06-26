import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  DEPOSIT_CHEST_XY,
  DEPOSIT_INDICATOR_PLAYER_DISTANCE,
} from "../../CropsAndChickensConstants";

interface Props {
  scene: Phaser.Scene;
  player?: BumpkinContainer;
  hasCropsInInventory: () => boolean;
}

export class DepositIndicatorContainer extends Phaser.GameObjects.Container {
  player?: BumpkinContainer;
  hasCropsInInventory: () => boolean;

  constructor({ scene, player, hasCropsInInventory }: Props) {
    super(scene, DEPOSIT_CHEST_XY, DEPOSIT_CHEST_XY);
    this.scene = scene;
    this.player = player;
    this.hasCropsInInventory = hasCropsInInventory;

    // create an off screen indicator
    const cropDepositArrow = this.scene.add.sprite(0, 0, "crop_deposit_arrow");

    this.setDepth(1000000);
    this.setVisible(false); // hide the indicator initially

    this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0 },
      duration: 500, // duration of the blink (half cycle)
      yoyo: true,
      repeat: -1, // repeat indefinitely
    });

    // add the sprite to the container
    this.add(cropDepositArrow);

    // add the container to the scene
    this.scene.add.existing(this);
  }

  /**
   * Should be called in the game update loop.
   */
  update(): void {
    // show indicator if off screen
    if (
      this.player &&
      !this.scene.cameras.main.worldView.contains(
        DEPOSIT_CHEST_XY,
        DEPOSIT_CHEST_XY
      )
    ) {
      this.moveIndicator(this.player.x, this.player.y);
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
  moveIndicator(playerX: number, playerY: number) {
    // calculate the angle of the indicator
    const angle = Phaser.Math.Angle.Between(
      playerX,
      playerY,
      DEPOSIT_CHEST_XY,
      DEPOSIT_CHEST_XY
    );

    // calculate the position of the indicator
    const indicatorX =
      playerX + Math.cos(angle) * DEPOSIT_INDICATOR_PLAYER_DISTANCE;
    const indicatorY =
      playerY + Math.sin(angle) * DEPOSIT_INDICATOR_PLAYER_DISTANCE;

    // position the indicator sprite and make it visible
    this.setPosition(indicatorX, indicatorY);
    this.setVisible(this.hasCropsInInventory());

    // rotate the indicator to point towards the object
    this.setRotation(angle);
  }
}
