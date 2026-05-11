import type { TierRate } from "@/src/data/electricRates";
import { clampNumber } from "./format";

export type TierCharge = {
  label: string;
  usage: number;
  unitPrice: number;
  amount: number;
};

export function calculateTieredBill(usage: number, tiers: TierRate[], quotaMultiplier = 1) {
  const normalizedUsage = clampNumber(usage);
  const normalizedMultiplier = Math.max(1, Math.floor(clampNumber(quotaMultiplier, 1, 20)));
  let remaining = normalizedUsage;
  const breakdown: TierCharge[] = [];

  for (const tier of tiers) {
    if (remaining <= 0) {
      break;
    }

    const tierLimit = Number.isFinite(tier.limitKwh)
      ? tier.limitKwh * normalizedMultiplier
      : Number.POSITIVE_INFINITY;
    const usageInTier = Math.min(remaining, tierLimit);

    if (usageInTier > 0) {
      breakdown.push({
        label: tier.label,
        usage: usageInTier,
        unitPrice: tier.unitPrice,
        amount: usageInTier * tier.unitPrice
      });
    }

    remaining -= usageInTier;
  }

  return {
    subtotal: breakdown.reduce((total, tier) => total + tier.amount, 0),
    breakdown,
    highestTier: breakdown.at(-1)
  };
}
