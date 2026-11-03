/**
 * FLOWER gem-purchase discount.
 *
 * Players who pay for Gems with $FLOWER receive a discount on the USD price.
 * The discount drops from 30% to 20% on 1st August 2026.
 */
export const FLOWER_DISCOUNT_REDUCTION_DATE = new Date("2026-08-01T00:00:00Z");

const DAY_MS = 24 * 60 * 60 * 1000;

/** Discount fraction (e.g. 0.3 = 30% off) applied to the USD price. */
export function getFlowerGemDiscount(now: number = Date.now()): number {
  return now >= FLOWER_DISCOUNT_REDUCTION_DATE.getTime() ? 0.2 : 0.3;
}

/** Multiplier applied to the USD price after the FLOWER discount (e.g. 0.7). */
export function getFlowerGemPriceMultiplier(now: number = Date.now()): number {
  return 1 - getFlowerGemDiscount(now);
}

/** Whole days remaining until the discount drops to 20% (0 once it has). */
export function daysUntilFlowerDiscountReduction(
  now: number = Date.now(),
): number {
  const msLeft = FLOWER_DISCOUNT_REDUCTION_DATE.getTime() - now;
  if (msLeft <= 0) return 0;
  return Math.ceil(msLeft / DAY_MS);
}
