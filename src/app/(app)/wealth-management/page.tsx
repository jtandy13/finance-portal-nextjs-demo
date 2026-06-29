import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AssetAllocation } from "@/components/wealth/asset-allocation";
import { MarketMovers } from "@/components/wealth/market-movers";
import { PortfolioSummary } from "@/components/wealth/portfolio-summary";
import { getAuthenticatedUser } from "@/lib/auth";
import { getWealthOverview } from "@/lib/wealth/queries";

export const metadata: Metadata = {
  title: "WealthPort — Wealth Management",
  description: "Monitor portfolio value, asset allocation, and market movers.",
};

export default async function WealthManagementPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/");
  }

  const overview = await getWealthOverview(user.id);

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] p-8">
      <div className="flex flex-col gap-6">
        {overview.portfolio ? (
          <PortfolioSummary
            totalValue={overview.portfolio.totalValue}
            dayChangeAmount={overview.portfolio.dayChangeAmount}
            dayChangePercent={overview.portfolio.dayChangePercent}
          />
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            No portfolio data yet. Run the database seed to load demo data.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AssetAllocation
              allocations={overview.portfolio?.assetAllocations ?? []}
            />
          </div>
          <MarketMovers movers={overview.marketMovers} />
        </div>
      </div>
    </main>
  );
}
