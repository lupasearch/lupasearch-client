import { FilterGroup } from "@getlupa/client-sdk/Types";
import { RoutingBehavior } from "../search-results/RoutingBehavior";
import { SearchResultsOptions } from "../search-results/SearchResultsOptions";

export type CategoryFilterOptions = {
  queryKey?: string;
  routingBehavior?: RoutingBehavior;
  keys: {
    titleKey?: string;
    urlKey?: string;
  };
  filters?: Record<string, string[]>;
  back?: {
    url: string;
    title: string;
  };
  parent?: {
    url: string;
    title: string;
  };
  current?: {
    title: string;
    description: string;
  };
};

export type ProductListOptions = SearchResultsOptions & {
  initialFilters?: FilterGroup;
  categories?: CategoryFilterOptions;
};
