import { CropsAndChickensChickenName } from "./CropsAndChickensChickenName";
import { CropsAndChickensCropName } from "./CropsAndChickensConstants";
import {
  CropsAndChickensBoostName,
  CropsAndChickensAbilityName,
} from "./CropsAndChickensUpgrades";

type HarvestedEvents = `${CropsAndChickensCropName} Harvested`;
type DepositedEvents = `${CropsAndChickensCropName} Deposited`;
type DroppedEvents = `${CropsAndChickensCropName} Dropped`;
type CollidedEvents = `${CropsAndChickensChickenName} Collided`;
type killedEvents = `${CropsAndChickensChickenName} Killed`;
type PassiveSkillEffectUpgradedEvents =
  `${CropsAndChickensBoostName} Effect Upgraded`;
type PowerSkillUnlockedEvents = `${CropsAndChickensAbilityName} Unlocked`;
type PowerSkillEffectUpgradedEvents =
  `${CropsAndChickensAbilityName} Effect Upgraded`;
type PowerSkillDurationUpgradedEvents =
  `${CropsAndChickensAbilityName} Duration Upgraded`;
type PowerSkillCooldownUpgradedEvents =
  `${CropsAndChickensAbilityName} Cooldown Upgraded`;

export type CropsAndChickensActivityName =
  | "Classic Mode Played"
  | "Golden Seed Earned"
  | "Golden Seed Spent"
  | HarvestedEvents
  | DepositedEvents
  | DroppedEvents
  | CollidedEvents
  | killedEvents
  | PassiveSkillEffectUpgradedEvents
  | PowerSkillUnlockedEvents
  | PowerSkillEffectUpgradedEvents
  | PowerSkillDurationUpgradedEvents
  | PowerSkillCooldownUpgradedEvents;
