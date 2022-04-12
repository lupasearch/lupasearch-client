<template>
  <div
    id="lupa-search-results-page-select"
    data-cy="lupa-search-results-page-select"
  >
    <div
      v-if="options.selectedPage > 1"
      class="lupa-page-arrow"
      @click="() => handlePageChange(options.selectedPage - 1)"
    >
      &#60;
    </div>
    <div
      v-for="page in pages"
      :key="page"
      @click="() => handlePageChange(page)"
      :class="[
        'lupa-page-number',
        page === options.selectedPage ? 'lupa-page-number-selected' : '',
      ]"
      data-cy="lupa-page-number"
    >
      {{ page }}
    </div>
    <div
      v-if="options.selectedPage < options.count"
      :class="label === '>' ? 'lupa-page-arrow' : 'lupa-show-more'"
      data-cy="lupa-show-more"
      @click="() => handlePageChange(options.selectedPage + 1)"
    >
      {{ label }}
    </div>
  </div>
</template>
<script lang="ts">
import { QUERY_PARAMS } from "@/constants/queryParams.const";
import { PaginationPageSelect } from "@/types/search-results/PaginationOptions";
import { QueryParams } from "@/types/search-results/QueryParams";
import { scrollToSearchResults } from "@/utils/scroll.utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const params = namespace("params");

@Component({
  name: "searchResultsPageSelect",
})
export default class SearchResultsPageSelect extends Vue {
  @Prop({ default: ">" }) label!: string;
  @Prop({ default: {} }) options!: PaginationPageSelect;

  get pages(): number[] {
    const delta = Math.floor(this.options.display / 2),
      left = this.options.selectedPage - delta,
      right = this.options.selectedPage + (this.options.display - delta);

    return Array.from({ length: this.options.count }, (v, k) => k + 1).filter(
      (i) => i && i >= left && i < right
    );
  }

  @params.Action("appendParams") appendParams!: ({
    params,
    paramsToRemove,
  }: {
    params: { name: string; value: string }[];
    paramsToRemove?: string[];
  }) => { params: QueryParams };
  handlePageChange(page: number): void {
    if (page > 0) {
      this.appendParams({
        params: [{ name: QUERY_PARAMS.PAGE, value: page.toString() }],
      });
      scrollToSearchResults();
    }
  }
}
</script>
