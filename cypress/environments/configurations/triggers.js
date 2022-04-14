import {
  trackingOptions,
  searchBoxOptions,
  searchResultsOptions,
} from "./base.js";

const getLupa = window.getLupa;

getLupa.tracking(trackingOptions);
getLupa.searchBox({
  ...searchBoxOptions,
  searchTriggers: ["#trigger1", "#trigger2"],
  minInputLength: 3,
});
getLupa.searchResults(searchResultsOptions);
