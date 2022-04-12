<template>
  <div id="app" class="wrapper">
    <!-- Following icon fonts are available during the plugin development only -->
    <!-- Include your own fonts and icons with your custom theme when deploying your plugin -->
    <link
      href="//db.onlinewebfonts.com/c/68590d1f06ad625cb73b5c34f85b4a1b?family=Luma-Icons"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css"
      rel="stylesheet"
    />
    <div class="box-wrapper">
      <SearchBox :options="fullSearchBoxOptions" />
    </div>
    <div class="result-wrapper">
      <SearchResults :options="fullSearchResultsOptions" />
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
import "../styles/clients/lupa/lupa";
import { SEARCH_BOX_CONFIGURATION } from "./constants/development/searchBoxDev.const";
import { SEARCH_RESULTS_CONFIGURATION } from "./constants/development/searchResultsDev.const";

@Component({
  name: "getLupa",
  components: {
    SearchBox,
    SearchResults,
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
}
</script>

<style lang="scss">
#app {
  height: auto;
  display: flex;
  flex-direction: column;
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

.result-wrapper {
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  max-width: 1050px;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
}
</style>
