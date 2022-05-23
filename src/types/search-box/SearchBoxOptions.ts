import { SdkOptions } from "../General";
import { RoutingBehavior } from "../search-results/RoutingBehavior";
import { SearchBoxHistory } from "./SearchBoxHistory";
import { SearchBoxPanel } from "./SearchBoxPanel";

export type SearchBoxOptions = SearchBoxPanelOptions & {
  inputSelector: string;
  searchTriggers?: string[];
  routingBehavior?: RoutingBehavior;
};

export type SearchBoxOptionLabels = {
  placeholder: string;
  noResults: string;
  moreResults: string;
  currency: string;
  priceSeparator?: string;
  defaultFacetLabel?: string;
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
