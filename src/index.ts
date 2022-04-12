/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import Vuex from "vuex";
import SearchBoxEntry from "./SearchBoxEntry.vue";
import SearchResultsEntry from "./SearchResultsEntry.vue";
import { SearchBoxOptions } from "./types/search-box/SearchBoxOptions";
import { SearchResultsOptions } from "./types/search-results/SearchResultsOptions";
import store from "./store";
import { TrackingOptions } from "./types/General";
import { initTracking } from "./utils/tracking.utils";

const app = {
  box: {},
  results: {},
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

const clearSearchBox = (): void => {
  (app.box as unknown as any)?.$destroy();
};

const clearSearchResults = (): void => {
  (app.results as unknown as any)?.$destroy();
};

const lupaSearch = {
  searchBox,
  searchResults,
  tracking,
  clearSearchBox,
  clearSearchResults,
};

export default lupaSearch;
