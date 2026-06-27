import { describe, expect, it } from "vitest";

import {
  computeDayChange,
  computeLiquidityDistribution,
  computeTotalAvailableBalance,
} from "./metrics";

describe("computeTotalAvailableBalance", () => {
  it("sums checking and savings balances only", () => {
    const total = computeTotalAvailableBalance([
      { type: "checking", balance: "45230.00" },
      { type: "savings", balance: "850000.00" },
      { type: "credit_card", balance: "12450.00", creditLimit: "50000.00" },
    ]);

    expect(total).toBe(895230);
  });
});

describe("computeLiquidityDistribution", () => {
  it("derives cash and credit use from credit limits when present", () => {
    const distribution = computeLiquidityDistribution([
      { type: "checking", balance: "45230.00" },
      { type: "savings", balance: "850000.00" },
      { type: "credit_card", balance: "12450.00", creditLimit: "49800.00" },
    ]);

    expect(distribution.creditUsePercent).toBeCloseTo(25, 0);
    expect(distribution.cashPercent).toBeCloseTo(75, 0);
  });
});

describe("computeDayChange", () => {
  it("returns null when fewer than two snapshots exist", () => {
    expect(computeDayChange([{ totalBalance: "100.00" }])).toBeNull();
  });

  it("computes amount and percent change between the last two snapshots", () => {
    const change = computeDayChange([
      { totalBalance: "1245358.40" },
      { totalBalance: "1245678.90" },
    ]);

    expect(change).toEqual({
      amount: 320.5,
      percent: expect.closeTo(0.0257, 3),
    });
  });
});
