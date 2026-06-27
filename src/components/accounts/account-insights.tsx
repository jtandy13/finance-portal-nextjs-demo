import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { LiquidityDistribution } from "@/lib/accounts/metrics";

type TrendPoint = {
  date: string;
  totalBalance: string;
};

type AccountInsightsProps = {
  liquidity: LiquidityDistribution;
  trend: TrendPoint[];
};

function clampPercent(percent: number) {
  return Math.min(100, Math.max(0, percent));
}

function BalanceTrendChart({ trend }: { trend: TrendPoint[] }) {
  if (trend.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-border bg-surface-container-low p-4 text-center">
        <p className="text-sm text-muted-foreground">
          No trend data yet. Run the database seed to load demo snapshots.
        </p>
      </div>
    );
  }

  const values = trend.map((point) => Number.parseFloat(point.totalBalance));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 100;
  const top = 12;
  const bottom = 88;

  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = bottom - ((value - min) / range) * (bottom - top);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="relative h-32 overflow-hidden rounded-lg border border-border bg-surface-container-low">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand/20 to-transparent" />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-brand"
        role="img"
        aria-label="30-day aggregated balance trend"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          points={points}
        />
      </svg>
    </div>
  );
}

export function AccountInsights({ liquidity, trend }: AccountInsightsProps) {
  const cashPercent = clampPercent(liquidity.cashPercent);
  const creditUsePercent = clampPercent(liquidity.creditUsePercent);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 flex items-center gap-2 text-base font-semibold text-foreground">
        <MaterialSymbol name="insights" className="text-[20px] text-brand" />
        Account Insights
      </h3>

      <div className="mb-6">
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Liquidity Distribution
        </p>
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-surface-container">
          <div className="h-full bg-brand" style={{ width: `${cashPercent}%` }} />
          <div
            className="h-full bg-primary"
            style={{ width: `${creditUsePercent}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-brand" />
            <span className="text-xs text-foreground">
              Cash ({cashPercent.toFixed(0)}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            <span className="text-xs text-foreground">
              Credit Use ({creditUsePercent.toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <p className="mb-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          30-Day Trend (Aggregated)
        </p>
        <BalanceTrendChart trend={trend} />
      </div>
    </div>
  );
}
