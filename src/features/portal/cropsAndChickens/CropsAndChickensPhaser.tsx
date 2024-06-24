import React, { useContext, useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import NinePatchPlugin from "phaser3-rex-plugins/plugins/ninepatch-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";

import { Preloader } from "features/world/scenes/Preloader";
import { PortalContext } from "./lib/PortalProvider";
import { useSelector } from "@xstate/react";
import { CropsAndChickensScene } from "./scene/CropsAndChickensScene";
import { SceneId } from "features/world/mmoMachine";
import { PortalMachineState } from "./lib/cropsAndChickensMachine";

const _gameState = (state: PortalMachineState) => state.context.state;
const _id = (state: PortalMachineState) => state.context.id;

export const CropsAndChickensPhaser: React.FC = () => {
  const { portalService } = useContext(PortalContext);

  const gameState = useSelector(portalService, _gameState);
  const id = useSelector(portalService, _id);

  const [, setLoaded] = useState(false);

  const game = useRef<Game>();

  const scene: SceneId = "crops_and_chickens";

  const scenes = [Preloader, CropsAndChickensScene];

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      fps: {
        target: 30,
        smoothStep: true,
      },
      backgroundColor: "#000000",
      parent: "phaser-example",

      autoRound: true,
      pixelArt: true,
      plugins: {
        global: [
          {
            key: "rexNinePatchPlugin",
            plugin: NinePatchPlugin,
            start: true,
          },
          {
            key: "rexVirtualJoystick",
            plugin: VirtualJoystickPlugin,
            start: true,
          },
        ],
      },
      width: window.innerWidth,
      height: window.innerHeight,

      physics: {
        default: "arcade",
        arcade: {
          debug: true,
          gravity: { y: 0 },
        },
      },
      scene: scenes,
      loader: {
        crossOrigin: "anonymous",
      },
    };

    game.current = new Game({
      ...config,
      parent: "game-content",
    });

    game.current.registry.set("initialScene", scene);
    game.current.registry.set("gameState", gameState);
    game.current.registry.set("id", id);
    game.current.registry.set("portalService", portalService);

    setLoaded(true);

    return () => {
      game.current?.destroy(true);
    };
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div id="game-content" ref={ref} />
    </div>
  );
};
