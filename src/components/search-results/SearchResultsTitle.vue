<template>
  <div>
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
    <SearchResultsSummary v-if="showSummary" :label="summaryLabel" />
    <div
      class="lupa-result-page-description-top"
      v-if="descriptionTop"
      v-html="descriptionTop"
    ></div>
  </div>
</template>
<script lang="ts">
import { SearchResultsOptions } from "@/types/search-results/SearchResultsOptions";
import { addParamsToLabel } from "@/utils/string.utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import SearchResultsSummary from "./products/SearchResultsSummary.vue";

const searchResult = namespace("searchResult");

@Component({
  name: "SearchResultsTitle",
  components: {
    SearchResultsSummary,
  },
})
export default class SearchResultsTitle extends Vue {
  @Prop() options!: SearchResultsOptions;
  @Prop({ default: false }) isProductList!: boolean;
  @Prop({ default: false }) showSummary!: boolean;

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

  get descriptionTop(): string | undefined {
    return this.options.categories?.current?.descriptionTop;
  }

  get summaryLabel() {
    return this.options.labels?.itemCount ?? "";
  }

  getLabel(label: string): string {
    return addParamsToLabel(label, `'${this.currentQueryText}'`);
  }
}
</script>
