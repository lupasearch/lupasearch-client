import {
  L_MIN_WIDTH,
  MD_MIN_WIDTH,
  S_MIN_WIDTH,
  XL_MIN_WIDTH,
} from "@/constants/global.const";
import { ScreenSize } from "@/types/General";
import { LabeledFilter } from "@/types/search-results/Filters";
import {
  ResultsLayout,
  ResultsLayoutEnum,
} from "@/types/search-results/ResultsLayout";
import { ProductGrid } from "@/types/search-results/SearchResultsOptions";
import { setDocumentTitle } from "@/utils/document.utils";
import { getLabeledFilters, unfoldFilters } from "@/utils/filter.utils";
import {
  FacetGroup,
  FacetResult,
  FilterGroup,
  SearchQueryResult,
} from "@getlupa/client-sdk/Types";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import lupaSearchSdk from "@getlupa/client-sdk";
import { disableBodyScroll, enableBodyScroll } from "@/utils/scroll.utils";

@Module({ namespaced: true })
export default class SearchResultModule extends VuexModule {
  searchResult: SearchQueryResult = {} as SearchQueryResult;
  columnCount = 2;
  addToCartAmount = 1;
  layout: ResultsLayout = ResultsLayoutEnum.GRID;
  loading = false;
  isMobileSidebarVisible = false;
  screenWidth = 1000;

  get facets(): FacetResult[] | undefined {
    return this.searchResult.facets;
  }

  get currentFilters(): FilterGroup | undefined {
    return this.searchResult.filters;
  }

  get filters(): FilterGroup {
    return this.searchResult.filters ?? {};
  }

  get currentQueryText(): string {
    return this.searchResult.searchText ?? "";
  }

  get totalItems(): number {
    return this.searchResult.total ?? 0;
  }

  get hasResults(): boolean {
    return this.totalItems > 0;
  }

  get labeledFilters(): LabeledFilter[] {
    return getLabeledFilters(unfoldFilters(this.currentFilters), this.facets);
  }

  get displayFilters(): LabeledFilter[] {
    const initialFilters =
      this.context.rootGetters["options/initialFilters"] ?? {};
    return this.labeledFilters?.filter((f) => !initialFilters?.[f.key]) ?? [];
  }

  get currentFilterCount(): number {
    return this.displayFilters?.length ?? 0;
  }

  get currentFilterKeys(): string[] {
    return Object.keys(this.currentFilters ?? {});
  }

  get hasAnyFilter(): boolean {
    return Object.keys(this.filters).length > 0;
  }

  get itemRange(): number[] {
    const limit = this.context.rootGetters["params/limit"] ?? 0;
    const offset = this.searchResult.offset ?? 0;
    return [offset + 1, Math.min(offset + limit, this.totalItems)];
  }

  get isMobileWidth(): boolean {
    return this.currentScreenWidth === "sm" || this.currentScreenWidth === "xs";
  }

  get currentScreenWidth(): ScreenSize {
    const width = this.screenWidth;
    if (width <= S_MIN_WIDTH) {
      return "xs";
    } else if (width > S_MIN_WIDTH && width <= MD_MIN_WIDTH) {
      return "sm";
    } else if (width > MD_MIN_WIDTH && width <= L_MIN_WIDTH) {
      return "md";
    } else if (width > L_MIN_WIDTH && width <= XL_MIN_WIDTH) {
      return "l";
    } else {
      return "xl";
    }
  }

  get isPageEmpty(): boolean {
    return (
      this.hasResults && (this.searchResult.offset ?? 0) >= this.totalItems
    );
  }

  @Action({ commit: "setSidebarVisibility" })
  setSidebarState({ visible }: { visible: boolean }): { visible: boolean } {
    // Disable body scroll when sidebar is open and preserve scroll position when scrolling is closed
    if (visible) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
    return { visible };
  }

  @Mutation
  setSidebarVisibility({ visible }: { visible: boolean }): void {
    this.isMobileSidebarVisible = visible;
  }

  @Mutation
  save({
    searchResult,
    columnCount,
    addToCartAmount,
    layout,
  }: {
    searchResult?: SearchQueryResult;
    columnCount?: number;
    addToCartAmount?: number;
    layout?: ResultsLayout;
  }): void {
    this.searchResult = searchResult || this.searchResult;
    this.columnCount = columnCount || this.columnCount;
    this.addToCartAmount = addToCartAmount || this.addToCartAmount;
    this.layout = layout || this.layout;
  }

  @Action
  async queryFacet({
    queryKey,
    facetKey,
  }: {
    queryKey: string;
    facetKey: string;
  }): Promise<void> {
    const query = { searchText: "", filters: { ...this.currentFilters } };
    const options = this.context.rootGetters["options/envOptions"] ?? {};
    const result = await lupaSearchSdk.query(queryKey, query, options);
    if (!result.success) {
      return;
    }
    const facet = result.facets?.find((f) => f.key === facetKey);
    const facetItems = (facet as FacetGroup)?.items ?? [];
    const updatedResult = {
      ...this.searchResult,
      facets: this.facets?.map((f) =>
        f.key === facetKey ? { ...f, items: facetItems } : f
      ),
    };
    this.context.commit("save", {
      searchResult: updatedResult,
    });
  }

  @Mutation
  load(loading: boolean): void {
    this.loading = loading || false;
  }

  @Mutation
  setScreenWidth({ width }: { width: number }): void {
    this.screenWidth = width;
  }

  @Action({ commit: "save" })
  add(searchResult: SearchQueryResult): {
    searchResult: SearchQueryResult;
    pageSize: number;
  } {
    if (!searchResult) {
      return {
        searchResult: this.searchResult,
        pageSize: this.searchResult.limit || 0,
      };
    }
    setDocumentTitle(
      this.context.rootState.options.searchResultOptions.labels
        .htmlTitleTemplate,
      searchResult.searchText
    );
    return { searchResult, pageSize: searchResult.limit || 0 };
  }

  @Action({ commit: "save" })
  setColumnCount({ width, grid }: { width: number; grid: ProductGrid }): {
    columnCount: number;
  } {
    if (!width || !grid) {
      return { columnCount: this.columnCount };
    }

    if (width <= S_MIN_WIDTH) {
      return { columnCount: grid.columns.xs };
    } else if (width > S_MIN_WIDTH && width <= MD_MIN_WIDTH) {
      return { columnCount: grid.columns.sm };
    } else if (width > MD_MIN_WIDTH && width <= L_MIN_WIDTH) {
      return { columnCount: grid.columns.md };
    } else if (width > L_MIN_WIDTH && width <= XL_MIN_WIDTH) {
      return { columnCount: grid.columns.l };
    } else {
      return { columnCount: grid.columns.xl };
    }
  }

  @Action({ commit: "save" })
  setAddToCartAmount(addToCartAmount: number): { addToCartAmount: number } {
    if (!addToCartAmount) {
      return { addToCartAmount: this.addToCartAmount };
    }
    return { addToCartAmount };
  }

  @Action({ commit: "save" })
  setLayout(layout: ResultsLayout): { layout: ResultsLayout } {
    if (!layout) {
      return { layout: this.layout };
    }
    return { layout };
  }

  @Action({ commit: "load" })
  setLoading(loading: boolean): boolean {
    return loading || false;
  }
}
