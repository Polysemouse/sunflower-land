import { Message } from "features/game/components/SpeakingModal";
import { PolyTownNpcName } from "./nameTypes";

export type PolyTownNpcDialogs = Record<PolyTownNpcName, Message[]>;

export const POLY_TOWN_NPC_DIALOGS: PolyTownNpcDialogs = {
  ned: [],
  "poly bear": [],
  cluck: [],
  oblivia: [],
  autumn: [],
  garth: [],
  harlow: [],
  burt: [],
  wynken: [],
};
