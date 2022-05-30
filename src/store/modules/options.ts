import { DEFAULT_PAGE_SIZE } from "@/constants/global.const";
import { DEFAULT_SEARCH_BOX_OPTIONS } from "@/constants/searchBox.const";
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";
import { SearchBoxOptions } from "@/types/search-box/SearchBoxOptions";
import { RoutingBehavior } from "@/types/search-results/RoutingBehavior";
import { SearchResultsOptions } from "@/types/search-results/SearchResultsOptions";
import { FilterGroup, Options } from "@getlupa/client-sdk/Types";
import { config, Module, Mutation, VuexModule } from "vuex-module-decorators";

// Set rawError to true by default on all @Action decorators
config.rawError = true;

@Module({ namespaced: true })
export default class OptionsModule extends VuexModule {
  searchBoxOptions = DEFAULT_SEARCH_BOX_OPTIONS as SearchBoxOptions;
  searchResultOptions = DEFAULT_OPTIONS_RESULTS as SearchResultsOptions;
  searchResultInitialFilters: FilterGroup = {};

  get envOptions(): Options {
    return this.searchBoxOptions.options ?? this.searchResultOptions.options;
  }

  get classMap(): Record<string, string> {
    return this.searchResultOptions.classMap ?? {};
  }

  get initialFilters(): FilterGroup {
    return this.searchResultInitialFilters;
  }

  get boxRoutingBehavior(): RoutingBehavior {
    return this.searchBoxOptions.routingBehavior ?? "direct-link";
  }

  get searchResultsRoutingBehavior(): RoutingBehavior {
    return this.searchResultOptions.routingBehavior ?? "direct-link";
  }

  get defaultSearchResultPageSize(): number {
    return (
      this.searchResultOptions?.pagination?.sizeSelection?.sizes?.[0] ??
      DEFAULT_PAGE_SIZE
    );
  }

  @Mutation
  setSearchBoxOptions({ options }: { options: SearchBoxOptions }): void {
    this.searchBoxOptions = options;
  }

  @Mutation
  setSearchResultOptions({ options }: { options: SearchResultsOptions }): void {
    this.searchResultOptions = options;
  }

  @Mutation
  setInitialFilters({ initialFilters }: { initialFilters: FilterGroup }): void {
    this.searchResultInitialFilters = initialFilters;
  }
}
