import Link from "next/link";
import { ArrowUp, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { DayChange } from "@/lib/accounts/metrics";
import { cn } from "@/lib/utils";

type TotalBalanceSummaryProps = {
  totalBalance: number;
  dayChange: DayChange | null;
};

export function TotalBalanceSummary({
  totalBalance,
  dayChange,
}: TotalBalanceSummaryProps) {
  const isPositive = dayChange ? dayChange.amount >= 0 : true;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-full w-64 bg-gradient-to-l from-surface-container to-transparent opacity-60"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Total Available Balance
          </p>
          <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums text-foreground">
            {formatCurrency(totalBalance)}
          </p>
          {dayChange ? (
            <div
              className={cn(
                "mt-3 flex items-center gap-1.5 text-sm font-medium tabular-nums",
                isPositive ? "text-emerald-600" : "text-destructive",
              )}
            >
              {isPositive ? (
                <ArrowUp className="size-4" />
              ) : (
                <TrendingUp className="size-4 rotate-180" />
              )}
              <span>
                {isPositive ? "+" : "-"}
                {formatCurrency(Math.abs(dayChange.amount))} (
                {formatPercent(dayChange.percent)})
              </span>
              <span className="text-muted-foreground">Today</span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/everyday-banking">Transfer Funds</Link>
          </Button>
          <Button variant="outline" disabled>
            Deposit
          </Button>
        </div>
      </div>
    </div>
  );
}
