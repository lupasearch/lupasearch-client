import { Document } from "@getlupa/client-sdk/Types";

export enum DocumentElementType {
  IMAGE = "image",
  TITLE = "title",
  CUSTOM = "custom",
  DESCRIPTION = "description",
  PRICE = "price",
  REGULARPRICE = "regularPrice",
  RATING = "rating",
  ADDTOCART = "addToCart",
  CUSTOM_HTML = "customHtml",
}

export type DocumentElementBase = {
  type: DocumentElementType;
  key?: string;
  display?: (document: Record<string, unknown>) => boolean;
  isHtml?: boolean;
};

export type ImageDocumentElement = DocumentElementBase & {
  type: DocumentElementType.IMAGE;
  placeholder: string;
  baseUrl?: string;
  key: string;
};

export type TitleDocumentElement = DocumentElementBase & {
  type: DocumentElementType.TITLE;
  maxLines: number;
  link?: boolean;
  key: string;
};

export type DescriptionDocumentElement = DocumentElementBase & {
  type: DocumentElementType.DESCRIPTION;
  maxLines: number;
  key: string;
};

export type CustomDocumentElement = DocumentElementBase & {
  type: DocumentElementType.CUSTOM;
  className: string;
  key: string;
};

export type PriceElement = DocumentElementBase & {
  type: DocumentElementType.PRICE;
  key: string;
};

export type RegularPriceDocumentElement = DocumentElementBase & {
  type: DocumentElementType.REGULARPRICE;
  key: string;
};

export type RatingElement = DocumentElementBase & {
  type: DocumentElementType.RATING;
  labels: RatingLabels;
  links: RatingLinks;
  totalKey: string;
  getRatingPercentage?: (doc: Document) => number;
  key: string;
};

export type RatingLabels = {
  numberOfRatings: string;
};

export type RatingLinks = {
  ratingDetails?: string;
};

export type AddToCartElement = DocumentElementBase & {
  type: DocumentElementType.ADDTOCART;
  action: (document: Document, amount: number) => Promise<unknown> | undefined;
  labels: {
    addToCart: string;
  };
};

export type CustomHtmlElement = DocumentElementBase & {
  type: DocumentElementType.CUSTOM_HTML;
  html: (document: Document) => string;
  className: string;
};

export type DocumentElement =
  | ImageDocumentElement
  | TitleDocumentElement
  | DescriptionDocumentElement
  | CustomDocumentElement
  | PriceElement
  | RegularPriceDocumentElement
  | RatingElement
  | AddToCartElement
  | CustomHtmlElement;
