import { Minigame } from "features/game/types/game";
import {
  RESTOCK_ATTEMPTS_SFL,
  UNLIMITED_ATTEMPTS_SFL,
  DAILY_ATTEMPTS,
} from "../CropsAndChickensConstants";

export const getAttemptsLeft = (minigame: Minigame | undefined) => {
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

const getStartOfUTCDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0); // set time to midnight UTC
  return startOfDay.getTime();
};
