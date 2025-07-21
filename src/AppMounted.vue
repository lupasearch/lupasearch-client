<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { merge } from './utils/merger.utils'
import { SEARCH_BOX_CONFIGURATION } from './constants/development/searchBoxDev.const'
import { SEARCH_RESULTS_CONFIGURATION } from './constants/development/searchResultsDev.const'
import { DEFAULT_SEARCH_BOX_OPTIONS } from './constants/searchBox.const'
import { DEFAULT_OPTIONS_RESULTS } from './constants/searchResults.const'
import { SearchBoxOptions, SearchResultsOptions } from '@getlupa/vue'
import '@getlupa/vue/dist/style.css'
import lupaSearch from '.'

const fullSearchBoxOptions = computed((): SearchBoxOptions => {
  return merge(DEFAULT_SEARCH_BOX_OPTIONS, SEARCH_BOX_CONFIGURATION as unknown as SearchBoxOptions)
})

const fullSearchResultsOptions = computed((): SearchResultsOptions => {
  return merge(DEFAULT_OPTIONS_RESULTS, SEARCH_RESULTS_CONFIGURATION as unknown as SearchBoxOptions)
})

onMounted(() => {
  lupaSearch.searchBox(fullSearchBoxOptions.value)
  lupaSearch.searchResults(fullSearchResultsOptions.value, { mountingBehavior: 'append' })
})
</script>

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
      <input id="searchBox" type="text" />
    </div>
    <div class="result-wrapper">
      <div id="searchResultsContainer">
        <div class="inside"></div>
      </div>
    </div>
  </div>
</template>
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

.recommendations-wrapper {
  display: flex;
}
</style>
