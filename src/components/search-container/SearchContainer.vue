<template>
  <div
    class="lupa-search-container-overlay"
    @click.stop.prevent="$emit('close')"
  >
    <div class="lupa-search-container" @click.stop="innerClick">
      <div class="lupa-search-box-container">
        <SearchBox
          :options="fullSearchBoxOptions"
          :is-search-container="true"
          ref="searchBox"
          @close="$emit('close')"
        />
      </div>

      <SearchResults :options="fullSearchResultsOptions" ref="searchResults" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SearchResults from "../search-results/SearchResults.vue";
import { SearchContainerOptions } from "@/types/search-container/SearchContainerOptions";
import { cloneDeep, merge } from "lodash";
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";
import { SearchResultsOptions } from "@/types/search-results/SearchResultsOptions";
import { SearchBoxOptions } from "@/types/search-box/SearchBoxOptions";
import { DEFAULT_SEARCH_BOX_OPTIONS } from "@/constants/searchBox.const";
import SearchBox from "../search-box/SearchBox.vue";
import { namespace } from "vuex-class";

const params = namespace("params");

@Component({
  name: "productList",
  components: {
    SearchResults,
    SearchBox,
  },
})
export default class SearchContainer extends Vue {
  @Prop() options!: SearchContainerOptions;
  @params.Action("removeParams") removeParams!: ({
    paramsToRemove,
  }: {
    paramsToRemove: string;
  }) => void;

  get fullSearchResultsOptions(): SearchResultsOptions {
    const options = cloneDeep(this.options.searchResults);
    return merge(DEFAULT_OPTIONS_RESULTS, options);
  }

  get fullSearchBoxOptions(): SearchBoxOptions {
    const options = cloneDeep(this.options.searchBox);
    return merge(DEFAULT_SEARCH_BOX_OPTIONS, options);
  }

  fetch(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs.searchResults as any)?.handleMounted();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs.searchBox as any)?.handleMounted();
  }

  innerClick(): void {
    // do nothing
  }

  beforeDestroy(): void {
    this.removeParams({ paramsToRemove: "all" });
  }
}
</script>
