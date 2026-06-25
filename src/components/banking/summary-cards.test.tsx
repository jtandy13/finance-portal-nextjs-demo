import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { SummaryCards } from "./summary-cards";

describe("SummaryCards", () => {
  it("formats balances and monthly spend as currency", () => {
    render(
      <SummaryCards
        checkingBalance="12450.80"
        savingsBalance="45210.00"
        monthlySpend={102.5}
        monthlySpendTrend={null}
      />,
    );

    expect(screen.getByText("$12,450.80")).toBeInTheDocument();
    expect(screen.getByText("$45,210.00")).toBeInTheDocument();
    expect(screen.getByText("$102.50")).toBeInTheDocument();
  });

  it("falls back to $0.00 when balances are missing", () => {
    render(
      <SummaryCards
        checkingBalance={null}
        savingsBalance={null}
        monthlySpend={0}
        monthlySpendTrend={null}
      />,
    );

    expect(screen.getAllByText("$0.00").length).toBeGreaterThanOrEqual(2);
  });

  it("hides the trend badge when trend is null", () => {
    const { container } = render(
      <SummaryCards
        checkingBalance="100.00"
        savingsBalance="100.00"
        monthlySpend={50}
        monthlySpendTrend={null}
      />,
    );

    expect(container.querySelector('[data-slot="badge"]')).toBeNull();
  });

  it("shows a positive trend badge in emerald", () => {
    render(
      <SummaryCards
        checkingBalance="100.00"
        savingsBalance="100.00"
        monthlySpend={50}
        monthlySpendTrend={12.3}
      />,
    );

    const badge = screen.getByText(/\+12\.3%/);
    expect(badge).toHaveClass("text-emerald-700");
  });

  it("shows a negative trend badge in destructive colour", () => {
    render(
      <SummaryCards
        checkingBalance="100.00"
        savingsBalance="100.00"
        monthlySpend={50}
        monthlySpendTrend={-8.4}
      />,
    );

    const badge = screen.getByText(/-8\.4%/);
    expect(badge).toHaveClass("text-destructive");
  });
});
