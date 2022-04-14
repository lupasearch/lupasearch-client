import {
  trackingOptions,
  searchBoxOptions,
  searchResultsOptions,
} from "./base.js";

const getLupa = window.getLupa;

getLupa.tracking(trackingOptions);
getLupa.searchBox({
  ...searchBoxOptions,
  panels: [
    {
      type: "suggestion",
      queryKey: "facet-suggestion",
      highlight: true,
      limit: 5,
    },
  ],
});

getLupa.searchResults(searchResultsOptions);
