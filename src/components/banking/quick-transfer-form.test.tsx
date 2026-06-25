import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/banking/actions", () => ({
  createTransfer: vi.fn(),
}));

import { makeAccount } from "@/test/factories";
import { QuickTransferForm } from "./quick-transfer-form";

describe("QuickTransferForm", () => {
  it("prompts for more accounts when fewer than two are available", () => {
    render(<QuickTransferForm accounts={[makeAccount()]} />);
    expect(
      screen.getByText(/add at least two accounts to transfer funds/i),
    ).toBeInTheDocument();
  });

  it("renders the transfer form with a labelled source account option", () => {
    render(
      <QuickTransferForm
        accounts={[
          makeAccount({ id: "acc-1", name: "Checking", accountNumberLast4: "1234", balance: "1000.00" }),
          makeAccount({ id: "acc-2", name: "Savings", accountNumberLast4: "5678", balance: "500.00" }),
        ]}
      />,
    );

    expect(screen.getByLabelText("From Account")).toBeInTheDocument();
    expect(screen.getByLabelText("To Account")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send funds/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Checking (...1234) - $1,000.00" }),
    ).toBeInTheDocument();
  });
});
