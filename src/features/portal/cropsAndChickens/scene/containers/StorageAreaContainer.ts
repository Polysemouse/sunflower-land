import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { CROP_DEPOSIT_AREA_DIMENSIONS } from "../../CropsAndChickensConstants";
import { Physics } from "phaser";

interface Props {
  scene: Phaser.Scene;
  player?: BumpkinContainer;
  depositCrops: () => void;
}

export class StorageAreaContainer extends Phaser.GameObjects.Container {
  player?: BumpkinContainer;

  constructor({ scene, player, depositCrops }: Props) {
    super(
      scene,
      CROP_DEPOSIT_AREA_DIMENSIONS.x,
      CROP_DEPOSIT_AREA_DIMENSIONS.y
    );
    this.scene = scene;
    this.player = player;

    this.scene.physics.add.existing(this);

    if (!!this.body && !!player) {
      (this.body as Physics.Arcade.Body)
        .setSize(
          CROP_DEPOSIT_AREA_DIMENSIONS.width,
          CROP_DEPOSIT_AREA_DIMENSIONS.height
        )
        .setOffset(0, 0)
        .setImmovable(true)
        .setCollideWorldBounds(false);

      this.scene.physics.add.overlap(
        player,
        this,
        depositCrops,
        undefined,
        this
      );
    }

    // add the container to the scene
    this.scene.add.existing(this);
  }
}
