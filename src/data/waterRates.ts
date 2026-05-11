import type { TierRate } from "./electricRates";

export type CityCode = "hcm" | "hn";

export type WaterRateConfig = {
  city: CityCode;
  cityName: string;
  sourceName: string;
  sourceUrl: string;
  effectiveFrom: string;
  updatedAt: string;
  note: string;
  tiers: TierRate[];
  quotaPerPerson: boolean;
};

export const WATER_RATES: Record<CityCode, WaterRateConfig> = {
  hcm: {
    city: "hcm",
    cityName: "TP.HCM",
    sourceName: "Thông báo giá nước TP.HCM 2026",
    sourceUrl:
      "https://thuvienphapluat.vn/phap-luat/bang-gia-nuoc-sinh-hoat-o-tphcm-2026-moi-nhat-chi-tiet-bang-gia-nuoc-sinh-hoat-o-tphcm-cap-nhat-nam-252032-266396.html",
    effectiveFrom: "2026-01-01",
    updatedAt: "2026-05-11",
    note:
      "Đã gồm nước sạch, VAT 5%, dịch vụ thoát nước 30% và VAT thoát nước 8% theo bảng công bố 2026.",
    quotaPerPerson: true,
    tiers: [
      { label: "Đến 4 m3/người/tháng", limitKwh: 4, unitPrice: 9206 },
      { label: "Từ 4-6 m3/người/tháng", limitKwh: 2, unitPrice: 17725 },
      { label: "Trên 6 m3/người/tháng", limitKwh: Number.POSITIVE_INFINITY, unitPrice: 19786 }
    ]
  },
  hn: {
    city: "hn",
    cityName: "Hà Nội",
    sourceName: "HAWACOM - Bảng giá nước sạch 2026",
    sourceUrl: "https://hawacom.vn/thong-tin-gia-nuoc",
    effectiveFrom: "2026-01-01",
    updatedAt: "2026-05-11",
    note: "Giá HAWACOM chưa gồm VAT; TroCheck cộng VAT 5% khi ước tính hóa đơn.",
    quotaPerPerson: false,
    tiers: [
      { label: "0-10 m3", limitKwh: 10, unitPrice: 8500 },
      { label: "10-20 m3", limitKwh: 10, unitPrice: 9900 },
      { label: "20-30 m3", limitKwh: 10, unitPrice: 16000 },
      { label: ">30 m3", limitKwh: Number.POSITIVE_INFINITY, unitPrice: 27000 }
    ]
  }
};
