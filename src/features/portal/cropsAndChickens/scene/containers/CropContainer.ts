import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { BOARD_OFFSET, BOARD_WIDTH } from "../../CropsAndChickensConstants";
import { Physics } from "phaser";

interface Props {
  x: number;
  y: number;
  cropIndex: number;
  scene: Phaser.Scene;
  player?: BumpkinContainer;
  harvestCrop: (crops: Phaser.GameObjects.Sprite[], cropIndex: number) => void;
}

export class CropContainer extends Phaser.GameObjects.Container {
  constructor({ x, y, cropIndex, scene, player, harvestCrop }: Props) {
    super(scene, 8, 1); // crop sprites offset
    this.scene = scene;

    // wrap crop positions around the board, with sprite offset
    x = Phaser.Math.Wrap(x + 8, BOARD_OFFSET, BOARD_OFFSET + BOARD_WIDTH);
    y = Phaser.Math.Wrap(y + 1, BOARD_OFFSET, BOARD_OFFSET + BOARD_WIDTH);

    // create crop sprites
    const spriteName = "crop_planted";
    const crops = [
      this.scene.add.sprite(x, y, spriteName, cropIndex),
      this.scene.add.sprite(x + BOARD_WIDTH, y, spriteName, cropIndex),
      this.scene.add.sprite(x, y + BOARD_WIDTH, spriteName, cropIndex),
      this.scene.add.sprite(
        x + BOARD_WIDTH,
        y + BOARD_WIDTH,
        spriteName,
        cropIndex
      ),
    ];

    // set crop collisions
    crops.forEach((crop) => {
      scene.physics.add.existing(crop);
      crop.setDepth(crop.y);

      if (!crop.body || !player) return;

      (crop.body as Physics.Arcade.Body)
        .setSize(16, 12)
        .setOffset(0, 11)
        .setImmovable(true)
        .setCollideWorldBounds(true);

      scene.physics.add.overlap(
        player,
        crop,
        () => harvestCrop(crops, cropIndex),
        undefined,
        this
      );

      // do not add the sprite to the container and add the container to the scene
      // or else it will mess up the rendering depth
    });
  }
}