import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const usePathnameMock = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

import { BankingViewTabs } from "./banking-view-tabs";

describe("BankingViewTabs", () => {
  it("marks the everyday banking tab as current on that route", () => {
    usePathnameMock.mockReturnValue("/everyday-banking");
    render(<BankingViewTabs />);

    const everyday = screen.getByRole("link", { name: "Everyday Banking" });
    const wealth = screen.getByRole("link", { name: "Wealth Management" });

    expect(everyday).toHaveAttribute("aria-current", "page");
    expect(wealth).not.toHaveAttribute("aria-current");
  });

  it("marks the wealth management tab as current on that route", () => {
    usePathnameMock.mockReturnValue("/wealth-management");
    render(<BankingViewTabs />);

    const wealth = screen.getByRole("link", { name: "Wealth Management" });
    expect(wealth).toHaveAttribute("aria-current", "page");
  });
});
