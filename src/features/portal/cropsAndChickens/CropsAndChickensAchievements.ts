import { translate } from "lib/i18n/translate";

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
  { title: string; description: string }
> = {
  Dcol: {
    title: translate("crops-and-chickens.achievement.dcol.title"),
    description: translate("crops-and-chickens.achievement.dcol.description"),
  },
  "Elite Gamer": {
    title: translate("crops-and-chickens.achievement.elite-gamer.title"),
    description: translate(
      "crops-and-chickens.achievement.elite-gamer.description",
    ),
  },
  Grandmaster: {
    title: translate("crops-and-chickens.achievement.grandmaster.title"),
    description: translate(
      "crops-and-chickens.achievement.grandmaster.description",
    ),
  },
  "Never Gonna Move You Up": {
    title: translate(
      "crops-and-chickens.achievement.never-gonna-move-you-up.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.never-gonna-move-you-up.description",
    ),
  },
  Relentless: {
    title: translate("crops-and-chickens.achievement.relentless.title"),
    description: translate(
      "crops-and-chickens.achievement.relentless.description",
    ),
  },
  "Rush to the Other Side": {
    title: translate(
      "crops-and-chickens.achievement.rush-to-the-other-side.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.rush-to-the-other-side.description",
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
