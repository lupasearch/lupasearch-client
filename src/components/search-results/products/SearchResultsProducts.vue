<template>
  <div id="lupa-search-results-products">
    <spinner class="lupa-loader" v-if="loading && !isMobileSidebarVisible" />
    <template v-if="hasResults">
      <FiltersTopDropdown v-if="showTopFilters" :options="options.filters" />
      <SearchResultsToolbar
        class="lupa-toolbar-mobile"
        v-if="showMobileFilters"
        :options="options"
        pagination-location="top"
      />
      <CurrentFilters
        :class="currentFiltersClass"
        data-cy="lupa-search-result-filters-mobile-toolbar"
        v-if="currentFilterOptions"
        :options="currentFilterOptions"
        :expandable="!desktopFiltersExpanded"
      />
    </template>
    <AdditionalPanels
      :options="options"
      location="top"
      :sdkOptions="options.options"
    />
    <template v-if="hasResults">
      <SearchResultsToolbar
        class="lupa-toolbar-top"
        :options="options"
        pagination-location="top"
      />
      <div class="lupa-products" data-cy="lupa-products">
        <SearchResultsProductCard
          v-for="(product, index) in searchResult.items"
          :style="columnSize"
          :key="getProductKey(index, product)"
          :product="product"
          :options="productCardOptions()"
        />
      </div>
      <div
        class="lupa-empty-results"
        data-cy="lupa-no-results-in-page"
        v-if="isPageEmpty && options.labels.noItemsInPage"
      >
        {{ options.labels.noItemsInPage }}
        <span
          v-if="options.labels.backToFirstPage"
          class="lupa-empty-page-action"
          @click="goToFirstPage"
        >
          {{ options.labels.backToFirstPage }}</span
        >
      </div>
      <SearchResultsToolbar
        class="lupa-toolbar-bottom"
        :options="options"
        pagination-location="bottom"
      />
      <AdditionalPanels
        :options="options"
        location="bottom"
        :sdkOptions="options.options"
      />
    </template>
    <div
      class="lupa-empty-results"
      data-cy="lupa-no-results"
      v-else-if="!loading && currentQueryText"
    >
      {{ options.labels.emptyResults }} <span>{{ currentQueryText }}</span>
    </div>

    <div v-if="searchResult.similarQueries">
      <SearchResultsSimilarQueries
        :labels="similarQueriesLabels"
        :columnSize="columnSize"
        :productCardOptions="productCardOptions()"
      />
    </div>
    <slot name="append" />
  </div>
</template>
<script lang="ts">
import {
  ResultsLayout,
  ResultsLayoutEnum,
} from "@/types/search-results/ResultsLayout";
import {
  ResultCurrentFilterOptions,
  SearchResultsProductOptions,
  SearchResultsSimilarQueriesLabels,
} from "@/types/search-results/SearchResultsOptions";
import { SearchResultsProductCardOptions } from "@/types/search-results/SearchResultsProductCardOptions";
import { pick } from "@/utils/picker.utils";
import { Document, SearchQueryResult } from "@getlupa/client-sdk/Types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import AdditionalPanels from "../additional-panels/AdditionalPanels.vue";
import SearchResultsProductCard from "./product-card/SearchResultsProductCard.vue";
import SearchResultsToolbar from "./SearchResultsToolbar.vue";
import Spinner from "../../common/Spinner.vue";
import CurrentFilters from "../filters/CurrentFilters.vue";
import SearchResultsSimilarQueries from "./similar-queries/SearchResultsSimilarQueries.vue";
import { getProductKey } from "@/utils/string.utils";
import FiltersTopDropdown from "../filters/FiltersTopDropdown.vue";
import { QUERY_PARAMS } from "@/constants/queryParams.const";

const searchResult = namespace("searchResult");
const params = namespace("params");

@Component({
  name: "searchResultsProducts",
  components: {
    CurrentFilters,
    SearchResultsProductCard,
    SearchResultsToolbar,
    AdditionalPanels,
    Spinner,
    SearchResultsSimilarQueries,
    FiltersTopDropdown,
  },
})
export default class SearchResultsProducts extends Vue {
  @Prop() options!: SearchResultsProductOptions;

  @searchResult.State((state) => state.loading)
  loading!: boolean;

  @searchResult.Getter("hasResults") hasResults!: boolean;

  @searchResult.Getter("currentQueryText") currentQueryText!: string;

  @searchResult.Getter("isPageEmpty") isPageEmpty!: boolean;

  @searchResult.State((state) => state.isMobileSidebarVisible)
  isMobileSidebarVisible!: boolean;

  productCardOptions(): SearchResultsProductCardOptions {
    return pick(this.options, [
      "isInStock",
      "badges",
      "links",
      "elements",
      "labels",
      "queryKey",
      "idKey",
      "titleKey",
      "routingBehavior",
    ]);
  }

  get similarQueriesLabels(): SearchResultsSimilarQueriesLabels {
    return this.options.labels;
  }

  get showTopFilters(): boolean {
    return this.options.filters?.facets?.style?.type === "top-dropdown";
  }

  get showMobileFilters(): boolean {
    return this.options.searchTitlePosition !== "search-results-top";
  }

  get currentFilterToolbarVisible(): boolean {
    return (
      this.options.filters?.currentFilters?.visibility?.mobileToolbar ||
      this.options.filters?.currentFilters?.visibility?.desktopToolbar
    );
  }

  get currentFilterOptions(): ResultCurrentFilterOptions | undefined {
    return this.currentFilterToolbarVisible
      ? this.options.filters?.currentFilters
      : undefined;
  }

  get currentFiltersClass(): string {
    if (!this.currentFilterToolbarVisible) {
      return "";
    }
    if (
      this.options.filters?.currentFilters?.visibility?.mobileToolbar &&
      this.options.filters?.currentFilters?.visibility?.desktopToolbar
    ) {
      return "lupa-toolbar-filters";
    }

    return this.options.filters?.currentFilters?.visibility?.mobileToolbar
      ? "lupa-filters-mobile"
      : "lupa-toolbar-filters-desktop";
  }

  get desktopFiltersExpanded(): boolean {
    return (
      this.options?.filters?.currentFilters?.desktopToolbar
        ?.activeFiltersExpanded ?? false
    );
  }

  @searchResult.State((state) => state.columnCount)
  columnCount!: number;

  @searchResult.State((state) => state.searchResult)
  searchResult!: SearchQueryResult;

  @searchResult.State((state) => state.layout)
  layout!: ResultsLayout;

  @params.Getter("limit") limit!: number;
  @params.Getter("page") page!: number;

  get columnSize(): string {
    if (this.layout === ResultsLayoutEnum.LIST) {
      return "width: 100%";
    }
    return `width: ${100 / this.columnCount}%`;
  }

  getProductKey(index: string, product: Document): string {
    return getProductKey(index, product, this.options.idKey);
  }

  @params.Action("appendParams") appendParams!: ({
    params,
  }: {
    params: { name: string; value: string }[];
  }) => void;
  goToFirstPage(): void {
    this.appendParams({
      params: [{ name: QUERY_PARAMS.PAGE, value: "1" }],
    });
  }
}
</script>
