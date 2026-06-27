let idCounter = 0;

function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export type AccountFixture = {
  id: string;
  userId: string;
  type: "checking" | "savings" | "credit_card";
  name: string;
  accountNumberLast4: string;
  balance: string;
  currency: string;
  creditLimit?: string | null;
};

export function makeAccount(overrides: Partial<AccountFixture> = {}): AccountFixture {
  return {
    id: nextId("account"),
    userId: "user-1",
    type: "checking",
    name: "Checking",
    accountNumberLast4: "1234",
    balance: "1000.00",
    currency: "USD",
    ...overrides,
  };
}

export type TransactionFixture = {
  id: string;
  postedAt: string;
  description: string;
  amount: string;
  category: { name: string };
};

export function makeTransaction(
  overrides: Partial<TransactionFixture> = {},
): TransactionFixture {
  return {
    id: nextId("transaction"),
    postedAt: "2024-10-12",
    description: "Coffee Shop",
    amount: "-12.50",
    category: { name: "Food & Drink" },
    ...overrides,
  };
}

export type AllocationFixture = {
  assetClass: "equities" | "bonds" | "real_estate" | "cash";
  percentage: string;
};

export type PortfolioFixture = {
  id: string;
  name: string;
  totalValue: string;
  dayChangeAmount: string;
  dayChangePercent: string;
  currency: string;
  assetAllocations: AllocationFixture[];
};

export function makePortfolioWithAllocations(
  overrides: Partial<PortfolioFixture> = {},
): PortfolioFixture {
  return {
    id: nextId("portfolio"),
    name: "Primary Portfolio",
    totalValue: "842500.00",
    dayChangeAmount: "3210.45",
    dayChangePercent: "0.3800",
    currency: "USD",
    assetAllocations: [
      { assetClass: "equities", percentage: "60.00" },
      { assetClass: "bonds", percentage: "25.00" },
      { assetClass: "real_estate", percentage: "10.00" },
      { assetClass: "cash", percentage: "5.00" },
    ],
    ...overrides,
  };
}

export type QuoteFixture = {
  id: string;
  symbol: string;
  name: string;
  price: string;
  changePercent: string;
  asOf: Date;
};

export function makeQuote(overrides: Partial<QuoteFixture> = {}): QuoteFixture {
  return {
    id: nextId("security"),
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "189.43",
    changePercent: "1.2000",
    asOf: new Date("2024-10-12T00:00:00.000Z"),
    ...overrides,
  };
}
