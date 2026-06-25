import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

type AllocationRow = {
  assetClass: "equities" | "bonds" | "real_estate" | "cash";
  percentage: string;
};

type AssetAllocationProps = {
  allocations: AllocationRow[];
};

const assetClassLabels: Record<AllocationRow["assetClass"], string> = {
  equities: "Equities",
  bonds: "Bonds",
  real_estate: "Real Estate",
  cash: "Cash",
};

const assetClassColors: Record<AllocationRow["assetClass"], string> = {
  equities: "bg-brand",
  bonds: "bg-secondary",
  real_estate: "bg-emerald-500",
  cash: "bg-muted-foreground/40",
};

export function AssetAllocation({ allocations }: AssetAllocationProps) {
  const sortedAllocations = [...allocations].sort(
    (a, b) => Number.parseFloat(b.percentage) - Number.parseFloat(a.percentage),
  );

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-surface-container-low px-6 py-4">
        <h2 className="text-xl font-semibold text-foreground">Asset Allocation</h2>
        <button
          type="button"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Asset allocation options"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </div>

      {sortedAllocations.length === 0 ? (
        <div className="px-6 py-10 text-sm text-muted-foreground">
          No allocation data yet. Run the database seed to load demo data.
        </div>
      ) : (
        <div className="space-y-6 p-6">
          <div className="flex h-3 overflow-hidden rounded-full">
            {sortedAllocations.map((allocation) => (
              <div
                key={allocation.assetClass}
                className={cn(
                  "h-full first:rounded-l-full last:rounded-r-full",
                  assetClassColors[allocation.assetClass],
                )}
                style={{ width: `${allocation.percentage}%` }}
                aria-hidden="true"
              />
            ))}
          </div>

          <ul className="space-y-4">
            {sortedAllocations.map((allocation) => {
              const percentage = Number.parseFloat(allocation.percentage);

              return (
                <li
                  key={allocation.assetClass}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "size-3 shrink-0 rounded-full",
                        assetClassColors[allocation.assetClass],
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {assetClassLabels[allocation.assetClass]}
                    </span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {percentage.toFixed(0)}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
