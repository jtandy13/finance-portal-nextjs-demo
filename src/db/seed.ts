import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const DEFAULT_CLERK_ID = "user_demo";

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const clerkId = process.argv[2] ?? process.env.CLERK_USER_ID ?? DEFAULT_CLERK_ID;

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle({ client: sql, schema });

  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.clerkId, clerkId),
  });

  if (existingUser) {
    await db.delete(schema.users).where(eq(schema.users.id, existingUser.id));
  }

  const marketMovers = [
    { symbol: "AAPL", name: "Apple Inc.", price: "189.43", changePercent: "1.2000" },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: "378.11",
      changePercent: "-0.4000",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: "142.58",
      changePercent: "0.9000",
    },
    { symbol: "TSLA", name: "Tesla Inc.", price: "238.45", changePercent: "2.1000" },
  ] as const;

  for (const mover of marketMovers) {
    const [security] = await db
      .insert(schema.securities)
      .values({ symbol: mover.symbol, name: mover.name })
      .onConflictDoUpdate({
        target: schema.securities.symbol,
        set: { name: mover.name, updatedAt: new Date() },
      })
      .returning();

    await db.insert(schema.securityQuotes).values({
      securityId: security.id,
      price: mover.price,
      changePercent: mover.changePercent,
      asOf: new Date(),
    });
  }

  const [user] = await db
    .insert(schema.users)
    .values({
      clerkId,
      email: process.env.SEED_USER_EMAIL ?? "demo@wealthport.com",
      firstName: process.env.SEED_USER_FIRST_NAME ?? "Demo",
      lastName: process.env.SEED_USER_LAST_NAME ?? "User",
    })
    .returning();

  const [checkingAccount, savingsAccount] = await db
    .insert(schema.accounts)
    .values([
      {
        userId: user.id,
        type: "checking",
        name: "Checking",
        accountNumberLast4: "1234",
        balance: "12450.80",
      },
      {
        userId: user.id,
        type: "savings",
        name: "Savings",
        accountNumberLast4: "5678",
        balance: "45210.00",
      },
    ])
    .returning();

  const categories = await db
    .insert(schema.transactionCategories)
    .values([
      { name: "Food & Drink" },
      { name: "Income" },
      { name: "Shopping" },
    ])
    .onConflictDoNothing({ target: schema.transactionCategories.name })
    .returning();

  const categoryByName = new Map(categories.map((category) => [category.name, category]));

  const missingCategories = ["Food & Drink", "Income", "Shopping"].filter(
    (name) => !categoryByName.has(name),
  );

  if (missingCategories.length > 0) {
    const fetched = await db.query.transactionCategories.findMany({
      where: (categoriesTable, { inArray }) =>
        inArray(categoriesTable.name, missingCategories),
    });

    for (const category of fetched) {
      categoryByName.set(category.name, category);
    }
  }

  await db.insert(schema.transactions).values([
    {
      accountId: checkingAccount.id,
      categoryId: categoryByName.get("Food & Drink")!.id,
      postedAt: "2024-10-12",
      description: "Starbucks",
      amount: "-12.50",
    },
    {
      accountId: checkingAccount.id,
      categoryId: categoryByName.get("Income")!.id,
      postedAt: "2024-10-11",
      description: "Salary Deposit",
      amount: "4500.00",
    },
    {
      accountId: checkingAccount.id,
      categoryId: categoryByName.get("Shopping")!.id,
      postedAt: "2024-10-10",
      description: "Amazon",
      amount: "-89.99",
    },
  ]);

  await db.insert(schema.transfers).values({
    userId: user.id,
    fromAccountId: checkingAccount.id,
    toAccountId: savingsAccount.id,
    amount: "500.00",
    status: "completed",
  });

  const [portfolio] = await db
    .insert(schema.portfolios)
    .values({
      userId: user.id,
      name: "Primary Portfolio",
      totalValue: "842500.00",
      dayChangeAmount: "3210.45",
      dayChangePercent: "0.3800",
    })
    .returning();

  await db.insert(schema.assetAllocations).values([
    { portfolioId: portfolio.id, assetClass: "equities", percentage: "60.00" },
    { portfolioId: portfolio.id, assetClass: "bonds", percentage: "25.00" },
    { portfolioId: portfolio.id, assetClass: "real_estate", percentage: "10.00" },
    { portfolioId: portfolio.id, assetClass: "cash", percentage: "5.00" },
  ]);

  console.log("Seed completed successfully.");
  console.log(`Seeded user clerkId: ${clerkId}`);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
