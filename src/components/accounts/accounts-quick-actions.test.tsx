import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AccountsQuickActions } from "./accounts-quick-actions";

describe("AccountsQuickActions", () => {
  it("renders quick action tiles in a two-column grid", () => {
    render(<AccountsQuickActions />);

    expect(screen.getByRole("heading", { name: "Quick Actions" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Statements" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Open Account" })).toBeDisabled();
    expect(screen.getByText("receipt_long")).toBeInTheDocument();
    expect(screen.getByText("add_card")).toBeInTheDocument();
  });
});
