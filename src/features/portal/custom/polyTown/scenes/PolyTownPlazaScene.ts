import mapJson from "../maps/poly_town_plaza.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { polyTownInteractableModalManager } from "../components/modals/PolyTownInteractableModals";
import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { polyTownNpcModalManager } from "../components/modals/PolyTownNPCModals";
import {
  POLY_TOWN_CAMERA_FADE_MS,
  POLY_TOWN_INTERACTABLE_DISTANCE,
} from "../lib/consts/consts";
import { POLY_TOWN_NPC_WEARABLES } from "../lib/consts/npcWearables";
import { PolyTownTeleportDestinationName } from "../lib/consts/nameTypes";
import { POLY_TOWN_TELEPORT_DESTINATIONS as POLY_TOWN_PLAZA_TELEPORT_DESTINATIONS } from "../lib/consts/teleportDestinations";
import { POLY_TOWN_NPCS_LOCATIONS } from "../lib/consts/npcLocations";

export class PolyTownPlazaScene extends BaseScene {
  sceneId: SceneId = "poly_town_plaza";

  constructor() {
    super({
      name: "poly_town_plaza",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    // spritesheets
    this.load.spritesheet("portal", "world/portal.png", {
      frameWidth: 30,
      frameHeight: 30,
    });

    // Ambience SFX
    if (!this.sound.get("nature_1")) {
      const nature1 = this.sound.add("nature_1");
      nature1.play({ loop: true, volume: 0.01 });
    }

    // Shut down the sound when the scene changes
    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "main-map",
    });

    super.create();

    this.initialisePolyTownNpcs();

    this.createPortal(48, 71);

    // Setup custom interactable layers
    if (this.map.getObjectLayer("Poly Town Interactable")) {
      const polyTownInteractablesPolygons = this.map.createFromObjects(
        "Poly Town Interactable",
        {}
      );
      polyTownInteractablesPolygons.forEach((polygon) => {
        polygon
          .setInteractive({ cursor: "pointer" })
          .removeFromDisplayList()
          .on("pointerdown", (p: Phaser.Input.Pointer) => {
            if (p.downElement.nodeName === "CANVAS") {
              const interactable = polygon as Phaser.GameObjects.Sprite;
              const coordinates = { x: interactable.x, y: interactable.y };

              const distance = Phaser.Math.Distance.BetweenPoints(
                coordinates,
                this.currentPlayer as BumpkinContainer
              );

              if (distance > POLY_TOWN_INTERACTABLE_DISTANCE) {
                return;
              }
              const id = polygon.data.list.id;
              polyTownInteractableModalManager.open(id);
            }
          });
      });
    }

    // entering or exiting cave entrance
    this.onCollision["beach_cave_entrance"] = () => {
      this.teleportPlayer("cave exit");
    };
    this.onCollision["cave_exit"] = () => {
      this.teleportPlayer("beach cave entrance");
    };
  }

  /**
   * Initialize NPCs.
   */
  private initialisePolyTownNpcs = () => {
    POLY_TOWN_NPCS_LOCATIONS.filter(
      (bumpkin) => bumpkin.scene === "poly_town_plaza"
    ).forEach((bumpkin) => {
      const defaultClick = () => {
        const distance = Phaser.Math.Distance.BetweenPoints(
          container,
          this.currentPlayer as BumpkinContainer
        );

        if (distance > POLY_TOWN_INTERACTABLE_DISTANCE) {
          container.speak("You are too far away");
          return;
        }
        polyTownNpcModalManager.open({
          npc: bumpkin.npc,
          changeScene: this.changeScene,
        });
      };

      const container = new BumpkinContainer({
        scene: this,
        x: bumpkin.x,
        y: bumpkin.y,
        clothing: {
          ...(bumpkin.clothing ?? POLY_TOWN_NPC_WEARABLES[bumpkin.npc]),
          updatedAt: 0,
        },
        onClick: bumpkin.onClick ?? defaultClick,
        name: bumpkin.npc,
        direction: bumpkin.direction ?? "right",
      });

      container.setDepth(bumpkin.y);
      (container.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 20)
        .setOffset(0, 0)
        .setImmovable(true)
        .setCollideWorldBounds(true);

      this.physics.world.enable(container);
      this.colliders?.add(container);
      this.triggerColliders?.add(container);
    });
  };

  /**
   * Teleport player to desired destination.
   * @param {PolyTownTeleportDestinationName} destinationName The teleport destination
   */
  private teleportPlayer = (
    destinationName: PolyTownTeleportDestinationName
  ) => {
    this.cameras.main.fadeOut(POLY_TOWN_CAMERA_FADE_MS);
    const originalWalkingSpeed = this.walkingSpeed;
    this.walkingSpeed = 0;

    this.cameras.main.on(
      "camerafadeoutcomplete",
      () => {
        this.cameras.main.fadeIn(POLY_TOWN_CAMERA_FADE_MS);

        if (!this.currentPlayer) {
          return;
        }

        const destination =
          POLY_TOWN_PLAZA_TELEPORT_DESTINATIONS[destinationName];

        this.currentPlayer.x = destination.x;
        this.currentPlayer.y = destination.y;
        this.walkingSpeed = originalWalkingSpeed;
      },
      this
    );
  };

  /**
   * Creates a portal.
   * @param x The x coordinate of the crop.
   * @param y The y coordinate of the crop.
   * @returns The crop group for that crop.
   */
  private createPortal(x: number, y: number) {
    const spriteName = "portal";
    const spriteKey = "portal_anim";
    this.anims.create({
      key: spriteKey,
      frames: this.anims.generateFrameNumbers(spriteName, {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 10,
    });

    const portal = this.add.sprite(x, y, spriteName);
    portal.play(spriteKey);
  }
}
