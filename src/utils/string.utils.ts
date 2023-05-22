import { Document } from "@getlupa/client-sdk/Types";

export const getNormalizedString = (str?: string | number): string => {
  if (!str) {
    return "";
  }
  const transformedStr = typeof str === "string" ? str : str.toString();
  return transformedStr.normalize === undefined
    ? transformedStr.toLocaleLowerCase()
    : transformedStr
        .toLocaleLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s.-_/]/g, "");
};

export const capitalize = (str?: string): string => {
  if (!str) {
    return "";
  }
  return str[0].toLocaleUpperCase() + str.slice(1);
};

export const addParamsToLabel = (
  label: string,
  ...params: unknown[]
): string => {
  if (!params || params.length < 1) {
    return label;
  }
  const paramKeys = Array.from(Array(params.length).keys());
  return paramKeys.reduce(
    (a, c) => a.replace(`{${c + 1}}`, params[c] as string),
    label
  );
};

export const getRandomString = (length: number): string => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const toFixedIfNecessary = (value: string, precision = 2): string => {
  return (+parseFloat(value).toFixed(precision)).toString();
};

export const getDisplayValue = (value?: string | number): string => {
  if (value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  return toFixedIfNecessary(value.toString());
};

export const getProductKey = (
  product: Document,
  idKey: string | undefined
): string => {
  if (!idKey) {
    return "id";
  }
  return product[idKey] ? (product[idKey] as string) : "id";
};

export const normalizeFloat = (value?: string): number => {
  if (!value) {
    return 0;
  }
  return +value?.replace(/[^0-9,.]/g, "")?.replace(",", ".");
};

export const escapeHtml = (value?: string): string => {
  if (!value) {
    return "";
  }
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
