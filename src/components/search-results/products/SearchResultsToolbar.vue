<template>
  <div id="lupa-search-results-toolbar">
    <div class="lupa-toolbar-left">
      <SearchResultsLayoutSelection v-if="showLayoutSelection" />
      <div v-else></div>

      <SearchResultsSummary
        v-if="showItemSummary"
        :label="searchSummaryLabel"
        :clearable="hasAnyFilter && showFilterClear"
        @clear="handleClearAll"
      />
      <div v-else></div>

      <SearchResultsPageSelect
        :options="paginationOptions.pageSelect"
        :label="paginationOptions.labels.showMore"
        v-if="displayPageSelect"
      />
      <div v-else></div>
    </div>
    <div class="lupa-toolbar-right">
      <SearchResultsMobileToggle
        :label="options.labels.mobileFilterButton"
        :show-filter-count="showMobileFilterCount"
      />
      <SearchResultsPageSize
        :options="paginationOptions.pageSize"
        :label="paginationOptions.labels.pageSize"
        v-if="paginationDisplay.pageSize"
      />
      <div v-else></div>
      <SearchResultsSort :options="sortOptions" v-if="sortOptions" />
      <div v-else></div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  PaginationDisplay,
  PaginationOptions,
} from "@/types/search-results/PaginationOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import SearchResultsPageSize from "./pagination/SearchResultsPageSize.vue";
import SearchResultsPageSelect from "./pagination/SearchResultsPageSelect.vue";
import SearchResultsSort from "./sort/SearchResultsSort.vue";
import { SortOptions } from "@/types/search-results/SearchResultsSort";
import SearchResultsLayoutSelection from "./SearchResultsLayoutSelection.vue";
import SearchResultsSummary from "./SearchResultsSummary.vue";
import SearchResultsMobileToggle from "./SearchResultsMobileToggle.vue";
import { SearchResultsProductOptions } from "@/types/search-results/SearchResultsOptions";
import { QueryParams } from "@/types/search-results/QueryParams";

const searchResult = namespace("searchResult");
const params = namespace("params");

@Component({
  name: "searchResultsToolbar",
  components: {
    SearchResultsPageSize,
    SearchResultsPageSelect,
    SearchResultsSort,
    SearchResultsLayoutSelection,
    SearchResultsSummary,
    SearchResultsMobileToggle,
  },
})
export default class SearchResultsToolbar extends Vue {
  @Prop({ default: () => ({ labels: {} }) })
  options!: SearchResultsProductOptions;
  @Prop({ default: () => ({}) }) paginationOptions!: PaginationOptions;
  @Prop({ default: () => ({}) }) paginationDisplay!: PaginationDisplay;
  @Prop({ default: null }) sortOptions!: SortOptions;
  @Prop({ default: false }) showLayoutSelection!: boolean;
  @Prop({ default: false }) showItemSummary!: boolean;
  @Prop({ default: false }) showFilterClear!: boolean;

  @searchResult.Getter("hasAnyFilter") hasAnyFilter!: boolean;

  get displayPageSelect(): boolean {
    return (
      this.paginationDisplay.pageSelect &&
      this.paginationOptions.pageSelect.count > 0 &&
      this.paginationOptions.pageSelect.count >=
        this.paginationOptions.pageSelect.selectedPage
    );
  }

  get searchSummaryLabel(): string {
    const defaultLabel = this.paginationOptions?.labels?.itemCount ?? "";
    return !this.hasAnyFilter || !this.showFilterClear
      ? defaultLabel
      : this.paginationOptions?.labels?.filteredItemCount ?? defaultLabel;
  }

  get showMobileFilterCount(): boolean {
    return Boolean(
      this.options.filters?.currentFilters?.mobileSidebar?.showFilterCount
    );
  }

  @params.Action("removeAllFilters") removeAllFilters!: () => {
    params: QueryParams;
  };
  handleClearAll = (): void => {
    this.removeAllFilters();
  };
}
</script>
