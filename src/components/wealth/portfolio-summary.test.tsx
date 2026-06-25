import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { PortfolioSummary } from "./portfolio-summary";

describe("PortfolioSummary", () => {
  it("renders the total value and a positive day change badge", () => {
    const { container } = render(
      <PortfolioSummary
        totalValue="842500.00"
        dayChangeAmount="3210.45"
        dayChangePercent="0.3800"
      />,
    );

    expect(screen.getByText("$842,500.00")).toBeInTheDocument();
    expect(screen.getByText(/\+\$3,210\.45/)).toBeInTheDocument();
    expect(screen.getByText(/\+0\.38%/)).toBeInTheDocument();
    expect(container.querySelector(".text-emerald-700")).not.toBeNull();
  });

  it("renders a negative day change badge in destructive colour", () => {
    const { container } = render(
      <PortfolioSummary
        totalValue="500000.00"
        dayChangeAmount="-1000.00"
        dayChangePercent="-0.5000"
      />,
    );

    expect(screen.getByText(/-\$1,000\.00/)).toBeInTheDocument();
    expect(screen.getByText(/-0\.50%/)).toBeInTheDocument();
    expect(container.querySelector(".text-destructive")).not.toBeNull();
  });
});
