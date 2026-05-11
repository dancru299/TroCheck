import { WATER_RATES, type CityCode } from "@/src/data/waterRates";
import { clampNumber } from "./format";
import { calculateTieredBill, type TierCharge } from "./tieredBill";

export type WaterChargeMode = "metered" | "per-person" | "flat";

export type WaterInput = {
  city: CityCode;
  mode: WaterChargeMode;
  m3: number;
  residents: number;
  ownerPerPersonPrice: number;
  ownerTotal: number;
};

export type WaterCalculation = {
  city: CityCode;
  m3: number;
  residents: number;
  mode: WaterChargeMode;
  referenceAvailable: boolean;
  standardSubtotal: number;
  standardTotal: number;
  ownerTotal: number;
  difference: number;
  breakdown: TierCharge[];
  highestTier?: TierCharge;
};

const HANOI_WATER_VAT_RATE = 0.05;

export function calculateWater(input: WaterInput): WaterCalculation {
  const rate = WATER_RATES[input.city];
  const m3 = clampNumber(input.m3);
  const residents = Math.max(1, Math.floor(clampNumber(input.residents, 1, 20)));
  const ownerTotal =
    input.mode === "per-person"
      ? residents * clampNumber(input.ownerPerPersonPrice)
      : clampNumber(input.ownerTotal);

  if (input.mode !== "metered") {
    return {
      city: input.city,
      m3: 0,
      residents,
      mode: input.mode,
      referenceAvailable: false,
      standardSubtotal: 0,
      standardTotal: 0,
      ownerTotal,
      difference: 0,
      breakdown: []
    };
  }

  const bill = calculateTieredBill(m3, rate.tiers, rate.quotaPerPerson ? residents : 1);
  const standardTotal =
    input.city === "hn" ? bill.subtotal * (1 + HANOI_WATER_VAT_RATE) : bill.subtotal;

  return {
    city: input.city,
    m3,
    residents,
    mode: input.mode,
    referenceAvailable: true,
    standardSubtotal: bill.subtotal,
    standardTotal,
    ownerTotal,
    difference: ownerTotal - standardTotal,
    breakdown: bill.breakdown,
    highestTier: bill.highestTier
  };
}
