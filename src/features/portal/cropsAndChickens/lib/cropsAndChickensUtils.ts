import { Minigame } from "features/game/types/game";
import {
  RESTOCK_ATTEMPTS_SFL,
  UNLIMITED_ATTEMPTS_SFL,
  WEEKLY_ATTEMPTS,
} from "../CropsAndChickensConstants";

export const getAttemptsLeft = (minigame: Minigame | undefined) => {
  const dateKey = new Date().toISOString().slice(0, 10);

  const history = minigame?.history ?? {};
  const purchases = minigame?.purchases ?? [];

  const now = new Date();
  const startOfThisWeekUTC = getStartOfUTCWeek(now);
  const endOfThisWeekUTC = startOfThisWeekUTC + 7 * 24 * 60 * 60 * 1000; // 7 days later
  const hasUnlimitedAttempts = purchases.some(
    (purchase) =>
      purchase.sfl === UNLIMITED_ATTEMPTS_SFL &&
      purchase.purchasedAt >= startOfThisWeekUTC &&
      purchase.purchasedAt < endOfThisWeekUTC,
  );

  if (hasUnlimitedAttempts) return Infinity;

  // get current UTC date (midnight UTC of today)
  const startOfTodayUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0,
    0,
    0,
    0,
  );
  const endOfTodayUTC = startOfTodayUTC + 24 * 60 * 60 * 1000; // 24 hours later

  const restockedCount = purchases.filter(
    (purchase) =>
      purchase.sfl === RESTOCK_ATTEMPTS_SFL &&
      purchase.purchasedAt >= startOfTodayUTC &&
      purchase.purchasedAt < endOfTodayUTC,
  ).length;

  const attemptsToday = history[dateKey]?.attempts ?? 0;
  const attemptsLeft =
    WEEKLY_ATTEMPTS - attemptsToday + WEEKLY_ATTEMPTS * restockedCount;

  return attemptsLeft;
};

const getStartOfUTCWeek = (date: Date) => {
  const dayOfWeek = date.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(date);
  startOfWeek.setUTCDate(startOfWeek.getUTCDate() - dayOfWeek); // go to the start of the week
  startOfWeek.setUTCHours(0, 0, 0, 0); // set time to midnight UTC
  return startOfWeek.getTime();
};
