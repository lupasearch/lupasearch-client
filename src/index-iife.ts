import lupaSearch from "./index";
import { TrackingOptions } from "./types/General";
import { ProductListOptions } from "./types/product-list/ProductListOptions";
import { SearchBoxOptions } from "./types/search-box/SearchBoxOptions";
import { SearchResultsOptions } from "./types/search-results/SearchResultsOptions";

declare global {
  interface Window {
    getLupa: {
      searchBox: (options: SearchBoxOptions) => void;
      searchResults: (options: SearchResultsOptions) => void;
      tracking: (options: TrackingOptions) => void;
      productList: (options: ProductListOptions) => void;
      clearSearchBox: () => void;
      clearSearchResults: () => void;
      clearProductList: () => void;
    };
    lupaSearch: {
      searchBox: (options: SearchBoxOptions) => void;
      searchResults: (options: SearchResultsOptions) => void;
      tracking: (options: TrackingOptions) => void;
      productList: (options: ProductListOptions) => void;
      clearSearchBox: () => void;
      clearSearchResults: () => void;
      clearProductList: () => void;
    };
  }
}

window.getLupa = lupaSearch;
window.lupaSearch = lupaSearch;
