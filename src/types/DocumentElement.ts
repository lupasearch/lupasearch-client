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
  key: string;
  display?: (document: Record<string, unknown>) => boolean;
  isHtml?: boolean;
};

export type ImageDocumentElement = DocumentElementBase & {
  type: DocumentElementType.IMAGE;
  placeholder: string;
  baseUrl?: string;
};

export type TitleDocumentElement = DocumentElementBase & {
  type: DocumentElementType.TITLE;
  maxLines: number;
  link?: boolean;
};

export type DescriptionDocumentElement = DocumentElementBase & {
  type: DocumentElementType.DESCRIPTION;
  maxLines: number;
};

export type CustomDocumentElement = DocumentElementBase & {
  type: DocumentElementType.CUSTOM;
  className: string;
};

export type PriceElement = DocumentElementBase & {
  type: DocumentElementType.PRICE;
};

export type RegularPriceDocumentElement = DocumentElementBase & {
  type: DocumentElementType.REGULARPRICE;
};

export type RatingElement = DocumentElementBase & {
  type: DocumentElementType.RATING;
  labels: RatingLabels;
  links: RatingLinks;
  totalKey: string;
  getRatingPercentage?: (doc: Document) => number;
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
    addToCart: "Add to Cart";
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
