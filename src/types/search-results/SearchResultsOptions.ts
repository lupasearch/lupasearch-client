import { SdkOptions } from "../General";
import { SearchResultsAdditionalPanelOptions } from "./SearchResultsAdditionalPanelOptions";
import { SearchResultsProductCardOptions } from "./SearchResultsProductCardOptions";
import { SearchResultsSortOptions } from "./SearchResultsSort";

export type SearchResultsOptions = SearchResultsProductOptions &
  SearchResultsAdditionalPanels & {
    containerSelector: string;
    breadcrumbs: SearchResultsBreadcrumb[];
    classMap?: Record<string, string>;
    searchTitlePosition?: string;
  };

export type SearchTitlePosition = "page-top" | "search-results-top";

export type SearchResultsDidYouMeanLabels = {
  noResultsSuggestion: string;
  didYouMean: string;
};

export type SearchResultsSimilarQueriesLabels = {
  similarQuery: string;
  similarQueries: string;
};

export type SearchResultsOptionLabels = SearchResultsPaginationLabels &
  SearchResultsDidYouMeanLabels &
  SearchResultsSimilarQueriesLabels & {
    sortBy: string;
    currency: string;
    priceSeparator?: string;
    itemCount: string;
    emptyResults: string;
    mobileFilterButton: string;
    htmlTitleTemplate: string;
  };

export type SearchResultsAdditionalPanels = {
  additionalPanels?: SearchResultsAdditionalPanelOptions[];
};

export type SearchResultsProductOptions = SearchResultsProductCardOptions &
  SearchResultsAdditionalPanels & {
    grid: ProductGrid;
    options: SdkOptions;
    queryKey: string;
    pagination: SearchResultsPagination;
    sort: SearchResultsSortOptions[];
    filters?: SearchResultsFilterOptions;
    toolbar?: {
      layoutSelector?: boolean;
      itemSummary?: boolean;
      clearFilters?: boolean;
      totalCount?: boolean;
    };
  };

export type ProductGrid = {
  columns: {
    xl: number;
    l: number;
    md: number;
    sm: number;
    xs: number;
  };
};

export type SearchResultsPaginationLabels = {
  pageSize: string;
  showMore: string;
};

export type SearchResultsPagination = {
  sizeSelection: {
    sizes: number[];
    position: SearchResultsPaginationPosition;
  };
  pageSelection: {
    position: SearchResultsPaginationPosition;
    display: number;
  };
};

export type SearchResultsPaginationPosition = {
  top: boolean;
  bottom: boolean;
};

export type ResultCurrentFilterOptions = {
  labels: {
    title: string;
    clearAll: string;
  };
  visibility?: {
    mobileSidebar: boolean;
    mobileToolbar: boolean;
  };
};

export type FacetStyle = "sidebar" | "top-dropdown";

export type ResultFacetOptions = {
  labels: {
    title: string;
    showAll: string;
    facetFilter: string;
    facetClear?: string;
  };
  promotedFacets?: string[];
  filterable?: {
    minValues: number;
  };
  hierarchy?: {
    maxInitialLevel: number;
    topLevelValueCountLimit?: number;
    filterable?: boolean;
  };
  facetValueCountLimit?: number;
  showDocumentCount?: boolean;
  style?: {
    type: FacetStyle;
  };
};

export type SearchResultsFilterOptions = {
  currentFilters?: ResultCurrentFilterOptions;
  facets?: ResultFacetOptions;
};

export type SearchResultsBreadcrumb = { label: string; link?: string };
