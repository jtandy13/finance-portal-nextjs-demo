import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountInsights } from "@/components/accounts/account-insights";
import { AccountListSection } from "@/components/accounts/account-list-section";
import { AccountsQuickActions } from "@/components/accounts/accounts-quick-actions";
import { TotalBalanceSummary } from "@/components/accounts/total-balance-summary";
import { getAuthenticatedUser } from "@/lib/auth";
import { getAccountsOverview } from "@/lib/accounts/queries";

export const metadata: Metadata = {
  title: "WealthPort — Accounts",
  description: "Manage and monitor your everyday banking balances.",
};

export default async function AccountsPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/");
  }

  const overview = await getAccountsOverview(user.id);

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] p-8">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Accounts Overview
          </h2>
          <p className="mt-1 text-base text-muted-foreground">
            Manage and monitor your everyday banking balances.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <TotalBalanceSummary
              totalBalance={overview.totalAvailableBalance}
              dayChange={overview.dayChange}
            />
            <AccountListSection
              title="Deposit Accounts"
              accounts={overview.depositAccounts}
              variant="deposit"
            />
            <AccountListSection
              title="Credit Cards"
              accounts={overview.creditAccounts}
              variant="credit"
            />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4">
            <AccountInsights
              liquidity={overview.liquidity}
              trend={overview.trend}
            />
            <AccountsQuickActions />
          </div>
        </div>
      </div>
    </main>
  );
}
