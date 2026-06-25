export function monthRange(year: number, month: number) {
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 1));
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export function sumNegativeSpend(rows: Array<{ amount: string }>) {
  return rows.reduce((total, row) => {
    const amount = Number.parseFloat(row.amount);
    return amount < 0 ? total + Math.abs(amount) : total;
  }, 0);
}

export function computeMonthlySpendTrend(
  currentSpend: number,
  previousSpend: number,
): number | null {
  if (previousSpend > 0) {
    return ((currentSpend - previousSpend) / previousSpend) * 100;
  }
  return null;
}
