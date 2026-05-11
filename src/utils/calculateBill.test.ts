import { describe, expect, it } from "vitest";
import { calculateBill } from "./calculateBill";

describe("calculateBill", () => {
  it("excludes service fee from overcharge difference", () => {
    const result = calculateBill({
      city: "hn",
      electricKwh: 150,
      electricMode: "fixed-price",
      ownerElectricUnitPrice: 4500,
      ownerElectricTotal: 0,
      waterMode: "metered",
      waterM3: 15,
      residents: 2,
      ownerWaterPerPersonPrice: 0,
      ownerWaterTotal: 100000,
      extraCharges: [{ id: "wifi", name: "wifi", amount: 100000 }]
    });

    expect(Math.round(result.ownerGrandTotal)).toBe(875000);
    expect(Math.round(result.ownerComparableTotal)).toBe(775000);
    expect(Math.round(result.difference)).toBe(281005);
    expect(result.verdict.level).toBe("high");
    expect(result.extraChargesTotal).toBe(100000);
  });

  it("does not count non-metered water as water overcharge", () => {
    const result = calculateBill({
      city: "hcm",
      electricKwh: 100,
      electricMode: "fixed-price",
      ownerElectricUnitPrice: 4000,
      ownerElectricTotal: 0,
      waterMode: "per-person",
      waterM3: 0,
      residents: 2,
      ownerWaterPerPersonPrice: 80000,
      ownerWaterTotal: 0,
      extraCharges: [{ id: "parking", name: "parking", amount: 150000 }]
    });

    expect(result.water.ownerTotal).toBe(160000);
    expect(result.water.difference).toBe(0);
    expect(result.ownerGrandTotal).toBe(result.ownerUtilityTotal + 150000);
    expect(result.difference).toBe(result.electric.difference);
  });
});
