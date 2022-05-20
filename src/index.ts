/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import Vuex from "vuex";
import SearchBoxEntry from "./SearchBoxEntry.vue";
import SearchResultsEntry from "./SearchResultsEntry.vue";
import ProductListEntry from "./ProductListEntry.vue";
import { SearchBoxOptions } from "./types/search-box/SearchBoxOptions";
import {
  FacetStyle,
  SearchResultsOptions,
} from "./types/search-results/SearchResultsOptions";
import store from "./store";
import {
  SdkOptions,
  TrackingOptions,
  Environment,
  SortDirection,
} from "./types/General";
import { initTracking } from "./utils/tracking.utils";
import { ProductListOptions } from "./types/product-list/ProductListOptions";
import { DocumentElementType } from "./types/DocumentElement";
import { SearchBoxPanelType } from "./types/search-box/SearchBoxPanel";
import { RoutingBehavior } from "./types/search-results/RoutingBehavior";
import { AnchorPosition } from "./types/search-results/SearchResultsProductCardOptions";
import { BadgeType } from "./types/search-results/BadgeOptions";

const app = {
  box: {},
  results: {},
  productList: {},
};

const tracking = (options: TrackingOptions): void => {
  initTracking(options);
};

const searchBox = (options: SearchBoxOptions): void => {
  Vue.use(Vuex);
  app.box = new Vue({
    el: options.inputSelector,
    components: { SearchBoxEntry },
    render: (h) => h(SearchBoxEntry, { props: { searchBoxOptions: options } }),
    store,
  });
};
const searchResults = (options: SearchResultsOptions): void => {
  Vue.use(Vuex);
  app.results = new Vue({
    el: options.containerSelector,
    components: { SearchResultsEntry },
    render: (h) =>
      h(SearchResultsEntry, { props: { searchResultsOptions: options } }),
    store,
  });
};
const productList = (options: ProductListOptions): void => {
  Vue.use(Vuex);
  app.results = new Vue({
    el: options.containerSelector,
    components: { ProductListEntry },
    render: (h) =>
      h(ProductListEntry, { props: { productListOptions: options } }),
    store,
  });
};

const clearSearchBox = (): void => {
  (app.box as unknown as any)?.$destroy();
};

const clearSearchResults = (): void => {
  (app.results as unknown as any)?.$destroy();
};

const clearProductList = (): void => {
  (app.productList as unknown as any)?.$destroy();
};

const lupaSearch = {
  searchBox,
  searchResults,
  tracking,
  productList,
  clearSearchBox,
  clearSearchResults,
  clearProductList,
};

export {
  TrackingOptions,
  SearchBoxOptions,
  SearchResultsOptions,
  ProductListOptions,
  SdkOptions,
  DocumentElementType,
  SearchBoxPanelType,
  FacetStyle,
  Environment,
  RoutingBehavior,
  AnchorPosition,
  BadgeType,
  SortDirection,
};

export default lupaSearch;
