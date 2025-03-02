import { translate } from "lib/i18n/translate";
import { getTotalCropsInGame } from "./lib/cropsAndChickensUtils";

export type CropsAndChickensPowerSkillName =
  | "Absolute Zero"
  | "Eggsplosion"
  | "Farmer's Ward"
  | "Frozen Hunter"
  | "Gravestone"
  | "Invincible"
  | "Instant Cooldown"
  | "Seed Bomb"
  | "Slow Mo Chickens";

//TODO: fix title, description, and icon
export const AVAILABLE_POWER_SKILLS: Record<
  CropsAndChickensPowerSkillName,
  { title: string; description: string; iconKey: string }
> = {
  "Absolute Zero": {
    title: translate(
      "crops-and-chickens.achievement.but-its-honest-work.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.but-its-honest-work.description",
      {
        amount: getTotalCropsInGame("Potato"),
      },
    ),
    iconKey: "crop_deposit_arrow",
  },
  Eggsplosion: {
    title: translate("crops-and-chickens.achievement.dcol.title"),
    description: translate("crops-and-chickens.achievement.dcol.description", {
      amount: getTotalCropsInGame("Kale"),
    }),
    iconKey: "crop_deposit_arrow",
  },
  "Farmer's Ward": {
    title: translate("crops-and-chickens.achievement.elite-gamer.title"),
    description: translate(
      "crops-and-chickens.achievement.elite-gamer.description",
    ),
    iconKey: "crop_deposit_arrow",
  },
  "Frozen Hunter": {
    title: translate("crops-and-chickens.achievement.grain-offering.title"),
    description: translate(
      "crops-and-chickens.achievement.grain-offering.description",
      {
        amount: getTotalCropsInGame("Wheat"),
      },
    ),
    iconKey: "crop_deposit_arrow",
  },
  Gravestone: {
    title: translate("crops-and-chickens.achievement.grandmaster.title"),
    description: translate(
      "crops-and-chickens.achievement.grandmaster.description",
    ),
    iconKey: "crop_deposit_arrow",
  },
  Invincible: {
    title: translate(
      "crops-and-chickens.achievement.never-gonna-move-you-up.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.never-gonna-move-you-up.description",
    ),
    iconKey: "crop_deposit_arrow",
  },
  "Instant Cooldown": {
    title: translate("crops-and-chickens.achievement.relentless.title"),
    description: translate(
      "crops-and-chickens.achievement.relentless.description",
    ),
    iconKey: "crop_deposit_arrow",
  },
  "Seed Bomb": {
    title: translate("crops-and-chickens.achievement.ring-of-fire.title"),
    description: translate(
      "crops-and-chickens.achievement.ring-of-fire.description",
      {
        amount: getTotalCropsInGame("Radish"),
      },
    ),
    iconKey: "crop_deposit_arrow",
  },
  "Slow Mo Chickens": {
    title: translate(
      "crops-and-chickens.achievement.rush-to-the-other-side.title",
    ),
    description: translate(
      "crops-and-chickens.achievement.rush-to-the-other-side.description",
    ),
    iconKey: "crop_deposit_arrow",
  },
};
