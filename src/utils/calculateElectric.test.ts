import { describe, expect, it } from "vitest";
import { calculateElectric } from "./calculateElectric";

describe("calculateElectric", () => {
  it("calculates EVN 6-tier residential electricity with VAT", () => {
    const result = calculateElectric({
      kwh: 150,
      ownerMode: "fixed-price",
      ownerUnitPrice: 4500,
      ownerTotal: 0
    });

    expect(Math.round(result.standardSubtotal)).toBe(320700);
    expect(Math.round(result.vat)).toBe(32070);
    expect(Math.round(result.standardTotal)).toBe(352770);
    expect(Math.round(result.ownerTotal)).toBe(675000);
    expect(Math.round(result.difference)).toBe(322230);
    expect(result.breakdown).toHaveLength(3);
  });

  it("uses owner total bill mode when selected", () => {
    const result = calculateElectric({
      kwh: 80,
      ownerMode: "total-bill",
      ownerUnitPrice: 9999,
      ownerTotal: 300000
    });

    expect(result.ownerTotal).toBe(300000);
  });

  it("uses EVN tiered total when landlord charges by residential tiers", () => {
    const result = calculateElectric({
      kwh: 150,
      ownerMode: "tiered",
      ownerUnitPrice: 4500,
      ownerTotal: 0
    });

    expect(Math.round(result.ownerTotal)).toBe(Math.round(result.standardTotal));
    expect(Math.round(result.difference)).toBe(0);
  });
});
