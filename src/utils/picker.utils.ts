export const pick = <T extends Record<string, unknown>, U extends keyof T>(
  obj: T,
  keys: Array<U>
): Pick<T, U> => {
  const ret = Object.create({});
  for (const k of keys) {
    ret[k] = obj[k];
  }
  return ret;
};

export const getHint = (suggestion: string, inputValue: string): string => {
  const hint = suggestion.replace(inputValue, "");

  if (!hint || suggestion !== hint) {
    return `<strong>${inputValue}</strong>${hint}`;
  } else return suggestion;
};

// https://stackoverflow.com/a/56781239
export const reverseKeyValue = (
  obj: Record<string, string>
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [v, k.toLowerCase()])
  );
};

export const pickClosestNumber = (
  numbers: number[],
  closestTo: number
): number => {
  return numbers.reduce((prev, curr) =>
    Math.abs(curr - closestTo) < Math.abs(prev - closestTo) ? curr : prev
  );
};

export const getPageCount = (total: number, limit: number): number => {
  return Math.ceil(total / limit) || 0;
};
