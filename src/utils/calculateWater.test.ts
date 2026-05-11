import { describe, expect, it } from "vitest";
import { calculateWater } from "./calculateWater";

describe("calculateWater", () => {
  it("calculates Hanoi water with VAT", () => {
    const result = calculateWater({
      city: "hn",
      mode: "metered",
      m3: 15,
      residents: 2,
      ownerPerPersonPrice: 0,
      ownerTotal: 100000
    });

    expect(Math.round(result.standardSubtotal)).toBe(134500);
    expect(Math.round(result.standardTotal)).toBe(141225);
    expect(Math.round(result.difference)).toBe(-41225);
    expect(result.breakdown).toHaveLength(2);
  });

  it("multiplies HCM quota by residents", () => {
    const result = calculateWater({
      city: "hcm",
      mode: "metered",
      m3: 15,
      residents: 2,
      ownerPerPersonPrice: 0,
      ownerTotal: 220000
    });

    expect(Math.round(result.standardTotal)).toBe(203906);
    expect(result.breakdown.map((tier) => tier.usage)).toEqual([8, 4, 3]);
  });

  it("calculates owner water by per-person pricing without reference difference", () => {
    const result = calculateWater({
      city: "hcm",
      mode: "per-person",
      m3: 0,
      residents: 3,
      ownerPerPersonPrice: 80000,
      ownerTotal: 0
    });

    expect(result.ownerTotal).toBe(240000);
    expect(result.referenceAvailable).toBe(false);
    expect(result.difference).toBe(0);
  });
});
