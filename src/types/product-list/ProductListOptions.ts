import { FilterGroup } from "@getlupa/client-sdk/Types";
import { SearchResultsOptions } from "../search-results/SearchResultsOptions";

export type CategoryFilterOptions = {
  queryKey: string;
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
};

export type ProductListOptions = SearchResultsOptions & {
  initialFilters?: FilterGroup;
  categories?: CategoryFilterOptions;
};
