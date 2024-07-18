import { translate } from "lib/i18n/translate";

export type CropsAndChickensAchievementName =
  | "Dcol"
  | "Get to the Other Side"
  | "Grand Master"
  | "Never Goes Up"
  | "The Elite"
  | "Ultimate Chain"
  | "Wheat King"
  | "White Death";

export const AVAILABLE_ACHIEVEMENTS: Record<
  CropsAndChickensAchievementName,
  { title: string; description: string }
> = {
  Dcol: {
    title: translate("crops-and-chickens.achievement.dcol.title"),
    description: translate("crops-and-chickens.achievement.dcol.description"),
  },
  "Get to the Other Side": {
    title: translate(
      "crops-and-chickens.achievement.get-to-the-other-side.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.get-to-the-other-side.description",
    ),
  },
  "Grand Master": {
    title: translate("crops-and-chickens.achievement.grandmaster.title"),
    description: translate(
      "crops-and-chickens.achievement.grandmaster.description",
    ),
  },
  "Never Goes Up": {
    title: translate("crops-and-chickens.achievement.never-goes-up.title"),
    description: translate(
      "crops-and-chickens.achievement.never-goes-up.description",
    ),
  },
  "The Elite": {
    title: translate("crops-and-chickens.achievement.the-elite.title"),
    description: translate(
      "crops-and-chickens.achievement.the-elite.description",
    ),
  },
  "Ultimate Chain": {
    title: translate("crops-and-chickens.achievement.ultimate-chain.title"),
    description: translate(
      "crops-and-chickens.achievement.ultimate-chain.description",
    ),
  },
  "Wheat King": {
    title: translate("crops-and-chickens.achievement.wheat-king.title"),
    description: translate(
      "crops-and-chickens.achievement.wheat-king.description",
    ),
  },
  "White Death": {
    title: translate("crops-and-chickens.achievement.white-death.title"),
    description: translate(
      "crops-and-chickens.achievement.white-death.description",
    ),
  },
};
