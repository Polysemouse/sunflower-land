import { translate } from "lib/i18n/translate";
import { getTotalCropsInGame } from "./lib/cropsAndChickensUtils";

export type CropsAndChickensAchievementName =
  | "Dcol"
  | "Elite Gamer"
  | "Grandmaster"
  | "Never Gonna Move You Up"
  | "Relentless"
  | "Rush to the Other Side"
  | "Ultimate Chain"
  | "Wheat King"
  | "White Death";

export const AVAILABLE_ACHIEVEMENTS: Record<
  CropsAndChickensAchievementName,
  { title: string; description: string; icon: string }
> = {
  Dcol: {
    title: translate("crops-and-chickens.achievement.dcol.title"),
    description: translate("crops-and-chickens.achievement.dcol.description", {
      amount: getTotalCropsInGame("Kale"),
    }),
    icon: "world/achievement.dcol.png",
  },
  "Elite Gamer": {
    title: translate("crops-and-chickens.achievement.elite-gamer.title"),
    description: translate(
      "crops-and-chickens.achievement.elite-gamer.description",
    ),
    icon: "world/achievement.elite-gamer.png",
  },
  Grandmaster: {
    title: translate("crops-and-chickens.achievement.grandmaster.title"),
    description: translate(
      "crops-and-chickens.achievement.grandmaster.description",
    ),
    icon: "world/achievement.grandmaster.png",
  },
  "Never Gonna Move You Up": {
    title: translate(
      "crops-and-chickens.achievement.never-gonna-move-you-up.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.never-gonna-move-you-up.description",
    ),
    icon: "world/achievement.never-gonna-move-you-up.png",
  },
  Relentless: {
    title: translate("crops-and-chickens.achievement.relentless.title"),
    description: translate(
      "crops-and-chickens.achievement.relentless.description",
    ),
    icon: "world/achievement.relentless.png",
  },
  "Rush to the Other Side": {
    title: translate(
      "crops-and-chickens.achievement.rush-to-the-other-side.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.rush-to-the-other-side.description",
    ),
    icon: "world/achievement.rush-to-the-other-side.png",
  },
  "Ultimate Chain": {
    title: translate("crops-and-chickens.achievement.ultimate-chain.title"),
    description: translate(
      "crops-and-chickens.achievement.ultimate-chain.description",
    ),
    icon: "world/achievement.ultimate-chain.png",
  },
  "Wheat King": {
    title: translate("crops-and-chickens.achievement.wheat-king.title"),
    description: translate(
      "crops-and-chickens.achievement.wheat-king.description",
      {
        amount: getTotalCropsInGame("Wheat"),
      },
    ),
    icon: "world/achievement.wheat-king.png",
  },
  "White Death": {
    title: translate("crops-and-chickens.achievement.white-death.title"),
    description: translate(
      "crops-and-chickens.achievement.white-death.description",
      {
        amount: getTotalCropsInGame("Cauliflower"),
      },
    ),
    icon: "world/achievement.white-death.png",
  },
};
