type QuoteWithSymbol = {
  symbol: string;
};

export function dedupeLatestQuotesBySymbol<T extends QuoteWithSymbol>(
  quotes: T[],
): T[] {
  const latestQuotesBySymbol = new Map<string, T>();

  for (const quote of quotes) {
    if (!latestQuotesBySymbol.has(quote.symbol)) {
      latestQuotesBySymbol.set(quote.symbol, quote);
    }
  }

  return [...latestQuotesBySymbol.values()];
}
