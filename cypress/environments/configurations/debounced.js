import {
  trackingOptions,
  searchBoxOptions,
  searchResultsOptions,
} from "./base.js";

const getLupa = window.getLupa;

getLupa.tracking(trackingOptions);
getLupa.searchBox({ ...searchBoxOptions, debounce: 750 });
getLupa.searchResults(searchResultsOptions);
