import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type PortfolioSummaryProps = {
  totalValue: string;
  dayChangeAmount: string;
  dayChangePercent: string;
};

export function PortfolioSummary({
  totalValue,
  dayChangeAmount,
  dayChangePercent,
}: PortfolioSummaryProps) {
  const dayChange = Number.parseFloat(dayChangeAmount);
  const dayChangePct = Number.parseFloat(dayChangePercent);
  const isPositive = dayChange >= 0;

  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-all hover:ring-2 hover:ring-brand">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-muted-foreground">
          Total Portfolio Value
        </h3>
        <TrendingUp className="size-5 text-muted-foreground" />
      </div>

      <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">
        {formatCurrency(totalValue)}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Day&apos;s Change
        </span>
        <Badge
          variant="secondary"
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium tabular-nums",
            isPositive
              ? "bg-emerald-500/10 text-emerald-700"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {isPositive ? (
            <ArrowUp className="size-3.5" data-icon="inline-start" />
          ) : (
            <ArrowDown className="size-3.5" data-icon="inline-start" />
          )}
          {formatSignedCurrency(dayChangeAmount)} ({formatPercent(dayChangePct, 2)})
        </Badge>
      </div>
    </div>
  );
}
