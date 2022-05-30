<template>
  <h1
    class="lupa-result-page-title"
    data-cy="lupa-result-page-title"
    v-if="showSearchTitle"
  >
    {{ options.labels.searchResults
    }}<span v-if="queryText">'{{ queryText }}'</span>
    <span v-if="showProductCount" class="lupa-results-total-count"
      >({{ totalItems }})</span
    >
  </h1>
</template>
<script lang="ts">
import { SearchResultsOptions } from "@/types/search-results/SearchResultsOptions";
import { addParamsToLabel } from "@/utils/string.utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const searchResult = namespace("searchResult");

@Component({
  name: "SearchResultsTitle",
})
export default class SearchResultsTitle extends Vue {
  @Prop() options!: SearchResultsOptions;
  @Prop({ default: false }) isProductList!: boolean;

  @searchResult.Getter("currentQueryText") currentQueryText!: string;
  @searchResult.Getter("totalItems") totalItems!: number;

  @searchResult.State((state) => state.searchResult.suggestedSearchText)
  suggestedSearchText!: string;

  get queryText(): string {
    return this.suggestedSearchText || this.currentQueryText;
  }

  get showProductCount(): boolean {
    return Boolean(this.options.toolbar?.totalCount);
  }

  get showSearchTitle(): boolean {
    return Boolean(
      this.options.labels?.searchResults &&
        (this.currentQueryText || this.isProductList)
    );
  }

  getLabel(label: string): string {
    return addParamsToLabel(label, `'${this.currentQueryText}'`);
  }
}
</script>
