import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { makeTransaction } from "@/test/factories";
import { RecentTransactions } from "./recent-transactions";

describe("RecentTransactions", () => {
  it("shows an empty state when there are no transactions", () => {
    render(<RecentTransactions transactions={[]} />);
    expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
  });

  it("renders transaction details with formatted amounts", () => {
    render(
      <RecentTransactions
        transactions={[
          makeTransaction({
            description: "Amazon",
            amount: "-89.99",
            category: { name: "Shopping" },
          }),
        ]}
      />,
    );

    expect(screen.getByText("Amazon")).toBeInTheDocument();
    expect(screen.getByText("Shopping")).toBeInTheDocument();
    expect(screen.getByText("-$89.99")).toBeInTheDocument();
  });

  it("renders positive amounts in emerald", () => {
    render(
      <RecentTransactions
        transactions={[
          makeTransaction({
            description: "Salary Deposit",
            amount: "4500.00",
            category: { name: "Income" },
          }),
        ]}
      />,
    );

    const amount = screen.getByText("+$4,500.00");
    expect(amount).toHaveClass("text-emerald-600");
  });
});
