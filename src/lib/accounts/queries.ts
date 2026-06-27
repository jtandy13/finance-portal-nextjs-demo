import "server-only";

import { asc, eq, gte } from "drizzle-orm";

import { db } from "@/db";
import { accounts, balanceSnapshots } from "@/db/schema";
import {
  computeDayChange,
  computeLiquidityDistribution,
  computeTotalAvailableBalance,
  isDepositAccount,
} from "@/lib/accounts/metrics";

export async function getAccountsOverview(userId: string) {
  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, userId),
    orderBy: [asc(accounts.type), asc(accounts.name)],
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoff = thirtyDaysAgo.toISOString().slice(0, 10);

  const snapshots = await db.query.balanceSnapshots.findMany({
    where: (table, { and, eq: eqOp }) =>
      and(eqOp(table.userId, userId), gte(table.snapshotDate, cutoff)),
    orderBy: [asc(balanceSnapshots.snapshotDate)],
  });

  const depositAccounts = userAccounts.filter((account) =>
    isDepositAccount(account.type),
  );
  const creditAccounts = userAccounts.filter(
    (account) => account.type === "credit_card",
  );

  const totalAvailableBalance = computeTotalAvailableBalance(userAccounts);
  const liquidity = computeLiquidityDistribution(userAccounts);
  const dayChange = computeDayChange(snapshots);

  return {
    depositAccounts,
    creditAccounts,
    totalAvailableBalance,
    liquidity,
    dayChange,
    trend: snapshots.map((snapshot) => ({
      date: snapshot.snapshotDate,
      totalBalance: snapshot.totalBalance,
    })),
  };
}
