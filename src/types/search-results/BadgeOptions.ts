import { Document } from "@getlupa/client-sdk/Types";
import { AnchorPosition } from "./SearchResultsProductCardOptions";

export type SearchResultBadgeType = "text" | "image" | "customHtml";

export type BadgeOptions = {
  anchor: AnchorPosition;
  elements: BadgeElement[];
  product?: Document;
};

export type SearchResultBadgeElement = {
  type: SearchResultBadgeType;
  key: string;
  isHtml?: boolean;
  className?: boolean;
  product?: Document;
  display?: (document: Record<string, unknown>) => boolean;
};

export type BaseBadgeElement = SearchResultBadgeElement & {
  value?: string;
};

export type TextBadgeElement = BaseBadgeElement & {
  type: "text";
  prefix?: string;
  maxItems?: number;
};

export type ImageBadgeElement = BaseBadgeElement & {
  type: "image";
  rootImageUrl?: string;
  maxItems?: number;
};

export type CustomHtmlBadgeElement = BaseBadgeElement & {
  type: "customHtml";
  className?: string;
  html: (doc: Document) => string;
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
