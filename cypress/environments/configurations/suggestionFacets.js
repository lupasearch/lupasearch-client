import {
  trackingOptions,
  searchBoxOptions,
  searchResultsOptions,
} from "./base.js";

const lupaSearch = window.lupaSearch;

lupaSearch.tracking(trackingOptions);
lupaSearch.searchBox({
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

lupaSearch.searchResults(searchResultsOptions);
