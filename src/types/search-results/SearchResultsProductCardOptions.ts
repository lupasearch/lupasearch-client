import { Document } from "@getlupa/client-sdk/Types";
import { DocumentElement } from "../DocumentElement";
import { BadgeElement, BadgeGenerateOptions } from "./BadgeOptions";
import { RoutingBehavior } from "./RoutingBehavior";
import { SearchResultsOptionLabels } from "./SearchResultsOptions";

export type SearchResultsProductCardOptions = {
  labels: SearchResultsOptionLabels;
  routingBehavior?: RoutingBehavior;
  isInStock: (doc: Document) => boolean;
  badges: SearchResultBadgeOptions;
  links: {
    details: string;
  };
  elements: DocumentElement[];
  queryKey: string;
  idKey?: string;
  titleKey?: string;
};

export type SearchResultBadgeOptions = {
  anchor: AnchorPosition;
  elements: BadgeElement[];
  generate?: BadgeGenerateOptions;
};

export type AnchorPosition = "tr" | "tl";
