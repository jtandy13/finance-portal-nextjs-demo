import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { AssetAllocation } from "./asset-allocation";

describe("AssetAllocation", () => {
  it("shows an empty state when there are no allocations", () => {
    render(<AssetAllocation allocations={[]} />);
    expect(
      screen.getByText(/no allocation data yet/i),
    ).toBeInTheDocument();
  });

  it("renders allocation labels and rounded percentages", () => {
    render(
      <AssetAllocation
        allocations={[{ assetClass: "equities", percentage: "60.00" }]}
      />,
    );
    expect(screen.getByText("Equities")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("sorts allocations by percentage descending", () => {
    const { container } = render(
      <AssetAllocation
        allocations={[
          { assetClass: "cash", percentage: "5.00" },
          { assetClass: "equities", percentage: "60.00" },
          { assetClass: "bonds", percentage: "25.00" },
        ]}
      />,
    );

    const percentages = [...container.querySelectorAll("li")].map(
      (li) => li.querySelector(":scope > span")?.textContent,
    );

    expect(percentages).toEqual(["60%", "25%", "5%"]);
  });
});
