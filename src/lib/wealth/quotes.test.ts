import { describe, it, expect } from "vitest";

import { dedupeLatestQuotesBySymbol } from "./quotes";

describe("dedupeLatestQuotesBySymbol", () => {
  it("keeps the first occurrence per symbol (latest by query order)", () => {
    const quotes = [
      { symbol: "AAPL", price: "190.00" },
      { symbol: "AAPL", price: "180.00" },
      { symbol: "MSFT", price: "378.11" },
    ];

    const result = dedupeLatestQuotesBySymbol(quotes);

    expect(result).toEqual([
      { symbol: "AAPL", price: "190.00" },
      { symbol: "MSFT", price: "378.11" },
    ]);
  });

  it("preserves symbol order of first appearance", () => {
    const quotes = [
      { symbol: "TSLA" },
      { symbol: "GOOGL" },
      { symbol: "TSLA" },
    ];

    expect(dedupeLatestQuotesBySymbol(quotes)).toEqual([
      { symbol: "TSLA" },
      { symbol: "GOOGL" },
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(dedupeLatestQuotesBySymbol([])).toEqual([]);
  });
});
