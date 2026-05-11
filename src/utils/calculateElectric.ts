import { EVN_RESIDENTIAL_RATE } from "@/src/data/electricRates";
import { clampNumber } from "./format";
import { calculateTieredBill, type TierCharge } from "./tieredBill";

export type ElectricChargeMode = "fixed-price" | "tiered" | "total-bill";

export type ElectricInput = {
  kwh: number;
  ownerMode: ElectricChargeMode;
  ownerUnitPrice: number;
  ownerTotal: number;
};

export type ElectricCalculation = {
  kwh: number;
  standardSubtotal: number;
  vat: number;
  standardTotal: number;
  ownerTotal: number;
  difference: number;
  percentOver: number;
  breakdown: TierCharge[];
  highestTier?: TierCharge;
};

export function calculateElectric(input: ElectricInput): ElectricCalculation {
  const kwh = clampNumber(input.kwh);
  const standard = calculateTieredBill(kwh, EVN_RESIDENTIAL_RATE.tiers);
  const vat = standard.subtotal * EVN_RESIDENTIAL_RATE.vatRate;
  const standardTotal = standard.subtotal + vat;
  const ownerTotal = getOwnerElectricTotal(
    input.ownerMode,
    kwh,
    input.ownerUnitPrice,
    input.ownerTotal,
    standardTotal
  );
  const difference = ownerTotal - standardTotal;
  const percentOver = standardTotal > 0 ? (difference / standardTotal) * 100 : 0;

  return {
    kwh,
    standardSubtotal: standard.subtotal,
    vat,
    standardTotal,
    ownerTotal,
    difference,
    percentOver,
    breakdown: standard.breakdown,
    highestTier: standard.highestTier
  };
}

function getOwnerElectricTotal(
  mode: ElectricChargeMode,
  kwh: number,
  ownerUnitPrice: number,
  ownerTotal: number,
  standardTotal: number
) {
  if (mode === "fixed-price") {
    return kwh * clampNumber(ownerUnitPrice);
  }

  if (mode === "tiered") {
    return standardTotal;
  }

  return clampNumber(ownerTotal);
}
