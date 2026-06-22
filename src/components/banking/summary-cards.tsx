import {
  CreditCard,
  PiggyBank,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const summaryCardClassName =
  "rounded-lg border border-border bg-card p-6 transition-all hover:ring-2 hover:ring-brand";

type SummaryCardsProps = {
  checkingBalance: string | null;
  savingsBalance: string | null;
  monthlySpend: number;
  monthlySpendTrend: number | null;
};

type SummaryCardConfig = {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number | null;
};

function SummaryCard({
  title,
  value,
  icon: Icon,
  trend,
}: SummaryCardConfig) {
  return (
    <div className={summaryCardClassName}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-muted-foreground">{title}</h3>
        <Icon className="size-5 text-muted-foreground" />
      </div>

      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">
          {value}
        </p>
        {trend !== undefined && trend !== null ? (
          <Badge
            variant="secondary"
            className={cn(
              "rounded-full px-2 py-1 text-xs font-medium tabular-nums",
              trend >= 0
                ? "bg-emerald-500/10 text-emerald-700"
                : "bg-destructive/10 text-destructive",
            )}
          >
            <TrendingUp className="size-3.5" data-icon="inline-start" />
            {formatPercent(trend)}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

export function SummaryCards({
  checkingBalance,
  savingsBalance,
  monthlySpend,
  monthlySpendTrend,
}: SummaryCardsProps) {
  const cards: SummaryCardConfig[] = [
    {
      title: "Checking Balance",
      value: checkingBalance ? formatCurrency(checkingBalance) : "$0.00",
      icon: Wallet,
    },
    {
      title: "Savings Balance",
      value: savingsBalance ? formatCurrency(savingsBalance) : "$0.00",
      icon: PiggyBank,
    },
    {
      title: "Monthly Spend",
      value: formatCurrency(monthlySpend),
      icon: CreditCard,
      trend: monthlySpendTrend,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <SummaryCard key={card.title} {...card} />
      ))}
    </div>
  );
}
