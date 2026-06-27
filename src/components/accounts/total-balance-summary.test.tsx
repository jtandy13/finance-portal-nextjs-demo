import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TotalBalanceSummary } from "./total-balance-summary";

describe("TotalBalanceSummary", () => {
  it("formats total balance and positive day change", () => {
    render(
      <TotalBalanceSummary
        totalBalance={895230}
        dayChange={{ amount: 4320.5, percent: 0.35 }}
      />,
    );

    expect(screen.getByText("$895,230.00")).toBeInTheDocument();
    expect(screen.getByText(/\+\$4,320\.50/)).toBeInTheDocument();
    expect(screen.getByText(/\+0\.[34]%/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Transfer Funds" })).toHaveAttribute(
      "href",
      "/everyday-banking",
    );
  });
});
