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
        :last-page-label="paginationOptions.labels.showMore"
        :first-page-label="paginationOptions.labels.showLess"
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
import { SearchQueryResult } from "@getlupa/client-sdk/Types";
import { getPageCount } from "@/utils/picker.utils";

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
  @Prop({ default: "top" }) paginationLocation!: "top" | "bottom";

  @params.Getter("limit") limit!: number;
  @params.Getter("page") page!: number;

  @searchResult.Getter("hasAnyFilter") hasAnyFilter!: boolean;
  @searchResult.State((state) => state.searchResult)
  searchResult!: SearchQueryResult;

  get isBottomLocation(): boolean {
    return this.paginationLocation === "bottom";
  }

  get showFilterClear(): boolean {
    return this.isBottomLocation
      ? false
      : Boolean(this.options.toolbar?.clearFilters);
  }

  get showItemSummary(): boolean {
    return this.isBottomLocation
      ? false
      : Boolean(this.options.toolbar?.itemSummary);
  }

  get showLayoutSelection(): boolean {
    return this.isBottomLocation
      ? false
      : Boolean(this.options.toolbar?.layoutSelector);
  }

  get sortOptions(): SortOptions | undefined {
    if (this.isBottomLocation) {
      return undefined;
    }
    return {
      label: this.options.labels.sortBy,
      options: this.options.sort,
    };
  }

  get paginationDisplay(): PaginationDisplay {
    if (this.paginationLocation === "top") {
      return {
        pageSize: this.options.pagination.sizeSelection.position.top,
        pageSelect: this.options.pagination.pageSelection.position.top,
      };
    } else {
      return {
        pageSize: this.options.pagination.sizeSelection.position.bottom,
        pageSelect: this.options.pagination.pageSelection.position.bottom,
      };
    }
  }

  get paginationOptions(): PaginationOptions {
    const pageSize = this.options.pagination.sizeSelection;
    const pageSelect = this.options.pagination.pageSelection;
    const r = {
      pageSize: {
        sizes: pageSize.sizes,
        selectedSize: this.limit,
      },
      pageSelect: {
        count: getPageCount(this.searchResult.total, this.limit),
        selectedPage: this.page,
        display: pageSelect.display,
        displayMobile: pageSelect.displayMobile,
      },
      labels: this.options.labels,
    };
    return r;
  }

  get displayPageSelect(): boolean {
    return (
      this.paginationDisplay.pageSelect &&
      this.paginationOptions.pageSelect.count > 0
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
