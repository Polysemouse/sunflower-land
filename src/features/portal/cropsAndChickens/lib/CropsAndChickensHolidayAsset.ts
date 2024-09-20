import { ITEM_DETAILS } from "features/game/types/images";
import { CropsAndChickensHolidayEvent } from "./cropsAndChickensUtils";
import { CropsAndChickensCropName } from "../CropsAndChickensConstants";
import { t } from "i18next";
import mapJson from "assets/map/crops_and_chickens.json";
import mapJson_halloween from "assets/map/crops_and_chickens_halloween.json";

type CropsAndChickensAssetName =
  | "map"
  | "chicken_hunter_down_movements"
  | "chicken_hunter_left_movements"
  | "chicken_hunter_right_movements"
  | "chicken_hunter_up_movements"
  | "chicken_normal_down_movements"
  | "chicken_normal_left_movements"
  | "chicken_normal_right_movements"
  | "chicken_normal_up_movements"
  | "chicken_hunter"
  | "chicken_normal"
  | "crops_harvested"
  | "crops_planted"
  | CropsAndChickensCropName
  | "audio_harvest"
  | "audio_player_killed"
  | "game_title"
  | "game_title_icon"
  | "game_title_secondary_icon";

const CROPS_AND_CHICKENS_ASSETS: Record<
  CropsAndChickensAssetName,
  Partial<Record<CropsAndChickensHolidayEvent, any>> & { none: any }
