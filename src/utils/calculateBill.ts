import type { CityCode } from "@/src/data/waterRates";
import { calculateElectric, type ElectricChargeMode, type ElectricCalculation } from "./calculateElectric";
import { calculateWater, type WaterCalculation, type WaterChargeMode } from "./calculateWater";
import { clampNumber } from "./format";
import { getVerdict, type Verdict } from "./verdict";

export type ExtraChargeName = "wifi" | "trash" | "parking" | "cleaning" | "elevator" | "other";

export type ExtraCharge = {
  id: string;
  name: ExtraChargeName;
  amount: number;
};

export const EXTRA_CHARGE_LABELS: Record<ExtraChargeName, string> = {
  wifi: "Wifi",
  trash: "Rác",
  parking: "Gửi xe",
  cleaning: "Vệ sinh",
  elevator: "Thang máy",
  other: "Khác"
};

export type BillInput = {
  city: CityCode;
  electricKwh: number;
  electricMode: ElectricChargeMode;
  ownerElectricUnitPrice: number;
  ownerElectricTotal: number;
  waterMode: WaterChargeMode;
  waterM3: number;
  residents: number;
  ownerWaterPerPersonPrice: number;
  ownerWaterTotal: number;
  extraCharges: ExtraCharge[];
};

export type BillCalculation = {
  electric: ElectricCalculation;
  water: WaterCalculation;
  standardTotal: number;
  ownerUtilityTotal: number;
  ownerComparableTotal: number;
  ownerGrandTotal: number;
  extraChargesTotal: number;
  difference: number;
  percentOver: number;
  verdict: Verdict;
};

export function calculateBill(input: BillInput): BillCalculation {
  const electric = calculateElectric({
    kwh: input.electricKwh,
    ownerMode: input.electricMode,
    ownerUnitPrice: input.ownerElectricUnitPrice,
    ownerTotal: input.ownerElectricTotal
  });
  const water = calculateWater({
    city: input.city,
    mode: input.waterMode,
    m3: input.waterM3,
    residents: input.residents,
    ownerPerPersonPrice: input.ownerWaterPerPersonPrice,
    ownerTotal: input.ownerWaterTotal
  });
  const extraChargesTotal = input.extraCharges.reduce(
    (total, charge) => total + clampNumber(charge.amount),
    0
  );
  const standardTotal = electric.standardTotal + water.standardTotal;
  const ownerUtilityTotal = electric.ownerTotal + water.ownerTotal;
  const ownerComparableTotal = electric.ownerTotal + (water.referenceAvailable ? water.ownerTotal : 0);
  const ownerGrandTotal = ownerUtilityTotal + extraChargesTotal;
  const difference = electric.difference + water.difference;
  const percentOver = standardTotal > 0 ? (difference / standardTotal) * 100 : 0;

  return {
    electric,
    water,
    standardTotal,
    ownerUtilityTotal,
    ownerComparableTotal,
    ownerGrandTotal,
    extraChargesTotal,
    difference,
    percentOver,
    verdict: getVerdict(difference, standardTotal)
  };
}
