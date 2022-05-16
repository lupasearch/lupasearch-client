import {
  trackingOptions,
  searchBoxOptions,
  searchResultsOptions,
} from "./base.js";

const getLupa = window.getLupa;

getLupa.tracking(trackingOptions);
getLupa.searchBox(searchBoxOptions);

getLupa.searchResults({
  ...searchResultsOptions,
  noResultsQueryFlag: "noResults",
});
