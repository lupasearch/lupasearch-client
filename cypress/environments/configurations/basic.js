import {
  trackingOptions,
  searchBoxOptions,
  searchResultsOptions,
} from "./base.js";

const lupaSearch = window.lupaSearch;

lupaSearch.tracking(trackingOptions);
lupaSearch.searchBox(searchBoxOptions);
lupaSearch.searchResults(searchResultsOptions);
