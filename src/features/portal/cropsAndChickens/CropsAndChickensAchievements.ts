import { translate } from "lib/i18n/translate";
import { getTotalCropsInGame } from "./lib/cropsAndChickensUtils";

export type CropsAndChickensAchievementName =
  | "But It's Honest Work"
  | "Dcol"
  | "Elite Gamer"
  | "Grain Offering"
  | "Grandmaster"
  | "Never Gonna Move You Up"
  | "Relentless"
  | "Ring of Fire"
  | "Rush to the Other Side"
  | "Ultimate Chain"
  | "Wheat King"
  | "White Death";

export const AVAILABLE_ACHIEVEMENTS: Record<
  CropsAndChickensAchievementName,
  { title: string; description: string; icon: string }
> = {
  "But It's Honest Work": {
    title: translate(
      "crops-and-chickens.achievement.but-its-honest-work.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.but-its-honest-work.description",
      {
        amount: getTotalCropsInGame("Potato"),
      },
    ),
    icon: "crops-and-chickens/achievements/achievement.but-its-honest-work.png",
  },
  Dcol: {
    title: translate("crops-and-chickens.achievement.dcol.title"),
    description: translate("crops-and-chickens.achievement.dcol.description", {
      amount: getTotalCropsInGame("Kale"),
    }),
    icon: "crops-and-chickens/achievements/achievement.dcol.png",
  },
  "Elite Gamer": {
    title: translate("crops-and-chickens.achievement.elite-gamer.title"),
    description: translate(
      "crops-and-chickens.achievement.elite-gamer.description",
    ),
    icon: "crops-and-chickens/achievements/achievement.elite-gamer.png",
  },
  "Grain Offering": {
    title: translate("crops-and-chickens.achievement.grain-offering.title"),
    description: translate(
      "crops-and-chickens.achievement.grain-offering.description",
      {
        amount: getTotalCropsInGame("Wheat"),
      },
    ),
    icon: "crops-and-chickens/achievements/achievement.grain-offering.png",
  },
  Grandmaster: {
    title: translate("crops-and-chickens.achievement.grandmaster.title"),
    description: translate(
      "crops-and-chickens.achievement.grandmaster.description",
    ),
    icon: "crops-and-chickens/achievements/achievement.grandmaster.png",
  },
  "Never Gonna Move You Up": {
    title: translate(
      "crops-and-chickens.achievement.never-gonna-move-you-up.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.never-gonna-move-you-up.description",
    ),
    icon: "crops-and-chickens/achievements/achievement.never-gonna-move-you-up.png",
  },
  Relentless: {
    title: translate("crops-and-chickens.achievement.relentless.title"),
    description: translate(
      "crops-and-chickens.achievement.relentless.description",
    ),
    icon: "crops-and-chickens/achievements/achievement.relentless.png",
  },
  "Ring of Fire": {
    title: translate("crops-and-chickens.achievement.ring-of-fire.title"),
    description: translate(
      "crops-and-chickens.achievement.ring-of-fire.description",
      {
        amount: getTotalCropsInGame("Radish"),
      },
    ),
    icon: "crops-and-chickens/achievements/achievement.ring-of-fire.png",
  },
  "Rush to the Other Side": {
    title: translate(
      "crops-and-chickens.achievement.rush-to-the-other-side.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.rush-to-the-other-side.description",
    ),
    icon: "crops-and-chickens/achievements/achievement.rush-to-the-other-side.png",
  },
  "Ultimate Chain": {
    title: translate("crops-and-chickens.achievement.ultimate-chain.title"),
    description: translate(
      "crops-and-chickens.achievement.ultimate-chain.description",
    ),
    icon: "crops-and-chickens/achievements/achievement.ultimate-chain.png",
  },
  "Wheat King": {
    title: translate("crops-and-chickens.achievement.wheat-king.title"),
    description: translate(
      "crops-and-chickens.achievement.wheat-king.description",
      {
        amount: getTotalCropsInGame("Wheat"),
      },
    ),
    icon: "crops-and-chickens/achievements/achievement.wheat-king.png",
  },
  "White Death": {
    title: translate("crops-and-chickens.achievement.white-death.title"),
    description: translate(
      "crops-and-chickens.achievement.white-death.description",
      {
        amount: getTotalCropsInGame("Cauliflower"),
      },
    ),
    icon: "crops-and-chickens/achievements/achievement.white-death.png",
  },
};