> = {
  map: {
    none: mapJson,
    halloween: mapJson_halloween,
  },
  chicken_hunter_down_movements: {
    none: "crops-and-chickens/chicken_hunter_down_movements.png",
    halloween: "crops-and-chickens/chicken_hunter_down_movements_halloween.png",
    christmas: "crops-and-chickens/chicken_hunter_down_movements_christmas.png",
    april_fools:
      "crops-and-chickens/chicken_hunter_down_movements_april_fools.png",
  },
  chicken_hunter_left_movements: {
    none: "crops-and-chickens/chicken_hunter_left_movements.png",
    halloween: "crops-and-chickens/chicken_hunter_left_movements_halloween.png",
    christmas: "crops-and-chickens/chicken_hunter_left_movements_christmas.png",
    april_fools:
      "crops-and-chickens/chicken_hunter_left_movements_april_fools.png",
  },
  chicken_hunter_right_movements: {
    none: "crops-and-chickens/chicken_hunter_right_movements.png",
    halloween:
      "crops-and-chickens/chicken_hunter_right_movements_halloween.png",
    christmas:
      "crops-and-chickens/chicken_hunter_right_movements_christmas.png",
    april_fools:
      "crops-and-chickens/chicken_hunter_right_movements_april_fools.png",
  },
  chicken_hunter_up_movements: {
    none: "crops-and-chickens/chicken_hunter_up_movements.png",
    halloween: "crops-and-chickens/chicken_hunter_up_movements_halloween.png",
    christmas: "crops-and-chickens/chicken_hunter_up_movements_christmas.png",
    april_fools:
      "crops-and-chickens/chicken_hunter_up_movements_april_fools.png",
  },
  chicken_normal_up_movements: {
    none: "crops-and-chickens/chicken_normal_up_movements.png",
    halloween: "crops-and-chickens/chicken_normal_up_movements_halloween.png",
    christmas: "crops-and-chickens/chicken_normal_up_movements_christmas.png",
    april_fools:
      "crops-and-chickens/chicken_normal_up_movements_april_fools.png",
  },
  chicken_normal_down_movements: {
    none: "crops-and-chickens/chicken_normal_down_movements.png",
    halloween: "crops-and-chickens/chicken_normal_down_movements_halloween.png",
    christmas: "crops-and-chickens/chicken_normal_down_movements_christmas.png",
    april_fools:
      "crops-and-chickens/chicken_normal_down_movements_april_fools.png",
  },
  chicken_normal_left_movements: {
    none: "crops-and-chickens/chicken_normal_left_movements.png",
    halloween: "crops-and-chickens/chicken_normal_left_movements_halloween.png",
    christmas: "crops-and-chickens/chicken_normal_left_movements_christmas.png",
    april_fools:
      "crops-and-chickens/chicken_normal_left_movements_april_fools.png",
  },
  chicken_normal_right_movements: {
    none: "crops-and-chickens/chicken_normal_right_movements.png",
    halloween:
      "crops-and-chickens/chicken_normal_right_movements_halloween.png",
    christmas:
      "crops-and-chickens/chicken_normal_right_movements_christmas.png",
    april_fools:
      "crops-and-chickens/chicken_normal_right_movements_april_fools.png",
  },
  chicken_hunter: {
    none: "crops-and-chickens/chicken_hunter.png",
    halloween: "crops-and-chickens/chicken_hunter_halloween.png",
    christmas: "crops-and-chickens/chicken_hunter_christmas.png",
    april_fools: "crops-and-chickens/chicken_hunter_april_fools.png",
  },
  chicken_normal: {
    none: "crops-and-chickens/chicken_normal.png",
    halloween: "crops-and-chickens/chicken_normal_halloween.png",
    christmas: "crops-and-chickens/chicken_normal_christmas.png",
    april_fools: "crops-and-chickens/chicken_normal_april_fools.png",
  },
  crops_harvested: {
    none: "crops-and-chickens/crops_harvested.png",
    halloween: "crops-and-chickens/crops_harvested_halloween.png",
    april_fools: "crops-and-chickens/crops_harvested_april_fools.png",
  },
  crops_planted: {
    none: "crops-and-chickens/crops_planted.png",
    halloween: "crops-and-chickens/crops_planted_halloween.png",
    april_fools: "crops-and-chickens/crops_planted_april_fools.png",
  },
  Sunflower: {
    none: ITEM_DETAILS["Sunflower"].image,
    april_fools: "crops-and-chickens/crops/sunflower_april_fools.png",
  },
  Potato: {
    none: ITEM_DETAILS["Potato"].image,
    april_fools: "crops-and-chickens/crops/potato_april_fools.png",
  },
  Pumpkin: {
    none: ITEM_DETAILS["Pumpkin"].image,
    halloween: "crops-and-chickens/crops/pumpkin_halloween.png",
    april_fools: "crops-and-chickens/crops/pumpkin_april_fools.png",
  },
  Carrot: {
    none: ITEM_DETAILS["Carrot"].image,
    april_fools: "crops-and-chickens/crops/carrot_april_fools.png",
  },
  Cabbage: {
    none: ITEM_DETAILS["Cabbage"].image,
    april_fools: "crops-and-chickens/crops/cabbage_april_fools.png",
  },
  Beetroot: {
    none: ITEM_DETAILS["Beetroot"].image,
    april_fools: "crops-and-chickens/crops/beetroot_april_fools.png",
  },
  Cauliflower: {
    none: ITEM_DETAILS["Cauliflower"].image,
    april_fools: "crops-and-chickens/crops/cauliflower_april_fools.png",
  },
  Parsnip: {
    none: ITEM_DETAILS["Parsnip"].image,
    april_fools: "crops-and-chickens/crops/parsnip_april_fools.png",
  },
  Radish: {
    none: ITEM_DETAILS["Radish"].image,
    april_fools: "crops-and-chickens/crops/radish_april_fools.png",
  },
  Wheat: {
    none: ITEM_DETAILS["Wheat"].image,
    april_fools: "crops-and-chickens/crops/wheat_april_fools.png",
  },
  Kale: {
    none: ITEM_DETAILS["Kale"].image,
    april_fools: "crops-and-chickens/crops/kale_april_fools.png",
  },
  audio_harvest: {
    none: "crops-and-chickens/audio/harvest.mp3",
    april_fools: "crops-and-chickens/audio/harvest_april_fools.mp3",
  },
  audio_player_killed: {
    none: "crops-and-chickens/audio/player_killed.mp3",
    april_fools: "crops-and-chickens/audio/player_killed_april_fools.mp3",
  },
  game_title: {
    none: t("crops-and-chickens.homeTitle"),
    april_fools: t("crops-and-chickens.homeTitleReversed"),
  },
  game_title_icon: {
    none: ITEM_DETAILS["Kale"].image,
    april_fools: ITEM_DETAILS["Chicken"].image,
  },
  game_title_secondary_icon: {
    none: ITEM_DETAILS["Chicken"].image,
    april_fools: ITEM_DETAILS["Kale"].image,
  },
};

export const getHolidayAsset = (
  assetName: CropsAndChickensAssetName,
  holidayEvent: CropsAndChickensHolidayEvent,
): string => {
  return (
    CROPS_AND_CHICKENS_ASSETS[assetName][holidayEvent] ??
    CROPS_AND_CHICKENS_ASSETS[assetName].none
  );
};
