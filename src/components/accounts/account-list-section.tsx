import Link from "next/link";
import {
  CreditCard,
  PiggyBank,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type AccountItem = {
  id: string;
  type: "checking" | "savings" | "credit_card";
  name: string;
  accountNumberLast4: string;
  balance: string;
};

type AccountListSectionProps = {
  title: string;
  accounts: AccountItem[];
  variant: "deposit" | "credit";
};

const iconByType: Record<AccountItem["type"], LucideIcon> = {
  checking: Wallet,
  savings: PiggyBank,
  credit_card: CreditCard,
};

function maskAccountNumber(last4: string) {
  return `**** ${last4}`;
}

export function AccountListSection({
  title,
  accounts,
  variant,
}: AccountListSectionProps) {
  if (accounts.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col gap-4">
        {accounts.map((account) => {
          const Icon = iconByType[account.type];
          const balanceLabel =
            variant === "credit" ? "Current Balance" : "Available Balance";

          return (
            <div
              key={account.id}
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:ring-2 hover:ring-brand"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-low">
                    <Icon className="size-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground">
                      {account.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {maskAccountNumber(account.accountNumberLast4)}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span
                        className={cn(
                          "text-xl font-semibold tabular-nums",
                          variant === "credit"
                            ? "text-foreground"
                            : "text-foreground",
                        )}
                      >
                        {formatCurrency(account.balance)}
                      </span>{" "}
                      {balanceLabel}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 transition-opacity sm:justify-end sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                  <Button variant="outline" size="sm" disabled>
                    Details
                  </Button>
                  {variant === "deposit" ? (
                    <Button asChild size="sm" variant="secondary">
                      <Link href="/everyday-banking">Transfer</Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" disabled>
                      Pay Bill
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
