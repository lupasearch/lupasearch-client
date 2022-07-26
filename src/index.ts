/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import Vuex from "vuex";
import SearchBoxEntry from "./SearchBoxEntry.vue";
import SearchResultsEntry from "./SearchResultsEntry.vue";
import ProductListEntry from "./ProductListEntry.vue";
import { SearchBoxOptions } from "./types/search-box/SearchBoxOptions";
import {
  CallbackContext,
  FacetFilterQuery,
  FacetStyle,
  ResultFacetOptions,
  SearchResultEventCallbacks,
  SearchResultsFilterOptions,
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
import {
  CategoryFilterOptions,
  ProductListOptions,
} from "./types/product-list/ProductListOptions";
import {
  AddToCartElement,
  CustomDocumentElement,
  CustomHtmlElement,
  DescriptionDocumentElement,
  DocumentElement,
  DocumentElementType,
  ImageDocumentElement,
  PriceElement,
  RatingElement,
  RegularPriceDocumentElement,
  TitleDocumentElement,
} from "./types/DocumentElement";
import { SearchBoxPanelType } from "./types/search-box/SearchBoxPanel";
import { RoutingBehavior } from "./types/search-results/RoutingBehavior";
import { AnchorPosition } from "./types/search-results/SearchResultsProductCardOptions";
import {
  BadgeGenerateOptions,
  BadgeGenerateSeed,
  BadgeOptions,
  BadgeType,
  SearchResultBadgeElement,
  SearchResultBadgeType,
} from "./types/search-results/BadgeOptions";
import {
  SearchResultsSortOptions,
  SortOptions,
} from "./types/search-results/SearchResultsSort";

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
  clearSearchResults();
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
  clearProductList();
  Vue.use(Vuex);
  app.productList = new Vue({
    el: options.containerSelector,
    components: { ProductListEntry },
    render: (h) =>
      h(ProductListEntry, { props: { productListOptions: options } }),
    store,
  });
};

const clearSearchBox = (): void => {
  try {
    (app.box as unknown as any)?.$destroy();
  } catch {
    // do nothing, already destroyed;
  }
};

const clearSearchResults = (): void => {
  try {
    (app.results as unknown as any)?.$destroy();
  } catch {
    // do nothing, already destroyed;
  }
};

const clearProductList = (): void => {
  try {
    (app.productList as unknown as any)?.$destroy();
  } catch {
    // do nothing, already destroyed;
  }
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
  DocumentElement,
  ImageDocumentElement,
  TitleDocumentElement,
  DescriptionDocumentElement,
  CustomDocumentElement,
  PriceElement,
  RegularPriceDocumentElement,
  RatingElement,
  AddToCartElement,
  CustomHtmlElement,
  SortOptions,
  SearchResultsSortOptions,
  SearchResultEventCallbacks,
  CallbackContext,
  FacetFilterQuery,
  CategoryFilterOptions,
  SearchResultsFilterOptions,
  SearchResultBadgeType,
  SearchResultBadgeElement,
  ResultFacetOptions,
  BadgeGenerateSeed,
  BadgeGenerateOptions,
  BadgeOptions,
};

export default lupaSearch;
