import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { makeQuote } from "@/test/factories";
import { MarketMovers } from "./market-movers";

describe("MarketMovers", () => {
  it("shows an empty state when there are no movers", () => {
    render(<MarketMovers movers={[]} />);
    expect(screen.getByText(/no market data yet/i)).toBeInTheDocument();
  });

  it("renders the symbol, name, formatted price and initials", () => {
    render(
      <MarketMovers
        movers={[
          makeQuote({
            symbol: "AAPL",
            name: "Apple Inc.",
            price: "189.43",
            changePercent: "1.2000",
          }),
        ]}
      />,
    );

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByText("$189.43")).toBeInTheDocument();
    expect(screen.getByText("AA")).toBeInTheDocument();
  });

  it("renders positive changes in emerald and negative in destructive", () => {
    render(
      <MarketMovers
        movers={[
          makeQuote({ symbol: "AAPL", changePercent: "1.2000" }),
          makeQuote({ symbol: "MSFT", changePercent: "-0.4000" }),
        ]}
      />,
    );

    const positive = screen.getByText("+1.2%");
    const negative = screen.getByText("-0.4%");

    expect(positive).toHaveClass("text-emerald-600");
    expect(negative).toHaveClass("text-destructive");
  });

  it("formats large moves while keeping their direction colour", () => {
    render(
      <MarketMovers
        movers={[makeQuote({ symbol: "TSLA", changePercent: "2.1000" })]}
      />,
    );

    const largeMove = screen.getByText("+2.1%");
    expect(largeMove).toHaveClass("text-emerald-600");
  });
});
