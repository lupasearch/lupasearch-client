<template>
  <div class="lupa-search-result-wrapper">
    <MobileFilterSidebar v-if="options.filters" :options="options.filters" />
    <SearchResultsBreadcrumbs
      v-if="currentQueryText"
      :breadcrumbs="options.breadcrumbs"
    />
    <SearchResultsDidYouMean :labels="didYouMeanLabels" />
    <h1
      class="lupa-result-page-title"
      data-cy="lupa-result-page-title"
      v-if="options.labels.searchResults && currentQueryText"
    >
      {{ options.labels.searchResults }}'{{ queryText }}'
    </h1>
    <div id="lupa-search-results">
      <SearchResultsFilters
        v-if="showFilterSidebar"
        :options="options.filters"
      />
      <SearchResultsProducts :options="options" />
    </div>
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

  get queryText(): string {
    return this.suggestedSearchText || this.currentQueryText;
  }

  get showFilterSidebar(): boolean {
    return this.options.filters?.facets?.style?.type === "sidebar";
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

  @searchResult.Getter("currentQueryText") currentQueryText!: string;

  @searchResult.State((state) => state.searchResult.suggestedSearchText)
  suggestedSearchText!: string;

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
    if (!publicQuery.searchText) {
      return;
    }
    this.setLoading(true);
    this.query(publicQuery);
  }

  query(publicQuery: PublicQuery): void {
    this.trackSearch({ queryKey: this.options.queryKey, query: publicQuery });
    getLupaSdk
      .query(this.options.queryKey, publicQuery, this.options.options)
      .then((res) => {
        if (res.success) {
          this.trackResults({ queryKey: this.options.queryKey, results: res });
          this.addSearchResult({ ...res });
        }
      })
      .catch((err) => {
        console.error(err);
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
