export const formatCurrency = (
  value: number,
  currency = "USD",
  opts: Intl.NumberFormatOptions = {},
) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    ...opts,
  }).format(value);

export const formatCompact = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export const formatPercent = (value: number, digits = 0) =>
  `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
