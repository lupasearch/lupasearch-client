import { SdkOptions } from "../General";
import { CategoryFilterOptions } from "../product-list/ProductListOptions";
import { SearchResultsAdditionalPanelOptions } from "./SearchResultsAdditionalPanelOptions";
import { SearchResultsProductCardOptions } from "./SearchResultsProductCardOptions";
import { SearchResultsSortOptions } from "./SearchResultsSort";

export type SearchResultsOptions = SearchResultsProductOptions &
  SearchResultsAdditionalPanels & {
    containerSelector: string;
    breadcrumbs: SearchResultsBreadcrumb[];
    classMap?: Record<string, string>;
    disallowEmptyQuery?: boolean;
    callbacks?: SearchResultEventCallbacks;
    categories?: CategoryFilterOptions;
  };

export type SearchTitlePosition = "page-top" | "search-results-top";

export type SearchResultsDidYouMeanLabels = {
  noResultsSuggestion: string;
  didYouMean: string;
};

export type SearchResultsSimilarQueriesLabels = {
  similarQuery: string;
  similarQueries: string;
  aiSuggestions?: string;
};

export type CallbackContext = {
  queryKey: string;
  hasResults?: boolean;
  urlQueryString?: string;
};

export type SearchResultEventCallbacks = {
  onSearchResults?: (context: CallbackContext) => unknown;
  onAdditionalPanelResults?: (context: CallbackContext) => unknown;
  onCategoryFilterResults?: (context: CallbackContext) => unknown;
  onProductClick?: (context: CallbackContext) => unknown;
  onUrlQueryChange?: (context: CallbackContext) => unknown;
  onMounted?: () => unknown;
};

export type SearchResultsOptionLabels = SearchResultsPaginationLabels &
  SearchResultsDidYouMeanLabels &
  SearchResultsSimilarQueriesLabels & {
    sortBy: string;
    currency: string;
    priceSeparator?: string;
    searchResults?: string;
    itemCount: string;
    emptyResults: string;
    mobileFilterButton: string;
    htmlTitleTemplate: string;
    outOfStock?: string;
    noItemsInPage?: string;
    backToFirstPage?: string;
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
    searchTitlePosition?: string;
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
  showLess?: string;
};

export type ResponsiveSearchResultPageSizes = {
  xs: number[];
  sm: number[];
  md: number[];
  l: number[];
  xl: number[];
};

export type SearchResultPageSizes = number[] | ResponsiveSearchResultPageSizes;

export type SearchResultsPagination = {
  sizeSelection: {
    sizes: SearchResultPageSizes;
    position: SearchResultsPaginationPosition;
  };
  pageSelection: {
    position: SearchResultsPaginationPosition;
    display: number;
    displayMobile: number;
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
  mobileSidebar?: {
    showFilterCount?: boolean;
    activeFiltersExpanded?: boolean;
  };
};

export type FacetStyle = "sidebar" | "top-dropdown";

export type FacetFilterQuery = {
  queryKey: string;
};

export type ResultFacetOptions = {
  labels: {
    title: string;
    showAll: string;
    showLess?: string;
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
  stats?: {
    slider?: boolean;
    inputs?: boolean;
    labels?: {
      from?: string;
      to?: string;
    };
  };
  facetValueCountLimit?: number;
  showDocumentCount?: boolean;
  style?: {
    type: FacetStyle;
  };
  exclude?: string[];
  expand?: string[];
  facetFilterQueries?: Record<string, FacetFilterQuery>;
};

export type SearchResultsFilterOptions = {
  currentFilters?: ResultCurrentFilterOptions;
  facets?: ResultFacetOptions;
  categories?: CategoryFilterOptions;
};

export type SearchResultsBreadcrumb = { label: string; link?: string };
