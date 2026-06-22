import { relations } from "drizzle-orm";
import {
  date,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", [
  "checking",
  "savings",
]);

export const transferStatusEnum = pgEnum("transfer_status", [
  "pending",
  "completed",
  "failed",
]);

export const assetClassEnum = pgEnum("asset_class", [
  "equities",
  "bonds",
  "real_estate",
  "cash",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: accountTypeEnum("type").notNull(),
  name: text("name").notNull(),
  accountNumberLast4: text("account_number_last4").notNull(),
  balance: numeric("balance", { precision: 14, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const transactionCategories = pgTable(
  "transaction_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
);

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => transactionCategories.id, { onDelete: "restrict" }),
  postedAt: date("posted_at").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const transfers = pgTable("transfers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fromAccountId: uuid("from_account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "restrict" }),
  toAccountId: uuid("to_account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "restrict" }),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  status: transferStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const portfolios = pgTable("portfolios", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  totalValue: numeric("total_value", { precision: 16, scale: 2 }).notNull(),
  dayChangeAmount: numeric("day_change_amount", {
    precision: 16,
    scale: 2,
  }).notNull(),
  dayChangePercent: numeric("day_change_percent", {
    precision: 7,
    scale: 4,
  }).notNull(),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const assetAllocations = pgTable(
  "asset_allocations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    assetClass: assetClassEnum("asset_class").notNull(),
    percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("asset_allocations_portfolio_id_asset_class_idx").on(
      table.portfolioId,
      table.assetClass,
    ),
  ],
);

export const securities = pgTable("securities", {
  id: uuid("id").defaultRandom().primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const securityQuotes = pgTable("security_quotes", {
  id: uuid("id").defaultRandom().primaryKey(),
  securityId: uuid("security_id")
    .notNull()
    .references(() => securities.id, { onDelete: "cascade" }),
  price: numeric("price", { precision: 14, scale: 2 }).notNull(),
  changePercent: numeric("change_percent", { precision: 7, scale: 4 }).notNull(),
  asOf: timestamp("as_of", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  transfers: many(transfers),
  portfolios: many(portfolios),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
  transfersFrom: many(transfers, { relationName: "transfersFrom" }),
  transfersTo: many(transfers, { relationName: "transfersTo" }),
}));

export const transactionCategoriesRelations = relations(
  transactionCategories,
  ({ many }) => ({
    transactions: many(transactions),
  }),
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(transactionCategories, {
    fields: [transactions.categoryId],
    references: [transactionCategories.id],
  }),
}));

export const transfersRelations = relations(transfers, ({ one }) => ({
  user: one(users, {
    fields: [transfers.userId],
    references: [users.id],
  }),
  fromAccount: one(accounts, {
    fields: [transfers.fromAccountId],
    references: [accounts.id],
    relationName: "transfersFrom",
  }),
  toAccount: one(accounts, {
    fields: [transfers.toAccountId],
    references: [accounts.id],
    relationName: "transfersTo",
  }),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
  assetAllocations: many(assetAllocations),
}));

export const assetAllocationsRelations = relations(
  assetAllocations,
  ({ one }) => ({
    portfolio: one(portfolios, {
      fields: [assetAllocations.portfolioId],
      references: [portfolios.id],
    }),
  }),
);

export const securitiesRelations = relations(securities, ({ many }) => ({
  quotes: many(securityQuotes),
}));

export const securityQuotesRelations = relations(securityQuotes, ({ one }) => ({
  security: one(securities, {
    fields: [securityQuotes.securityId],
    references: [securities.id],
  }),
}));
