import { DEFAULT_SEARCH_BOX_OPTIONS } from "@/constants/searchBox.const";
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";
import { SearchBoxOptions } from "@/types/search-box/SearchBoxOptions";
import { SearchResultsOptions } from "@/types/search-results/SearchResultsOptions";
import { Options } from "@getlupa/client-sdk/Types";
import { config, Module, Mutation, VuexModule } from "vuex-module-decorators";

// Set rawError to true by default on all @Action decorators
config.rawError = true;

@Module({ namespaced: true })
export default class OptionsModule extends VuexModule {
  searchBoxOptions = DEFAULT_SEARCH_BOX_OPTIONS as SearchBoxOptions;
  searchResultOptions = DEFAULT_OPTIONS_RESULTS as SearchResultsOptions;

  get envOptions(): Options {
    return this.searchBoxOptions.options ?? this.searchResultOptions.options;
  }

  get classMap(): Record<string, string> {
    return this.searchResultOptions.classMap ?? {};
  }

  @Mutation
  setSearchBoxOptions({ options }: { options: SearchBoxOptions }): void {
    this.searchBoxOptions = options;
  }

  @Mutation
  setSearchResultOptions({ options }: { options: SearchResultsOptions }): void {
    this.searchResultOptions = options;
  }
}
