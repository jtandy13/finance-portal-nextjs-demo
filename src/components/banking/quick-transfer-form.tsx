"use client";

import { useActionState, useEffect } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createTransfer,
  type TransferActionState,
} from "@/lib/banking/actions";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type AccountOption = {
  id: string;
  name: string;
  accountNumberLast4: string;
  balance: string;
};

type QuickTransferFormProps = {
  accounts: AccountOption[];
  variant?: "card" | "embedded";
  onSuccess?: () => void;
};

const initialState: TransferActionState = {};

const selectClassName = cn(
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
);

function formatAccountLabel(account: AccountOption) {
  return `${account.name} (...${account.accountNumberLast4}) - ${formatCurrency(account.balance)}`;
}

export function QuickTransferForm({
  accounts,
  variant = "card",
  onSuccess,
}: QuickTransferFormProps) {
  const [state, formAction, isPending] = useActionState(
    createTransfer,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  if (accounts.length < 2) {
    const emptyMessage = (
      <p className="text-sm text-muted-foreground">
        Add at least two accounts to transfer funds.
      </p>
    );

    if (variant === "embedded") {
      return emptyMessage;
    }

    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border bg-surface-container-low px-6 py-4">
          <h2 className="text-xl font-semibold text-foreground">Quick Transfer</h2>
        </div>
        <div className="px-6 py-10">{emptyMessage}</div>
      </div>
    );
  }

  const defaultFrom = accounts[0]?.id;
  const defaultTo = accounts[1]?.id;

  const form = (
      <form action={formAction} className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fromAccountId">From Account</Label>
          <select
            id="fromAccountId"
            name="fromAccountId"
            defaultValue={defaultFrom}
            required
            className={selectClassName}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {formatAccountLabel(account)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="toAccountId">To Account</Label>
          <select
            id="toAccountId"
            name="toAccountId"
            defaultValue={defaultTo}
            required
            className={selectClassName}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {`${account.name} (...${account.accountNumberLast4})`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="bg-background pl-7"
              required
            />
          </div>
        </div>

        {state.error ? (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="text-sm text-emerald-600" role="status">
            {state.success}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Send Funds
          <Send data-icon="inline-end" />
        </Button>
      </form>
  );

  if (variant === "embedded") {
    return <div className="[&_form]:p-0">{form}</div>;
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-surface-container-low px-6 py-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Transfer</h2>
      </div>
      {form}
    </div>
  );
}
