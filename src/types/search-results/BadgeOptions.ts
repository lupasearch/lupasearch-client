/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document } from "@getlupa/client-sdk/Types";
import { AnchorPosition } from "./SearchResultsProductCardOptions";

export type SearchResultBadgeType = "text" | "image" | "customHtml";

export type BadgeOptions = {
  anchor: AnchorPosition;
  elements: BadgeElement[];
  product?: any;
};

export type SearchResultBadgeElement<T = any> = {
  type: SearchResultBadgeType;
  key: string;
  isHtml?: boolean;
  className?: string;
  product?: T;
  display?: (document: T) => boolean;
  rootImageUrl?: string;
  maxItems?: number;
};

export type BaseBadgeElement<T = any> = SearchResultBadgeElement<T> & {
  value?: string;
};

export type TextBadgeElement<T = any> = BaseBadgeElement<T> & {
  type: "text";
  prefix?: string;
  maxItems?: number;
};

export type ImageBadgeElement<T = any> = BaseBadgeElement<T> & {
  type: "image";
  rootImageUrl?: string;
  maxItems?: number;
};

export type CustomHtmlBadgeElement<T = any> = BaseBadgeElement<T> & {
  type: "customHtml";
  className?: string;
  html: (doc: T) => string;
};

export type BadgeElement = BaseBadgeElement | TextBadgeElement;

export enum BadgeType {
  DISCOUNTPERCENTAGE = "discountPercentage",
  DISCOUNTAMOUNT = "discountAmount",
  NEWITEM = "newItem",
  TEXT = "text",
  IMAGE = "image",
  CUSTOM_HTML = "customHtml",
}
