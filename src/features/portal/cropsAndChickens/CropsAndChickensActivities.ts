import { CropsAndChickensChickenName } from "./CropsAndChickensChickenName";
import { CropsAndChickensCropName } from "./CropsAndChickensConstants";

type HarvestedEvents = `${CropsAndChickensCropName} Harvested`;
type DepositedEvents = `${CropsAndChickensCropName} Deposited`;
type DroppedEvents = `${CropsAndChickensCropName} Dropped`;
type CollidedEvents = `${CropsAndChickensChickenName} Collided`;

export type CropsAndChickensActivityName =
  | "Classic Mode Played"
  | HarvestedEvents
  | DepositedEvents
  | DroppedEvents
  | CollidedEvents;
