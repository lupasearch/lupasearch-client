import {
  trackingOptions,
  searchBoxOptions,
  searchResultsOptions,
} from "./base.js";

const lupaSearch = window.lupaSearch;

lupaSearch.tracking(trackingOptions);
lupaSearch.searchBox({
  ...searchBoxOptions,
  searchTriggers: ["#trigger1", "#trigger2"],
  minInputLength: 3,
});
lupaSearch.searchResults(searchResultsOptions);
