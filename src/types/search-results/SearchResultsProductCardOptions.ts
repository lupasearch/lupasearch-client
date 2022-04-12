import { Document } from "@getlupa/client-sdk/Types";
import { DocumentElement } from "../DocumentElement";
import { BadgeElement } from "./BadgeOptions";
import { SearchResultsOptionLabels } from "./SearchResultsOptions";

export type SearchResultsProductCardOptions = {
  labels: SearchResultsOptionLabels;
  isInStock: (doc: Document) => boolean;
  badges: SearchResultBadgeOptions;
  links: {
    details: string;
  };
  elements: DocumentElement[];
  queryKey: string;
  idKey?: string;
};

export type SearchResultBadgeOptions = {
  anchor: AnchorPosition;
  elements: BadgeElement[];
};

export type AnchorPosition = "tr" | "tl";
