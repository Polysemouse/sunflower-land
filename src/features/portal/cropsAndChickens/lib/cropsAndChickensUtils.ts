import { Minigame } from "features/game/types/game";
import {
  RESTOCK_ATTEMPTS_SFL,
  UNLIMITED_ATTEMPTS_SFL,
  DAILY_ATTEMPTS,
  CROP_SPAWN_CONFIGURATIONS,
  CROP_TO_INDEX,
  WEEKLY_MISSION_EXTRA_ATTEMPTS_GOAL,
  WEEKLY_MISSION_EXTRA_ATTEMPTS,
  CropsAndChickensCropName,
} from "../CropsAndChickensConstants";
import { getHolidayAsset } from "./CropsAndChickensHolidayAsset";

const isInIframe = window.self !== window.top;

export type CropsAndChickensHolidayEvent =
  | "none"
  | "april_fools"
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
  if (!isInIframe) {
    const customHolidayEvent = localStorage.getItem(
      "settings.holiday-event",
    ) as CropsAndChickensHolidayEvent;
    if (customHolidayEvent) return customHolidayEvent;
  }

  const now = Date.now();
  const year = new Date().getUTCFullYear();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  const aprilFoolsDate = Date.UTC(year, 3, 1);
  const aprilFoolsStartDate = aprilFoolsDate - 6 * ONE_DAY;
  const aprilFoolsEndDate = aprilFoolsDate + ONE_DAY;
  if (now >= aprilFoolsStartDate && now < aprilFoolsEndDate)
    return "april_fools";

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
export const getTotalCropsInGame = (cropName: CropsAndChickensCropName) => {
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

  const weeklyHighscore = getWeeklyHighscore(minigame);
  const bonusAttempts =
    weeklyHighscore >= WEEKLY_MISSION_EXTRA_ATTEMPTS_GOAL
      ? WEEKLY_MISSION_EXTRA_ATTEMPTS
      : 0;

  const attemptsToday = history[dateKey]?.attempts ?? 0;
  const attemptsLeft =
    DAILY_ATTEMPTS +
    bonusAttempts -
    attemptsToday +
    DAILY_ATTEMPTS * restockedCount;

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
 * Gets the start of the UTC week for a given date.  A week starts on Monday.
 * @param date The date.
 * @returns The start of the UTC week for the given date.
 */
const getStartOfUTCWeek = (date: Date) => {
  const startOfTodayUTC = getStartOfUTCDay(date);
  const dayOfWeek = date.getUTCDay();
  const startOfThisWeekUTC =
    startOfTodayUTC - ((dayOfWeek + 6) % 7) * 24 * 60 * 60 * 1000;

  return startOfThisWeekUTC;
};

export const getEndOfUTCWeek = (date: Date) => {
  const startOfThisWeekUTC = getStartOfUTCWeek(date);
  return startOfThisWeekUTC + 7 * 24 * 60 * 60 * 1000;
};

/**
 * Gets the image for a crop.
 * @param cropName The crop name.
 * @returns The image for the crop.
 */
export const getCropImage = (cropName: CropsAndChickensCropName) => {
  const holidayEvent = getHolidayEvent();
  return getHolidayAsset(cropName, holidayEvent);
};

/**
 * Gets the daily highscore for the minigame.
 * @param minigame The minigame.
 * @returns The daily highscore.
 */
export const getDailyHighscore = (minigame?: Minigame) => {
  const dateKey = new Date().toISOString().slice(0, 10);
  const history = minigame?.history ?? {};

  return history[dateKey]?.highscore ?? 0;
};

/**
 * Gets the weekly highscore for the minigame.
 * @param minigame The minigame.
 * @returns The weekly highscore.
 */
export const getWeeklyHighscore = (minigame?: Minigame) => {
  const startOfThisWeekUTC = getStartOfUTCWeek(new Date());

  const history = minigame?.history ?? {};

  const dateKeys = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfThisWeekUTC + i * 24 * 60 * 60 * 1000);
    return date.toISOString().slice(0, 10);
  });

  const highscores = dateKeys.map(
    (dateKey) => history[dateKey]?.highscore ?? 0,
  );
  return Math.max(...highscores);
};

/**
 * Gets the personal highscore for the minigame.
 * @param minigame The minigame.
 * @returns The personal highscore.
 */
export const getPersonalHighscore = (minigame?: Minigame) => {
  return Object.values(minigame?.history ?? {}).reduce(
    (acc, { highscore }) => Math.max(acc, highscore),
    0,
  );
};
