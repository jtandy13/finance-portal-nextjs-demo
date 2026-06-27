import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AccountListSection } from "./account-list-section";
import { makeAccount } from "@/test/factories";

describe("AccountListSection", () => {
  it("renders deposit accounts with masked numbers and transfer action", () => {
    render(
      <AccountListSection
        title="Deposit Accounts"
        variant="deposit"
        accounts={[
          makeAccount({
            name: "Premium Checking",
            accountNumberLast4: "8492",
            balance: "45230.00",
          }),
        ]}
      />,
    );

    expect(screen.getByText("Premium Checking")).toBeInTheDocument();
    expect(screen.getByText("**** 8492")).toBeInTheDocument();
    expect(screen.getByText("$45,230.00")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Transfer" })).toHaveAttribute(
      "href",
      "/everyday-banking",
    );
  });

  it("renders credit cards with pay bill action", () => {
    render(
      <AccountListSection
        title="Credit Cards"
        variant="credit"
        accounts={[
          makeAccount({
            type: "credit_card",
            name: "Corporate Platinum Card",
            accountNumberLast4: "4431",
            balance: "12450.00",
          }),
        ]}
      />,
    );

    expect(screen.getByText("Corporate Platinum Card")).toBeInTheDocument();
    expect(screen.getByText("Current Balance")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pay Bill" })).toBeDisabled();
  });
});
