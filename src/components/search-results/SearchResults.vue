<template>
  <div class="lupa-search-result-wrapper">
    <CategoryTopFilters v-if="isTitleResultTopPosition" :options="options" />
    <MobileFilterSidebar v-if="options.filters" :options="options.filters" />
    <SearchResultsBreadcrumbs
      v-if="currentQueryText || isProductList"
      :breadcrumbs="options.breadcrumbs"
    />
    <template v-if="isTitleResultTopPosition">
      <div id="lupa-search-results" class="top-layout-wrapper">
        <SearchResultsFilters
          v-if="showFilterSidebar"
          :options="options.filters"
        />
        <div class="search-content">
          <SearchResultsDidYouMean :labels="didYouMeanLabels" />
          <SearchResultsTitle
            :options="options"
            :is-product-list="isProductList"
          />
          <SearchResultsProducts :options="options">
            <template #append>
              <slot />
            </template>
          </SearchResultsProducts>
        </div>
      </div>
    </template>
    <template v-else>
      <SearchResultsDidYouMean :labels="didYouMeanLabels" />
      <SearchResultsTitle :options="options" :is-product-list="isProductList" />
      <div id="lupa-search-results">
        <SearchResultsFilters
          v-if="showFilterSidebar"
          :options="options.filters"
        />
        <SearchResultsProducts :options="options">
          <template #append>
            <slot />
          </template>
        </SearchResultsProducts>
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
import { createPublicQuery, getPublicQuery } from "@/utils/query.utils";
import lupaSearchSdk from "@getlupa/client-sdk";
import {
  FilterGroup,
  PublicQuery,
  SearchQueryResult,
} from "@getlupa/client-sdk/Types";
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
import SearchResultsToolbar from "./products/SearchResultsToolbar.vue";
import CategoryTopFilters from "../product-list/CategoryTopFilters.vue";
import { setDocumentTitle } from "@/utils/document.utils";
import { QUERY_PARAMS } from "@/constants/queryParams.const";

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
    SearchResultsToolbar,
    CategoryTopFilters,
  },
})
export default class SearchResults extends Vue {
  @Prop() options!: SearchResultsOptions;
  @Prop({ default: () => ({}) }) initialFilters!: FilterGroup;
  @Prop({ default: false }) isProductList!: boolean;

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
      "routingBehavior",
    ]);
  }

  @searchResult.Getter("currentQueryText") currentQueryText!: string;

  @searchResult.Getter("hasResults") hasResults!: boolean;

  @searchResult.Getter("currentFilterCount") currentFilterCount!: number;

  get didYouMeanLabels(): SearchResultsDidYouMeanLabels {
    return pick(this.options.labels, ["noResultsSuggestion", "didYouMean"]);
  }

  get showFilterSidebar(): boolean {
    return (
      this.options.filters?.facets?.style?.type === "sidebar" &&
      (this.hasResults || this.currentFilterCount > 0)
    );
  }

  get isTitleResultTopPosition(): boolean {
    return this.options.searchTitlePosition === "search-results-top";
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

  @params.Action("removeParams") removeParams!: ({
    paramsToRemove,
    save,
  }: {
    paramsToRemove: string[];
    save: boolean;
  }) => void;

  @params.Action("appendParams") appendParams!: ({
    params,
    save,
  }: {
    params: { name: string; value: string }[];
    save: boolean;
  }) => void;

  @options.Mutation("setSearchResultOptions") setSearchResultOptions!: ({
    options,
  }: {
    options: SearchResultsOptions;
  }) => void;

  @options.Mutation("setInitialFilters") setInitialFilters!: ({
    initialFilters,
  }: {
    initialFilters: FilterGroup;
  }) => void;

  mounted(): void {
    window.addEventListener("resize", this.handleResize);
    this.setSearchResultOptions({ options: this.options });
    this.handleMounted();
    this.setInitialFilters({ initialFilters: this.initialFilters });
    this.options.callbacks?.onMounted?.();
  }

  beforeDestroy(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  handleMounted(): void {
    this.handleResize();
    if (this.isProductList) {
      setDocumentTitle(this.options.labels.htmlTitleTemplate, "");
    }
    const params = new URLSearchParams(window.location.search);
    if (!params.has(QUERY_PARAMS.QUERY)) {
      this.handleUrlChange(params);
    }
    this.addParams(parseParams(params));
    this.setDefaultLimit(this.defaultSearchResultPageSize);
  }

  @Watch("searchString")
  handleParamsChange(): void {
    this.handleUrlChange();
    this.options.callbacks?.onUrlQueryChange?.({
      queryKey: this.options.queryKey,
      urlQueryString: this.searchString,
    });
  }

  @searchResult.Action("add") addSearchResult!: (
    searchResult: SearchQueryResult
  ) => SearchQueryResult;

  @searchResult.Action("setLoading") setLoading!: (loading: boolean) => {
    loading: boolean;
  };

  @options.Getter("defaultSearchResultPageSize")
  defaultSearchResultPageSize!: number;

  handleUrlChange(params?: URLSearchParams): void {
    const searchParams = params || new URLSearchParams(window.location.search);
    const publicQuery = createPublicQuery(
      parseParams(searchParams),
      this.options.sort,
      this.defaultSearchResultPageSize
    );
    this.setLoading(true);
    this.query(
      getPublicQuery(publicQuery, this.initialFilters, this.isProductList)
    );
  }

  query(publicQuery: PublicQuery): void {
    this.trackSearch({ queryKey: this.options.queryKey, query: publicQuery });
    const context = getLupaTrackingContext();
    const limit = publicQuery.limit || this.defaultSearchResultPageSize;
    const query = { ...publicQuery, ...context, limit };
    if (!query.searchText && this.options.disallowEmptyQuery) {
      return;
    }
    lupaSearchSdk
      .query(this.options.queryKey, query, this.options.options)
      .then((res) => {
        if (res.success) {
          this.handleResults({ queryKey: this.options.queryKey, results: res });
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

  handleResults({
    queryKey,
    results,
  }: {
    queryKey: string;
    results: SearchQueryResult;
  }): void {
    this.trackResults({ queryKey, results });
    const hasResults = Boolean(
      results.total > 0 ||
        results.similarQueries?.length ||
        results.didYouMean?.options
    );
    this.options.callbacks?.onSearchResults?.({ queryKey, hasResults });
  }

  @searchResult.Mutation("setScreenWidth") setScreenWidth!: ({
    width,
  }: {
    width: number;
  }) => void;

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
    this.setScreenWidth({ width: window.innerWidth });
  }
}
</script>
