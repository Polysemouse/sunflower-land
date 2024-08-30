import { Minigame } from "features/game/types/game";
import {
  RESTOCK_ATTEMPTS_SFL,
  UNLIMITED_ATTEMPTS_SFL,
  DAILY_ATTEMPTS,
  CROP_SPAWN_CONFIGURATIONS,
  CROP_TO_INDEX,
} from "../CropsAndChickensConstants";
import { CropName } from "features/game/types/crops";
import pumpkinHalloween from "public/crops-and-chickens/pumpkin_halloween.png";
import { ITEM_DETAILS } from "features/game/types/images";

type CropsAndChickensHolidayEvent =
  | "none"
  | "easter"
  | "halloween"
  | "christmas";

const getEasterDate = (year: number) => {
  const C = Math.floor(year / 100);
  const N = year - 19 * Math.floor(year / 19);
  const K = Math.floor((C - 17) / 25);
  let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
  I = I - 30 * Math.floor(I / 30);
  I =
    I -
    Math.floor(I / 28) *
      (1 -
        Math.floor(I / 28) *
          Math.floor(29 / (I + 1)) *
          Math.floor((21 - N) / 11));
  let J = year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4);
  J = J - 7 * Math.floor(J / 7);
  const L = I - J;
  const M = 3 + Math.floor((L + 40) / 44);
  const D = L + 28 - 31 * Math.floor(M / 4);

  return Date.UTC(year, M - 1, D);
};

/**
 * Gets the current holiday event.
 * @returns The current holiday event.
 */
export const getHolidayEvent = (): CropsAndChickensHolidayEvent => {
  const now = Date.now();
  const year = new Date().getUTCFullYear();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  const easterDate = getEasterDate(year);
  const easterStartDate = easterDate - 6 * ONE_DAY;
  const easterEndDate = easterDate + ONE_DAY;
  if (now >= easterStartDate && now < easterEndDate) return "easter";

  const halloweenDate = Date.UTC(year, 9, 31);
  const halloweenStartDate = halloweenDate - 6 * ONE_DAY;
  const halloweenEndDate = halloweenDate + ONE_DAY;
  if (now >= halloweenStartDate && now < halloweenEndDate) return "halloween";

  const christmasDate = Date.UTC(year, 11, 25);
  const christmasStartDate = christmasDate - 13 * ONE_DAY;
  const christmasEndDate = christmasDate + ONE_DAY;
  if (now >= christmasStartDate && now < christmasEndDate) return "christmas";

  return "none";
};

/**
 * Gets the total number of crops of a specific type that are available in the game.
 * @param cropName The crop name.
 * @returns The total number of crops of the specified type that are available.
 */
export const getTotalCropsInGame = (cropName: CropName) => {
  return CROP_SPAWN_CONFIGURATIONS.filter(
    (config) => config.cropIndex === CROP_TO_INDEX[cropName],
  ).length;
};

/**
 * Gets the number of attempts left for the minigame.
 * @param minigame The minigame.
 * @returns The number of attempts left.
 */
export const getAttemptsLeft = (minigame?: Minigame) => {
  const dateKey = new Date().toISOString().slice(0, 10);

  const history = minigame?.history ?? {};
  const purchases = minigame?.purchases ?? [];

  const now = new Date();
  const startOfTodayUTC = getStartOfUTCDay(now);
  const endOfTodayUTC = startOfTodayUTC + 24 * 60 * 60 * 1000; // 24 hours later
  const hasUnlimitedAttempts = purchases.some(
    (purchase) =>
      purchase.sfl === UNLIMITED_ATTEMPTS_SFL &&
      purchase.purchasedAt >= startOfTodayUTC &&
      purchase.purchasedAt < endOfTodayUTC,
  );

  if (hasUnlimitedAttempts) return Infinity;

  const restockedCount = purchases.filter(
    (purchase) =>
      purchase.sfl === RESTOCK_ATTEMPTS_SFL &&
      purchase.purchasedAt >= startOfTodayUTC &&
      purchase.purchasedAt < endOfTodayUTC,
  ).length;

  const attemptsToday = history[dateKey]?.attempts ?? 0;
  const attemptsLeft =
    DAILY_ATTEMPTS - attemptsToday + DAILY_ATTEMPTS * restockedCount;

  return attemptsLeft;
};

/**
 * Gets the start of the UTC day for a given date.
 * @param date The date.
 * @returns The start of the UTC day for the given date.
 */
const getStartOfUTCDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0); // set time to midnight UTC
  return startOfDay.getTime();
};

/**
 * Gets the image for a crop.
 * @param cropName The crop name.
 * @returns The image for the crop.
 */
export const getCropImage = (cropName: CropName) => {
  const holidayEvent = getHolidayEvent();
  if (holidayEvent === "halloween" && cropName === "Pumpkin") {
    return pumpkinHalloween;
  }

  return ITEM_DETAILS[cropName].image;
};
