import { translate } from "lib/i18n/translate";
import { SUNNYSIDE } from "assets/sunnyside";

export type CropsAndChickensBoostName =
  | "Quick Recovery"
  | "Extended Session"
  | "Reward Boost"
  | "Extra Attempts";

export type CropsAndChickensAbilityName =
  | "Absolute Zero"
  | "Eggsplosion"
  | "Farmer's Ward"
  | "Frozen Hunter"
  | "Gravestone"
  | "Invincible"
  | "Instant Recharge"
  | "Seed Bomb"
  | "Slow Mo Chickens";

export type CropsAndChickensSkillName =
  | CropsAndChickensBoostName
  | CropsAndChickensAbilityName;

//TODO: fix title, description, and icon
export const AVAILABLE_BOOSTS: Record<
  CropsAndChickensBoostName,
  {
    title: string;
    description: string;
    iconKey: string;
    icon: string;
    effectUpgradePoints: number | undefined;
  }
> = {
  "Quick Recovery": {
    title: translate("crops-and-chickens.boost.quick-recovery.title"),
    description: translate(
      "crops-and-chickens.boost.quick-recovery.description",
    ),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
  },
  "Extended Session": {
    title: translate("crops-and-chickens.boost.extended-session.title"),
    description: translate(
      "crops-and-chickens.boost.extended-session.description",
    ),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
  },
  "Reward Boost": {
    title: translate("crops-and-chickens.boost.reward-boost.title"),
    description: translate("crops-and-chickens.boost.reward-boost.description"),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
  },
  "Extra Attempts": {
    title: translate("crops-and-chickens.boost.extra-attempts.title"),
    description: translate(
      "crops-and-chickens.boost.extra-attempts.description",
    ),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
  },
};

//TODO: fix title, description, and icon
export const AVAILABLE_ABILITIES: Record<
  CropsAndChickensAbilityName,
  {
    title: string;
    description: string;
    iconKey: string;
    icon: string;
    effectUpgradePoints: number | undefined;
    durationUpgradePoints: number | undefined;
    cooldownUpgradePoints: number | undefined;
  }
> = {
  "Absolute Zero": {
    title: translate("crops-and-chickens.ability.absolute-zero.title"),
    description: translate(
      "crops-and-chickens.ability.absolute-zero.description",
    ),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
    durationUpgradePoints: 1,
    cooldownUpgradePoints: 1,
  },
  Eggsplosion: {
    title: translate("crops-and-chickens.ability.eggsplosion.title"),
    description: translate(
      "crops-and-chickens.ability.eggsplosion.description",
    ),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
    durationUpgradePoints: 1,
    cooldownUpgradePoints: 1,
  },
  "Farmer's Ward": {
    title: translate("crops-and-chickens.ability.farmers-ward.title"),
    description: translate(
      "crops-and-chickens.ability.farmers-ward.description",
    ),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
    durationUpgradePoints: 1,
    cooldownUpgradePoints: 1,
  },
  "Frozen Hunter": {
    title: translate("crops-and-chickens.ability.frozen-hunter.title"),
    description: translate(
      "crops-and-chickens.ability.frozen-hunter.description",
    ),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
    durationUpgradePoints: 1,
    cooldownUpgradePoints: 1,
  },
  Gravestone: {
    title: translate("crops-and-chickens.ability.gravestone.title"),
    description: translate("crops-and-chickens.ability.gravestone.description"),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
    durationUpgradePoints: 1,
    cooldownUpgradePoints: 1,
  },
  Invincible: {
    title: translate("crops-and-chickens.ability.invincible.title"),
    description: translate("crops-and-chickens.ability.invincible.description"),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
    durationUpgradePoints: 1,
    cooldownUpgradePoints: 1,
  },
  "Instant Recharge": {
    title: translate("crops-and-chickens.ability.instant-recharge.title"),
    description: translate(
      "crops-and-chickens.ability.instant-recharge.description",
    ),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
    durationUpgradePoints: 1,
    cooldownUpgradePoints: 1,
  },
  "Seed Bomb": {
    title: translate("crops-and-chickens.ability.seed-bomb.title"),
    description: translate("crops-and-chickens.ability.seed-bomb.description"),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
    durationUpgradePoints: 1,
    cooldownUpgradePoints: 1,
  },
  "Slow Mo Chickens": {
    title: translate("crops-and-chickens.ability.slow-mo-chickens.title"),
    description: translate(
      "crops-and-chickens.ability.slow-mo-chickens.description",
    ),
    iconKey: "crop_deposit_arrow",
    icon: SUNNYSIDE.icons.expression_confused,
    effectUpgradePoints: 1,
    durationUpgradePoints: 1,
    cooldownUpgradePoints: 1,
  },
};

export const AVAILABLE_SKILLS = {
  ...AVAILABLE_BOOSTS,
  ...AVAILABLE_ABILITIES,
};
