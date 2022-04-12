const getAmount = (price: string | number) => {
  if (typeof price === "number") {
    return `${price.toFixed(2)}`;
  }
  const value = parseFloat(price);
  if (isNaN(value)) {
    return "";
  }
  return value.toFixed(2);
};

export const formatPrice = (
  price?: string | number,
  currency = "€"
): string => {
  if (price !== 0 && !price) {
    return "";
  }
  const amount = getAmount(price);
  if (!amount) {
    return "";
  }
  return `${amount} ${currency}`;
};

export const formatPriceSummary = (
  [min, max]: [min?: number | string, max?: number | string],
  currency?: string
): string => {
  if (min !== undefined && max !== undefined) {
    return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`;
  }
  if (min !== undefined) {
    return `> ${formatPrice(min, currency)}`;
  }
  return `< ${formatPrice(max, currency)}`;
};
