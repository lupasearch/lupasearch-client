<template>
  <SearchResults :options="fullSearchResultsOptions" />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SearchResults from "./components/search-results/SearchResults.vue";
import { DEFAULT_OPTIONS_RESULTS } from "./constants/searchResults.const";
import { SearchResultsOptions } from "./types/search-results/SearchResultsOptions";
import { merge } from "@/utils/merger.utils";

@Component({
  name: "searchResults",
  components: {
    SearchResults,
  },
})
export default class SearchResultsEntry extends Vue {
  @Prop() searchResultsOptions!: SearchResultsOptions;

  get fullSearchResultsOptions(): SearchResultsOptions {
    return merge(DEFAULT_OPTIONS_RESULTS, this.searchResultsOptions);
  }
}
</script>
