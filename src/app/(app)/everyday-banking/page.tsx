import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BankingViewTabs } from "@/components/banking/banking-view-tabs";
import { QuickTransferForm } from "@/components/banking/quick-transfer-form";
import { RecentTransactions } from "@/components/banking/recent-transactions";
import { SummaryCards } from "@/components/banking/summary-cards";
import { getAuthenticatedUser } from "@/lib/auth";
import { getBankingOverview } from "@/lib/banking/queries";

export const metadata: Metadata = {
  title: "WealthPort — Everyday Banking",
  description: "Manage checking, savings, transactions, and transfers.",
};

export default async function EverydayBankingPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/");
  }

  const overview = await getBankingOverview(user.id);

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] p-8">
      <BankingViewTabs />

      <div className="mt-6 flex flex-col gap-6">
        <SummaryCards
          checkingBalance={overview.checkingAccount?.balance ?? null}
          savingsBalance={overview.savingsAccount?.balance ?? null}
          monthlySpend={overview.monthlySpend}
          monthlySpendTrend={overview.monthlySpendTrend}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentTransactions transactions={overview.recentTransactions} />
          </div>
          <QuickTransferForm accounts={overview.accounts} />
        </div>
      </div>
    </main>
  );
}
