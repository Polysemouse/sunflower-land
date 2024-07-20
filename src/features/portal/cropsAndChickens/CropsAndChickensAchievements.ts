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
  { title: string; description: string; icon: string }
> = {
  Dcol: {
    title: translate("crops-and-chickens.achievement.dcol.title"),
    description: translate("crops-and-chickens.achievement.dcol.description"),
    icon: "public/world/achievement_dcol.png",
  },
  "Elite Gamer": {
    title: translate("crops-and-chickens.achievement.elite-gamer.title"),
    description: translate(
      "crops-and-chickens.achievement.elite-gamer.description",
    ),
    icon: "public/world/achievement_elite_gamer.png",
  },
  Grandmaster: {
    title: translate("crops-and-chickens.achievement.grandmaster.title"),
    description: translate(
      "crops-and-chickens.achievement.grandmaster.description",
    ),
    icon: "public/world/achievement_grandmaster.png",
  },
  "Never Gonna Move You Up": {
    title: translate(
      "crops-and-chickens.achievement.never-gonna-move-you-up.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.never-gonna-move-you-up.description",
    ),
    icon: "public/world/achievement_never_gonna_move_you_up.png",
  },
  Relentless: {
    title: translate("crops-and-chickens.achievement.relentless.title"),
    description: translate(
      "crops-and-chickens.achievement.relentless.description",
    ),
    icon: "public/world/achievement_relentless.png",
  },
  "Rush to the Other Side": {
    title: translate(
      "crops-and-chickens.achievement.rush-to-the-other-side.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.rush-to-the-other-side.description",
    ),
    icon: "public/world/achievement_rush_to_the_other_side.png",
  },
  "Ultimate Chain": {
    title: translate("crops-and-chickens.achievement.ultimate-chain.title"),
    description: translate(
      "crops-and-chickens.achievement.ultimate-chain.description",
    ),
    icon: "public/world/achievement_ultimate_chain.png",
  },
  "Wheat King": {
    title: translate("crops-and-chickens.achievement.wheat-king.title"),
    description: translate(
      "crops-and-chickens.achievement.wheat-king.description",
    ),
    icon: "public/world/achievement_wheat_king.png",
  },
  "White Death": {
    title: translate("crops-and-chickens.achievement.white-death.title"),
    description: translate(
      "crops-and-chickens.achievement.white-death.description",
    ),
    icon: "public/world/achievement_white_death.png",
  },
};
