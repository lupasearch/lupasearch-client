/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import Vuex from "vuex";
import SearchBoxEntry from "./SearchBoxEntry.vue";
import SearchResultsEntry from "./SearchResultsEntry.vue";
import ProductListEntry from "./ProductListEntry.vue";
import SearchContainerEntry from "./SearchContainerEntry.vue";
import { SearchBoxOptions } from "./types/search-box/SearchBoxOptions";
import {
  CallbackContext,
  DynamicData,
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
  SingleStarRatingElement,
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
import { CombinedVueInstance } from "vue/types/vue";
import {
  SearchContainerConfigOptions,
  SearchContainerOptions,
} from "./types/search-container/SearchContainerOptions";
import { attatchShadowDom, createShadowDom } from "./utils/shadowDom.utils";
import { DEFAULT_CONTAINER_STYLE } from "./constants/global.const";

type AppInstance = Record<
  string,
  CombinedVueInstance<
    Vue,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<never, any>
  >
>;
type AppInstances = Record<
  "box" | "results" | "productList" | "searchContainer",
  AppInstance
>;

type MountOptions = { fetch: boolean };

const app: AppInstances = {
  box: {},
  results: {},
  productList: {},
  searchContainer: {},
};

const tracking = (options: TrackingOptions): void => {
  initTracking(options);
};

const applySearchBox = (
  options: SearchBoxOptions,
  mountOptions?: MountOptions
): void => {
  const existingInstance = app.box[options.inputSelector];
  if (existingInstance) {
    existingInstance.searchBoxOptions = options;
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.fetch?.();
      });
    }
    return;
  }
  Vue.use(Vuex);
  const SearchBoxEntryComponent = Vue.component(
    "SearchBoxEntry",
    SearchBoxEntry
  );
  const instance = new SearchBoxEntryComponent({
    el: options.inputSelector,
    propsData: { searchBoxOptions: options },
    store,
  });
  app.box[options.inputSelector] = instance;
};

const searchBox = (
  options: SearchBoxOptions,
  mountOptions?: MountOptions
): void => {
  // Support for multiple search box selectors separated by a comma
  // Quite often multiple search boxes are required, since mobile and desktop has different inputs in html layout
  const inputs = options.inputSelector?.split(",");
  for (const input of inputs) {
    applySearchBox({ ...options, inputSelector: input.trim() }, mountOptions);
  }
};

const searchResults = (
  options: SearchResultsOptions,
  mountOptions?: MountOptions
): void => {
  const existingInstance = app.results[options.containerSelector];
  if (existingInstance) {
    existingInstance.searchResultsOptions = options;
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.fetch?.();
      });
    }
    return;
  }
  Vue.use(Vuex);
  const SearchResultsEntryComponent = Vue.component(
    "SearchResultsEntry",
    SearchResultsEntry
  );
  const instance = new SearchResultsEntryComponent({
    el: options.containerSelector,
    propsData: { searchResultsOptions: options },
    store,
  });
  app.results[options.containerSelector] = instance;
};

const productList = (
  options: ProductListOptions,
  mountOptions?: MountOptions
): void => {
  const existingInstance = app.productList[options.containerSelector];
  if (existingInstance) {
    existingInstance.productListOptions = options;
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.fetch?.();
      });
    }
    return;
  }
  Vue.use(Vuex);
  const ProductListEntryComponent = Vue.component(
    "ProductListEntry",
    ProductListEntry
  );
  const instance = new ProductListEntryComponent({
    el: options.containerSelector,
    propsData: { productListOptions: options },
    store,
  });
  app.productList[options.containerSelector] = instance;
};

const searchContainer = (
  options: SearchContainerOptions,
  mountOptions?: MountOptions
): void => {
  const existingInstance = app.searchContainer[options.trigger];
  if (existingInstance) {
    existingInstance.searchContainerOptions = options;
    existingInstance.reloadOptions();
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.fetch?.();
      });
    }
    return;
  }
  Vue.use(Vuex);
  const id = "lupa-search-container-manager";
  const shadowId = "lupa-shadow-id";
  const { host, manager } = createShadowDom(shadowId, id);
  attatchShadowDom({
    host,
    manager,
    styleUrl: options.options?.styleLink ?? DEFAULT_CONTAINER_STYLE,
    options: options.options,
  });
  document.body.appendChild(host);
  const SearchContainerEntryComponent = Vue.component(
    "SearchContainerEntry",
    SearchContainerEntry
  );
  const instance = new SearchContainerEntryComponent({
    el: manager,
    propsData: { searchContainerOptions: options },
    store,
  });
  app.searchContainer[options.trigger] = instance;
};

const clearSearchBox = (selector?: string): void => {
  try {
    if (selector) {
      const instance = app.box[selector];
      instance?.$destroy();
      return;
    }
    for (const key in app.box) {
      const instance = app.box[key];
      instance?.$destroy();
    }
    app.box = {};
  } catch {
    // do nothing, already destroyed;
  }
};

const clearSearchResults = (selector?: string): void => {
  try {
    if (selector) {
      const instance = app.results[selector];
      instance?.$destroy();
      return;
    }
    for (const key in app.results) {
      const instance = app.results[key];
      instance?.$destroy();
    }
    app.results = {};
  } catch {
    // do nothing, already destroyed;
  }
};

const clearProductList = (selector?: string): void => {
  try {
    if (selector) {
      const instance = app.productList[selector];
      instance?.$destroy();
      return;
    }
    for (const key in app.productList) {
      const instance = app.productList[key];
      instance?.$destroy();
    }
    app.productList = {};
  } catch {
    // do nothing, already destroyed;
  }
};

const clearSearchContainer = (selector?: string): void => {
  try {
    if (selector) {
      const instance = app.searchContainer[selector];
      instance?.$destroy();
      return;
    }
    for (const key in app.searchContainer) {
      const instance = app.searchContainer[key];
      instance?.$destroy();
    }
    app.searchContainer = {};
  } catch {
    // do nothing, already destroyed;
  }
};

const lupaSearch = {
  searchBox,
  searchResults,
  tracking,
  productList,
  searchContainer,
  clearSearchBox,
  clearSearchResults,
  clearProductList,
  clearSearchContainer,
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
  MountOptions,
  SearchContainerOptions,
  SearchContainerConfigOptions,
  SingleStarRatingElement,
  DynamicData,
};

export default lupaSearch;
