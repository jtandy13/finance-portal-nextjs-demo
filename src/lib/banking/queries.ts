import "server-only";

import { and, desc, eq, gte, inArray, lt } from "drizzle-orm";

import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import {
  computeMonthlySpendTrend,
  monthRange,
  sumNegativeSpend,
} from "@/lib/banking/metrics";

export async function getBankingOverview(userId: string) {
  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, userId),
    orderBy: (table, { asc }) => [asc(table.type)],
  });

  const checkingAccount = userAccounts.find((account) => account.type === "checking");
  const savingsAccount = userAccounts.find((account) => account.type === "savings");

  const recentTransactions = checkingAccount
    ? await db.query.transactions.findMany({
        where: eq(transactions.accountId, checkingAccount.id),
        with: {
          category: true,
        },
        orderBy: [desc(transactions.postedAt)],
        limit: 10,
      })
    : [];

  const now = new Date();
  const currentMonth = monthRange(now.getFullYear(), now.getMonth());
  const previousMonth = monthRange(now.getFullYear(), now.getMonth() - 1);

  const accountIds = userAccounts.map((account) => account.id);

  let monthlySpend = 0;
  let monthlySpendTrend: number | null = null;

  if (accountIds.length > 0) {
    const currentMonthRows = await db
      .select({ amount: transactions.amount })
      .from(transactions)
      .where(
        and(
          inArray(transactions.accountId, accountIds),
          gte(transactions.postedAt, currentMonth.start),
          lt(transactions.postedAt, currentMonth.end),
        ),
      );

    const previousMonthRows = await db
      .select({ amount: transactions.amount })
      .from(transactions)
      .where(
        and(
          inArray(transactions.accountId, accountIds),
          gte(transactions.postedAt, previousMonth.start),
          lt(transactions.postedAt, previousMonth.end),
        ),
      );

    monthlySpend = sumNegativeSpend(currentMonthRows);
    const previousSpend = sumNegativeSpend(previousMonthRows);

    monthlySpendTrend = computeMonthlySpendTrend(monthlySpend, previousSpend);
  }

  return {
    accounts: userAccounts,
    checkingAccount,
    savingsAccount,
    recentTransactions,
    monthlySpend,
    monthlySpendTrend,
  };
}
