export type TierRate = {
  label: string;
  limitKwh: number;
  unitPrice: number;
};

export const EVN_RESIDENTIAL_RATE = {
  sourceName: "EVN - Quyết định 1279/QĐ-BCT",
  sourceUrl:
    "https://www.evn.com.vn/d/vi-VN/news/Bieu-gia-ban-le-dien-theo-Quyet-dinh-so-1279QD-BCT-ngay-0952025-cua-Bo-Cong-Thuong-60-28-502668",
  effectiveFrom: "2025-05-10",
  updatedAt: "2026-05-11",
  vatRate: 0.1,
  tiers: [
    { label: "Bậc 1: 0-50 kWh", limitKwh: 50, unitPrice: 1984 },
    { label: "Bậc 2: 51-100 kWh", limitKwh: 50, unitPrice: 2050 },
    { label: "Bậc 3: 101-200 kWh", limitKwh: 100, unitPrice: 2380 },
    { label: "Bậc 4: 201-300 kWh", limitKwh: 100, unitPrice: 2998 },
    { label: "Bậc 5: 301-400 kWh", limitKwh: 100, unitPrice: 3350 },
    { label: "Bậc 6: >400 kWh", limitKwh: Number.POSITIVE_INFINITY, unitPrice: 3460 }
  ] satisfies TierRate[]
};
