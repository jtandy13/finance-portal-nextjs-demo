const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function formatCurrency(value: string | number) {
  const amount = typeof value === "string" ? Number.parseFloat(value) : value;
  return currencyFormatter.format(amount);
}

export function formatSignedCurrency(value: string | number) {
  const amount = typeof value === "string" ? Number.parseFloat(value) : value;
  const formatted = currencyFormatter.format(Math.abs(amount));
  if (amount > 0) return `+${formatted}`;
  if (amount < 0) return `-${formatted}`;
  return formatted;
}

export function formatShortDate(value: string | Date) {
  return shortDateFormatter.format(new Date(value));
}

export function formatPercent(value: number, digits = 1) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}
