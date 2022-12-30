<template>
  <div id="app" class="wrapper">
    <div>
      <input type="text" class="trigger" placeholder="Click me to search!" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SearchBox from "./components/search-box/SearchBox.vue";
import SearchResults from "./components/search-results/SearchResults.vue";
import { DEFAULT_SEARCH_BOX_OPTIONS } from "./constants/searchBox.const";
import { DEFAULT_OPTIONS_RESULTS } from "./constants/searchResults.const";
import { SearchBoxOptions } from "./types/search-box/SearchBoxOptions";
import { SearchResultsOptions } from "./types/search-results/SearchResultsOptions";
import { merge } from "./utils/merger.utils";
import { SEARCH_BOX_CONFIGURATION } from "./constants/development/searchBoxDev.const";
import { SEARCH_RESULTS_CONFIGURATION } from "./constants/development/searchResultsDev.const";
import ProductList from "./components/product-list/ProductList.vue";
import SearchContainer from "./components/search-container/SearchContainer.vue";
import { SearchContainerOptions } from "./types/search-container/SearchContainerOptions";
import SearchContainerEntry from "./SearchContainerEntry.vue";
import lupaSearch from ".";

@Component({
  name: "getLupa",
  components: {
    SearchBox,
    SearchResults,
    ProductList,
    SearchContainer,
    SearchContainerEntry,
  },
})
export default class App extends Vue {
  get fullSearchBoxOptions(): SearchBoxOptions {
    return merge(
      DEFAULT_SEARCH_BOX_OPTIONS,
      SEARCH_BOX_CONFIGURATION as unknown as SearchBoxOptions
    );
  }

  get fullSearchResultsOptions(): SearchResultsOptions {
    return merge(
      DEFAULT_OPTIONS_RESULTS,
      SEARCH_RESULTS_CONFIGURATION as unknown as SearchBoxOptions
    );
  }

  get containerOptions(): SearchContainerOptions {
    return {
      trigger: ".trigger",
      searchBox: this.fullSearchBoxOptions,
      searchResults: this.fullSearchResultsOptions,
    };
  }

  mounted() {
    lupaSearch.searchContainer(this.containerOptions);
  }
}
</script>

<style lang="scss">
#app {
  height: auto;
  display: flex;
  flex-direction: column;
}

* {
  color: red !important;
}

.wrapper {
  margin: 10px;
}

.box-wrapper {
  width: 50%;
  margin: 20px auto;
  @media (max-width: 752px) {
    width: 95%;
    margin: 10px auto;
  }
}

.result-wrapper,
.list-wrapper {
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  // max-width: 1050px;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
}
</style>
