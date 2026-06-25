import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { securities, securityQuotes } from "@/db/schema";

export async function getWealthOverview(userId: string) {
  const portfolio = await db.query.portfolios.findFirst({
    where: (table, { eq: eqFn }) => eqFn(table.userId, userId),
    with: {
      assetAllocations: true,
    },
    orderBy: (table, { desc: descFn }) => [descFn(table.updatedAt)],
  });

  const marketMovers = await db
    .select({
      id: securities.id,
      symbol: securities.symbol,
      name: securities.name,
      price: securityQuotes.price,
      changePercent: securityQuotes.changePercent,
      asOf: securityQuotes.asOf,
    })
    .from(securities)
    .innerJoin(securityQuotes, eq(securityQuotes.securityId, securities.id))
    .orderBy(desc(securityQuotes.asOf));

  const latestQuotesBySymbol = new Map<
    string,
    (typeof marketMovers)[number]
  >();

  for (const quote of marketMovers) {
    if (!latestQuotesBySymbol.has(quote.symbol)) {
      latestQuotesBySymbol.set(quote.symbol, quote);
    }
  }

  return {
    portfolio,
    marketMovers: [...latestQuotesBySymbol.values()],
  };
}
