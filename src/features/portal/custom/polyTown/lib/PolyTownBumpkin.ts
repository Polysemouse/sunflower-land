import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { PolyTownNpcName } from "./consts/nameTypes";
import { SceneId } from "features/world/mmoMachine";

export type PolyTownNpcBumpkin = {
  x: number;
  y: number;
  npc: PolyTownNpcName;
  scene: SceneId;
  direction?: "left" | "right";
  clothing?: BumpkinParts;
  onClick?: () => void;
};
