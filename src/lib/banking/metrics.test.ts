import { describe, it, expect } from "vitest";

import {
  computeMonthlySpendTrend,
  monthRange,
  sumNegativeSpend,
} from "./metrics";

describe("monthRange", () => {
  it("returns ISO start and end boundaries for a month", () => {
    const { start, end } = monthRange(2024, 9);
    expect(start).toBe("2024-10-01");
    expect(end).toBe("2024-11-01");
  });

  it("rolls over to the next year for December", () => {
    const { start, end } = monthRange(2024, 11);
    expect(start).toBe("2024-12-01");
    expect(end).toBe("2025-01-01");
  });

  it("handles a negative month index as the previous year", () => {
    const { start, end } = monthRange(2024, -1);
    expect(start).toBe("2023-12-01");
    expect(end).toBe("2024-01-01");
  });
});

describe("sumNegativeSpend", () => {
  it("sums the absolute value of negative amounts only", () => {
    const rows = [
      { amount: "-12.50" },
      { amount: "100.00" },
      { amount: "-7.50" },
    ];
    expect(sumNegativeSpend(rows)).toBe(20);
  });

  it("returns 0 when there are no negative amounts", () => {
    expect(sumNegativeSpend([{ amount: "100.00" }])).toBe(0);
  });

  it("returns 0 for an empty list", () => {
    expect(sumNegativeSpend([])).toBe(0);
  });
});

describe("computeMonthlySpendTrend", () => {
  it("computes the percentage change relative to the previous spend", () => {
    expect(computeMonthlySpendTrend(150, 100)).toBe(50);
    expect(computeMonthlySpendTrend(50, 100)).toBe(-50);
  });

  it("returns null when previous spend is zero", () => {
    expect(computeMonthlySpendTrend(150, 0)).toBeNull();
  });

  it("returns null when previous spend is negative", () => {
    expect(computeMonthlySpendTrend(150, -10)).toBeNull();
  });
});
