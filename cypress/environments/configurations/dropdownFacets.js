import {
  trackingOptions,
  searchBoxOptions,
  searchResultsOptions,
} from "./base.js";

const lupaSearch = window.lupaSearch;

lupaSearch.tracking(trackingOptions);
lupaSearch.searchBox(searchBoxOptions);

lupaSearch.searchResults({
  ...searchResultsOptions,
  filters: {
    ...searchResultsOptions.filters,
    facets: {
      ...searchResultsOptions.filters.facets,
      style: { type: "top-dropdown" },
    },
  },
  toolbar: {
    layoutSelector: false,
    itemSummary: true,
    clearFilters: true,
  },
});
