import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/banking/actions", () => ({
  createTransfer: vi.fn(),
}));

import { makeAccount } from "@/test/factories";
import { TransferFundsDialog } from "./transfer-funds-dialog";

describe("TransferFundsDialog", () => {
  it("opens a transfer modal when the button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <TransferFundsDialog
        accounts={[
          makeAccount({ id: "acc-1", name: "Checking", accountNumberLast4: "1234", balance: "1000.00" }),
          makeAccount({ id: "acc-2", name: "Savings", accountNumberLast4: "5678", balance: "500.00" }),
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Transfer Funds" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Move money between your accounts instantly.")).toBeInTheDocument();
    expect(screen.getByLabelText("From Account")).toBeInTheDocument();
    expect(screen.getByLabelText("To Account")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
  });
});
