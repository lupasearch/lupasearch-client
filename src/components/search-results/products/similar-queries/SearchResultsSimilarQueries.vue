<template>
  <div
    id="lupa-search-results-similar-queries"
    data-cy="lupa-search-results-similar-queries"
  >
    <div class="lupa-similar-queries-label">{{ labels.similarQueries }}</div>
    <div v-for="(similarQuery, index) in similarQueries" :key="index">
      <div class="lupa-similar-query-label" data-cy="lupa-similar-query-label">
        <span
          v-for="(label, index) in labels.similarQuery.split(' ')"
          :key="index"
        >
          <span
            v-if="label.includes('{1}')"
            @click="goToResults({ searchText: similarQuery.query })"
            class="lupa-similar-query-value lupa-similar-query-link"
            data-cy="lupa-similar-query-value"
          >
            <SimilarQueryText :label="label" :similarQuery="similarQuery" />
          </span>
          <span v-else>{{ label }} </span>
        </span>
      </div>

      <div class="lupa-products" data-cy="lupa-products">
        <SearchResultsProductCard
          v-for="(product, index) in similarQuery.items"
          :style="columnSize"
          :key="getProductKey(index, product)"
          :product="product"
          :options="productCardOptions"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { InputSuggestionFacet } from "@/types/search-box/Common";
import { QueryParams } from "@/types/search-results/QueryParams";
import { SearchResultsSimilarQueriesLabels } from "@/types/search-results/SearchResultsOptions";
import { SearchResultsProductCardOptions } from "@/types/search-results/SearchResultsProductCardOptions";
import { getProductKey } from "@/utils/string.utils";
import { Document, SimilarQueryResult } from "@getlupa/client-sdk/Types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import SearchResultsProductCard from "../product-card/SearchResultsProductCard.vue";
import SimilarQueryText from "./SimilarQueryText.vue";

const searchResult = namespace("searchResult");
const params = namespace("params");

@Component({
  name: "searchResultsSimilarQueries",
  components: { SearchResultsProductCard, SimilarQueryText },
})
export default class SearchResultsSimilarQueries extends Vue {
  @Prop({ default: "" }) labels!: SearchResultsSimilarQueriesLabels;
  @Prop({ default: "" }) columnSize!: string;
  @Prop({ default: {} }) productCardOptions!: SearchResultsProductCardOptions;

  @searchResult.State((state) => state.searchResult.similarQueries)
  similarQueries!: SimilarQueryResult[];

  getProductKey(index: string, product: Document): string {
    return getProductKey(index, product, this.productCardOptions.idKey);
  }

  @params.Action("goToResults") goToResults!: ({
    searchText,
    facet,
  }: {
    searchText: string;
    facet?: InputSuggestionFacet;
  }) => { params: QueryParams };
}
</script>
