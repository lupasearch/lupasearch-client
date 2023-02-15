import { SdkOptions } from "../General";
import { RoutingBehavior } from "../search-results/RoutingBehavior";
import { DynamicData } from "../search-results/SearchResultsOptions";
import { SearchBoxHistory } from "./SearchBoxHistory";
import { SearchBoxPanel } from "./SearchBoxPanel";

export type SearchBoxOptions = SearchBoxPanelOptions & {
  inputSelector: string;
  searchTriggers?: string[];
  routingBehavior?: RoutingBehavior;
  dynamicData?: DynamicData;
};

export type SearchBoxOptionLabels = {
  placeholder: string;
  noResults: string;
  moreResults: string;
  currency: string;
  priceSeparator?: string;
  defaultFacetLabel?: string;
  close?: string;
};

export type SearchBoxOptionLinks = {
  searchResults: string;
};

export type SearchBoxInputOptions = {
  minInputLength: number;
  labels: SearchBoxOptionLabels;
  links: SearchBoxOptionLinks;
  inputAttributes?: Record<string, string>;
};

export type SearchBoxPanelOptions = SearchBoxInputOptions & {
  history: SearchBoxHistory;
  panels: SearchBoxPanel[];
  options: SdkOptions;
  debounce?: number;
  showTotalCount?: boolean;
};
