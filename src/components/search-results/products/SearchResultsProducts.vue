<template>
  <div
    id="lupa-search-results-products"
    :style="{ display: isMobileSidebarVisible ? 'none' : 'block' }"
  >
    <spinner class="lupa-loader" v-if="loading && !isMobileSidebarVisible" />
    <template v-if="hasResults">
      <FiltersTopDropdown v-if="showTopFilters" :options="options.filters" />
      <SearchResultsToolbar
        class="lupa-toolbar-mobile"
        :sortOptions="sortOptions"
        :paginationOptions="paginationOptions"
        :paginationDisplay="topPagination"
        :showLayoutSelection="options.toolbar.layoutSelector"
        :showItemSummary="options.toolbar.itemSummary"
        :options="options"
      />
      <CurrentFilters
        class="lupa-filters-mobile"
        data-cy="lupa-search-result-filters-mobile-toolbar"
        v-if="currentFilterOptions"
        :options="currentFilterOptions"
        :expandable="true"
      />
      <AdditionalPanels
        :options="options"
        location="top"
        :sdkOptions="options.options"
      />
      <SearchResultsToolbar
        class="lupa-toolbar-top"
        :sortOptions="sortOptions"
        :paginationOptions="paginationOptions"
        :paginationDisplay="topPagination"
        :showLayoutSelection="options.toolbar.layoutSelector"
        :showItemSummary="options.toolbar.itemSummary"
        :showFilterClear="options.toolbar.clearFilters"
        :options="options"
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
      <SearchResultsToolbar
        class="lupa-toolbar-bottom"
        :paginationOptions="paginationOptions"
        :paginationDisplay="bottomPagination"
        :options="options"
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
  </div>
</template>
<script lang="ts">
import {
  PaginationDisplay,
  PaginationOptions,
} from "@/types/search-results/PaginationOptions";
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
import { SortOptions } from "@/types/search-results/SearchResultsSort";
import { getPageCount, pick } from "@/utils/picker.utils";
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
    ]);
  }

  get similarQueriesLabels(): SearchResultsSimilarQueriesLabels {
    return pick(this.options.labels, ["similarQuery", "similarQueries"]);
  }

  get showTopFilters(): boolean {
    return this.options.filters?.facets?.style?.type === "top-dropdown";
  }

  get currentFilterOptions(): ResultCurrentFilterOptions | undefined {
    return this.options.filters?.currentFilters?.visibility?.mobileToolbar
      ? this.options.filters?.currentFilters
      : undefined;
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

  get sortOptions(): SortOptions {
    return {
      label: this.options.labels.sortBy,
      options: this.options.sort,
    };
  }

  get paginationOptions(): PaginationOptions {
    const pageSize = this.options.pagination.sizeSelection;
    const pageSelect = this.options.pagination.pageSelection;

    return {
      pageSize: {
        sizes: pageSize.sizes,
        selectedSize: this.limit,
      },
      pageSelect: {
        count: getPageCount(this.searchResult.total, this.limit),
        selectedPage: this.page,
        display: pageSelect.display,
      },
      labels: this.options.labels,
    };
  }

  get topPagination(): PaginationDisplay {
    return {
      pageSize: this.options.pagination.sizeSelection.position.top,
      pageSelect: this.options.pagination.pageSelection.position.top,
    };
  }

  get bottomPagination(): PaginationDisplay {
    return {
      pageSize: this.options.pagination.sizeSelection.position.bottom,
      pageSelect: this.options.pagination.pageSelection.position.bottom,
    };
  }

  getProductKey(index: string, product: Document): string {
    return getProductKey(index, product, this.options.idKey);
  }
}
</script>
