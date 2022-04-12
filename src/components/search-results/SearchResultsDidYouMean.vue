<template>
  <div
    v-if="searchResult.suggestedSearchText || didYouMeanValue"
    id="lupa-search-results-did-you-mean"
  >
    <div
      v-if="searchResult.suggestedSearchText"
      data-cy="suggested-search-text-label"
    >
      <span
        v-for="(label, index) in labels.noResultsSuggestion.split(' ')"
        :key="index"
      >
        <span :class="getStyle(label)">{{ insertValue(label) }} </span>
      </span>
    </div>
    <div v-if="didYouMeanValue" data-cy="did-you-mean-label">
      <span v-for="(label, index) in labels.didYouMean.split(' ')" :key="index">
        <span
          v-if="label.includes('{1}')"
          class="lupa-did-you-mean lupa-highlighted-search-text"
          data-cy="did-you-mean-value"
          @click="goToResults({ searchText: didYouMeanValue })"
          >{{ didYouMeanValue }}</span
        >
        <span v-else>{{ label }} </span>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { InputSuggestionFacet } from "@/types/search-box/Common";
import { QueryParams } from "@/types/search-results/QueryParams";
import { SearchResultsDidYouMeanLabels } from "@/types/search-results/SearchResultsOptions";
import { addParamsToLabel } from "@/utils/string.utils";
import { SearchQueryResult } from "@getlupa/client-sdk/Types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const searchResult = namespace("searchResult");
const params = namespace("params");

@Component({
  name: "searchResultsDidYouMean",
})
export default class SearchResultsDidYouMean extends Vue {
  @Prop({ default: "" }) labels!: SearchResultsDidYouMeanLabels;

  @searchResult.State((state) => state.searchResult)
  searchResult!: SearchQueryResult;

  get didYouMeanLabel(): string {
    return addParamsToLabel(
      this.labels.didYouMean,
      this.searchResult.didYouMean
    );
  }

  get didYouMeanValue(): string {
    return this.searchResult.didYouMean?.options[0].text || "";
  }

  insertValue(text: string): string {
    if (text.includes("{1}")) {
      return addParamsToLabel(text, this.searchResult.searchText);
    }
    return text;
  }

  getStyle(text: string): string {
    if (text.includes("{1}")) {
      return "lupa-highlighted-search-text";
    }
    return "";
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
