<template>
  <SearchResults :options="fullSearchResultsOptions" ref="searchResults" />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import cloneDeep from "lodash.clonedeep";
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
    const options = cloneDeep(this.searchResultsOptions);
    return merge(DEFAULT_OPTIONS_RESULTS, options);
  }

  fetch(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs.searchResults as any)?.handleMounted();
  }
}
</script>
