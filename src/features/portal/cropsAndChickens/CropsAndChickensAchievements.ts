import { translate } from "lib/i18n/translate";

export type CropsAndChickensAchievementName =
  | "Dcol"
  | "Don't Go Up"
  | "Grand Master"
  | "The Elite"
  | "Ultimate Straight"
  | "Wheat King"
  | "White Death";

export const AVAILABLE_ACHIEVEMENTS: Record<
  CropsAndChickensAchievementName,
  { title: string; description: string }
> = {
  Dcol: {
    title: translate("crops-and-chickens.achievement.dcol.title"),
    description: "Deposit a Kale and do not harvest any other crops in a game",
  },
  "Don't Go Up": {
    title: translate("crops-and-chickens.achievement.dont-go-up.title"),
    description: translate(
      "crops-and-chickens.achievement.dont-go-up.description",
    ),
  },
  "Grand Master": {
    title: translate("crops-and-chickens.achievement.grand-master.title"),
    description: translate(
      "crops-and-chickens.achievement.grand-master.description",
    ),
  },
  "The Elite": {
    title: translate("crops-and-chickens.achievement.the-elite.title"),
    description: translate(
      "crops-and-chickens.achievement.the-elite.description",
    ),
  },
  "Ultimate Straight": {
    title: translate("crops-and-chickens.achievement.ultimate-straight.title"),
    description: translate(
      "crops-and-chickens.achievement.ultimate-straight.description",
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
