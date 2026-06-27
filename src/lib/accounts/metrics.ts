export type AccountBalanceInput = {
  type: "checking" | "savings" | "credit_card";
  balance: string;
  creditLimit?: string | null;
};

export type LiquidityDistribution = {
  cashPercent: number;
  creditUsePercent: number;
};

export type DayChange = {
  amount: number;
  percent: number;
};

export function isDepositAccount(type: AccountBalanceInput["type"]) {
  return type === "checking" || type === "savings";
}

export function computeTotalAvailableBalance(accounts: AccountBalanceInput[]) {
  return accounts
    .filter((account) => isDepositAccount(account.type))
    .reduce((total, account) => total + Number.parseFloat(account.balance), 0);
}

export function computeLiquidityDistribution(
  accounts: AccountBalanceInput[],
): LiquidityDistribution {
  const cashTotal = accounts
    .filter((account) => isDepositAccount(account.type))
    .reduce((total, account) => total + Number.parseFloat(account.balance), 0);

  const creditAccounts = accounts.filter((account) => account.type === "credit_card");
  const creditUsed = creditAccounts.reduce(
    (total, account) => total + Number.parseFloat(account.balance),
    0,
  );
  const creditLimit = creditAccounts.reduce(
    (total, account) =>
      total + Number.parseFloat(account.creditLimit ?? "0"),
    0,
  );

  if (creditLimit > 0) {
    const creditUsePercent = Math.min(100, (creditUsed / creditLimit) * 100);
    return {
      cashPercent: Math.max(0, 100 - creditUsePercent),
      creditUsePercent,
    };
  }

  const combined = cashTotal + creditUsed;
  if (combined <= 0) {
    return { cashPercent: 100, creditUsePercent: 0 };
  }

  return {
    cashPercent: (cashTotal / combined) * 100,
    creditUsePercent: (creditUsed / combined) * 100,
  };
}

export function computeDayChange(
  snapshots: Array<{ totalBalance: string }>,
): DayChange | null {
  if (snapshots.length < 2) {
    return null;
  }

  const today = Number.parseFloat(snapshots[snapshots.length - 1]!.totalBalance);
  const yesterday = Number.parseFloat(snapshots[snapshots.length - 2]!.totalBalance);
  const amount = today - yesterday;

  if (yesterday === 0) {
    return { amount, percent: 0 };
  }

  return {
    amount,
    percent: (amount / yesterday) * 100,
  };
}
