import { Message } from "features/game/components/SpeakingModal";
import { PolyTownInteractableName } from "./nameTypes";

export type PolyTownMessages = Record<PolyTownInteractableName, Message[]>;

export const POLY_TOWN_MESSAGES: PolyTownMessages = {
  beach_yellow_book: [],
  bench_blue_book: [],
  cave_green_book: [],
  cave_yellow_book: [],
  chicken_blue_book: [],
  farm_green_book: [],
  plaza_sign: [],
  farm_crop_minigame: [],
};
