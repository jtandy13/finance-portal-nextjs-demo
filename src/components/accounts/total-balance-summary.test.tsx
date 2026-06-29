import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/banking/actions", () => ({
  createTransfer: vi.fn(),
}));

import { makeAccount } from "@/test/factories";
import { TotalBalanceSummary } from "./total-balance-summary";

describe("TotalBalanceSummary", () => {
  it("formats total balance and positive day change", () => {
    render(
      <TotalBalanceSummary
        totalBalance={895230}
        dayChange={{ amount: 4320.5, percent: 0.35 }}
        accounts={[
          makeAccount({ id: "acc-1", balance: "1000.00" }),
          makeAccount({ id: "acc-2", balance: "500.00" }),
        ]}
      />,
    );

    expect(screen.getByText("$895,230.00")).toBeInTheDocument();
    expect(screen.getByText(/\+\$4,320\.50/)).toBeInTheDocument();
    expect(screen.getByText(/\+0\.[34]%/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Transfer Funds" }),
    ).toBeInTheDocument();
  });
});
