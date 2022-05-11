<template>
  <div class="lupa-search-result-wrapper">
    <MobileFilterSidebar v-if="options.filters" :options="options.filters" />
    <SearchResultsBreadcrumbs
      v-if="currentQueryText"
      :breadcrumbs="options.breadcrumbs"
    />
    <template v-if="isTopTitlePosition">
      <div class="top-layout-wrapper">
        <SearchResultsFilters
          v-if="showFilterSidebar"
          :options="options.filters"
        />
        <div class="search-content">
          <SearchResultsDidYouMean :labels="didYouMeanLabels" />
          <SearchResultsTitle :options="options" />
          <SearchResultsProducts :options="options" />
        </div>
      </div>
    </template>
    <template v-else>
      <SearchResultsDidYouMean :labels="didYouMeanLabels" />
      <SearchResultsTitle :options="options" />
      <div id="lupa-search-results">
        <SearchResultsFilters
          v-if="showFilterSidebar"
          :options="options.filters"
        />
        <SearchResultsProducts :options="options" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { QueryParams } from "@/types/search-results/QueryParams";
import {
  ProductGrid,
  SearchResultsDidYouMeanLabels,
  SearchResultsOptions,
  SearchResultsProductOptions,
} from "@/types/search-results/SearchResultsOptions";
import { parseParams } from "@/utils/params.utils";
import { pick } from "@/utils/picker.utils";
import { createPublicQuery } from "@/utils/query.utils";
import getLupaSdk from "@getlupa/client-sdk";
import { PublicQuery, SearchQueryResult } from "@getlupa/client-sdk/Types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import MobileFilterSidebar from "./filters/MobileFilterSidebar.vue";
import SearchResultsFilters from "./filters/SearchResultsFilters.vue";
import SearchResultsDidYouMean from "./SearchResultsDidYouMean.vue";
import SearchResultsProducts from "./products/SearchResultsProducts.vue";
import SearchResultsBreadcrumbs from "./SearchResultsBreadcrumbs.vue";
import { getLupaTrackingContext } from "@/utils/tracking.utils";
import SearchResultsTitle from "./SearchResultsTitle.vue";

const searchResult = namespace("searchResult");
const params = namespace("params");
const options = namespace("options");
const tracking = namespace("tracking");

@Component({
  name: "searchResults",
  components: {
    SearchResultsFilters,
    SearchResultsProducts,
    MobileFilterSidebar,
    SearchResultsBreadcrumbs,
    SearchResultsDidYouMean,
    SearchResultsTitle,
  },
})
export default class SearchResults extends Vue {
  @Prop() options!: SearchResultsOptions;

  get productsOptions(): SearchResultsProductOptions {
    return pick(this.options, [
      "grid",
      "labels",
      "queryKey",
      "options",
      "pagination",
      "sort",
      "isInStock",
      "badges",
      "links",
      "elements",
      "additionalPanels",
      "idKey",
      "filters",
    ]);
  }

  get didYouMeanLabels(): SearchResultsDidYouMeanLabels {
    return pick(this.options.labels, ["noResultsSuggestion", "didYouMean"]);
  }

  get showFilterSidebar(): boolean {
    return this.options.filters?.facets?.style?.type === "sidebar";
  }

  get isTopTitlePosition(): boolean {
    return this.options.searchTitlePosition === "page-top";
  }

  @tracking.Action("trackSearch") trackSearch!: ({
    queryKey,
    query,
  }: {
    queryKey: string;
    query: PublicQuery;
  }) => void;

  @tracking.Action("trackResults") trackResults!: ({
    queryKey,
    results,
  }: {
    queryKey: string;
    results: SearchQueryResult;
  }) => void;

  @params.State("searchString") searchString!: string;

  @params.Action("setDefaultLimit") setDefaultLimit!: (
    defaultLimit: number
  ) => {
    defaultLimit: number;
  };

  @params.Action("add") addParams!: (params: QueryParams) => {
    params: QueryParams;
  };

  @options.Mutation("setSearchResultOptions") setSearchResultOptions!: ({
    options,
  }: {
    options: SearchResultsOptions;
  }) => void;

  mounted(): void {
    window.addEventListener("resize", this.handleResize);
    this.handleMounted();
    this.setSearchResultOptions({ options: this.options });
  }

  beforeDestroy(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  handleMounted(): void {
    this.handleResize();

    const params = new URLSearchParams(window.location.search);
    this.handleUrlChange(params);
    this.addParams(parseParams(params));

    this.setDefaultLimit(this.options.pagination.sizeSelection.sizes[0]);
  }

  @Watch("searchString")
  handleParamsChange(): void {
    this.handleUrlChange();
  }

  @searchResult.Action("add") addSearchResult!: (
    searchResult: SearchQueryResult
  ) => SearchQueryResult;

  @searchResult.Action("setLoading") setLoading!: (loading: boolean) => {
    loading: boolean;
  };

  handleUrlChange(params?: URLSearchParams): void {
    const searchParams = params || new URLSearchParams(window.location.search);
    const publicQuery = createPublicQuery(
      parseParams(searchParams),
      this.options.sort
    );
    if (publicQuery.searchText === undefined) {
      return;
    }
    this.setLoading(true);
    this.query(publicQuery);
  }

  query(publicQuery: PublicQuery): void {
    this.trackSearch({ queryKey: this.options.queryKey, query: publicQuery });
    const context = getLupaTrackingContext();
    const query = { ...publicQuery, ...context };
    getLupaSdk
      .query(this.options.queryKey, query, this.options.options)
      .then((res) => {
        if (res.success) {
          this.trackResults({ queryKey: this.options.queryKey, results: res });
          this.addSearchResult({ ...res });
        } else if (this.options?.options?.onError) {
          this.options.options.onError(res);
        }
      })
      .catch((err) => {
        console.error(err);
        if (this.options?.options?.onError) {
          this.options.options.onError(err);
        }
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  @searchResult.Action("setColumnCount") setColumnCount!: ({
    width,
    grid,
  }: {
    width: number;
    grid: ProductGrid;
  }) => {
    columnCount: number;
  };
  handleResize(): void {
    const doc = document.documentElement;
    doc.style.setProperty("--lupa-full-height", `${window.innerHeight}px`);
    this.setColumnCount({ width: window.innerWidth, grid: this.options.grid });
  }
}
</script>
