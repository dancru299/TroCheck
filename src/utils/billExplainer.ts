import { WATER_RATES } from "@/src/data/waterRates";
import type { ElectricCalculation } from "./calculateElectric";
import type { WaterCalculation } from "./calculateWater";
import { formatKwh, formatM3, formatVnd, trimDecimal } from "./format";

export type ExplainerLine = {
  id: string;
  label: string;
  detail: string;
  amount: number;
};

export function buildExplainerLines(
  electric: ElectricCalculation,
  water: WaterCalculation,
  extraChargesTotal: number
): ExplainerLine[] {
  return [
    {
      id: "electric",
      label: "Tiền điện chênh lệch",
      detail: buildElectricExplanation(electric),
      amount: electric.difference
    },
    {
      id: "water",
      label: "Tiền nước chênh lệch",
      detail: buildWaterExplanation(water),
      amount: water.difference
    },
    {
      id: "service",
      label: "Khoản phụ đã tách riêng",
      detail:
        extraChargesTotal > 0
          ? "Wifi, rác, gửi xe... không tính vào chênh lệch điện nước."
          : "Bạn chưa nhập khoản phụ riêng.",
      amount: extraChargesTotal
    }
  ];
}

export function buildElectricExplanation(electric: ElectricCalculation) {
  if (!electric.highestTier) {
    return "Nhập số điện để TroCheck tính theo biểu giá EVN 6 bậc.";
  }

  const tierIndex = electric.breakdown.length;
  const tierUsage = trimDecimal(electric.highestTier.usage);

  return `Bạn dùng ${formatKwh(electric.kwh)}, cao nhất tới bậc ${tierIndex}; ${tierUsage} kWh cuối tính ${formatVnd(
    electric.highestTier.unitPrice
  )}/kWh trước VAT.`;
}

export function buildWaterExplanation(water: WaterCalculation) {
  const rate = WATER_RATES[water.city];

  if (!water.referenceAvailable) {
    const modeText = water.mode === "per-person" ? "theo đầu người" : "khoán cố định";

    return `Chủ nhà tính nước ${modeText}; cần số m3 thực tế để đối chiếu bảng giá tham chiếu.`;
  }

  if (!water.highestTier) {
    return "Nhập số nước để TroCheck tính theo bảng giá nước địa phương.";
  }

  const quotaText = rate.quotaPerPerson ? ` cho ${water.residents} người` : "";

  return `${formatM3(water.m3)} tại ${rate.cityName}${quotaText}, áp theo ${
    water.highestTier.label
  }.`;
}
