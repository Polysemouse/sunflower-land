import { SQUARE_WIDTH } from "features/game/lib/constants";
import { CropsAndChickensScene } from "../CropsAndChickensScene";
import {
  BOARD_WIDTH,
  PLAYER_DEATH_SPRITE_PROPERTIES,
  SPRITE_FRAME_RATE,
} from "../../CropsAndChickensConstants";
import { addActivity } from "./addActivity";
import Decimal from "decimal.js-light";

/**
 * Kills normal chickens around the player.
 * @param scene The CropsAndChickensScene scene.
 * @param radius The radius to kill chickens around the player in board coordinates.
 */
export const killNormalChickensAroundPlayer = (
  scene: CropsAndChickensScene,
  radius: number,
) => {
  const player = scene.currentPlayer;
  if (!player) return;

  // draw a circle around the player
  const graphicsArray = [
    scene.add.graphics(),
    scene.add.graphics(),
    scene.add.graphics(),
    scene.add.graphics(),
  ];

  graphicsArray.forEach((graphics, index) => {
    scene.hudCamera?.ignore(graphics);

    const offsetX = index % 2 === 0 ? 0 : BOARD_WIDTH;
    const offsetY = index < 2 ? 0 : BOARD_WIDTH;

    const circleX = Phaser.Math.Wrap(player.x, 0, BOARD_WIDTH);
    const circleY = Phaser.Math.Wrap(player.y, 0, BOARD_WIDTH);

    graphics
      .fillStyle(0xaf0000, 0.2)
      .fillCircle(circleX + offsetX, circleY + offsetY, radius * SQUARE_WIDTH)
      .strokeCircle(
        circleX + offsetX,
        circleY + offsetY,
        radius * SQUARE_WIDTH,
      );

    // add tween to fade out the circle
    scene.tweens.add({
      targets: graphics,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        graphics.destroy();
      },
    });
  });

  const skillSound = scene.sound.add("skill_chicken_explosion");
  skillSound.play({ volume: 0.4 });

  const chickens = scene.normalChickens.filter(
    (chicken) =>
      chicken.alpha > 0 &&
      Phaser.Math.Distance.Between(chicken.x, chicken.y, player.x, player.y) <
        radius * SQUARE_WIDTH,
  );
  if (chickens.length === 0) return;

  // play sound
  const chickenDeathSound = scene.sound.add("chicken_killed");
  chickenDeathSound.play({ volume: 0.4 });

  // track kills
  addActivity(scene, "Normal Chicken Collided", new Decimal(chickens.length));

  // add death sprite
  const spriteName = "chicken_death";
  const spriteKey = "chicken_death_anim";

  // kill chickens
  chickens.forEach((chicken) => {
    chicken.setAlpha(0);

    // wrap sprite positions around the board, with sprite offset
    const spriteX = Phaser.Math.Wrap(chicken.x + 5.5, 0, BOARD_WIDTH);
    const spriteY = Phaser.Math.Wrap(chicken.y + 5.5, 0, BOARD_WIDTH);

    // create sprites
    const sprites = [
      scene.add.sprite(spriteX, spriteY, spriteName),
      scene.add.sprite(spriteX + BOARD_WIDTH, spriteY, spriteName),
      scene.add.sprite(spriteX, spriteY + BOARD_WIDTH, spriteName),
      scene.add.sprite(
        spriteX + BOARD_WIDTH,
        spriteY + BOARD_WIDTH,
        spriteName,
      ),
    ];

    // create animation and play
    sprites.forEach((sprite) => {
      scene.hudCamera?.ignore(sprite);
      sprite.setDepth(chicken.body?.position.y || 0);

      if (!scene.anims.exists(spriteKey)) {
        scene.anims.create({
          key: spriteKey,
          frames: scene.anims.generateFrameNumbers(spriteName, {
            start: 0,
            end: PLAYER_DEATH_SPRITE_PROPERTIES.frames - 1,
          }),
          repeat: 0,
          frameRate: SPRITE_FRAME_RATE,
        });
      }

      sprite.play({ key: spriteKey });

      sprite.on("animationcomplete", async () => {
        if (sprite.active) sprite.destroy();
      });
    });
  });
};
