import { SearchBoxOptions } from "@/types/search-box/SearchBoxOptions";
import {
  DynamicData,
  SearchResultsOptions,
} from "@/types/search-results/SearchResultsOptions";
import { Document, SearchQueryResult } from "@getlupa/client-sdk/Types";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({ namespaced: true })
export default class DynamicDataModule extends VuexModule {
  loading = false;
  dynamicDataIdMap: Record<string, Document> = {};

  get loadedIds(): string[] {
    return Object.keys(this.dynamicDataIdMap);
  }

  get searchResultOptions(): SearchResultsOptions {
    return this.context.rootState["options"]?.searchResultOptions;
  }

  get searchBoxOptions(): SearchBoxOptions {
    return this.context.rootState["options"]?.searchBoxOptions;
  }

  get dynamicSearchResultData(): DynamicData | undefined {
    return this.searchResultOptions?.dynamicData;
  }

  get dynamicSearchBoxData(): DynamicData | undefined {
    return this.searchBoxOptions?.dynamicData;
  }

  get isDynamicDataEnabledForSearchResults(): boolean {
    return this.searchResultOptions?.dynamicData?.enabled ?? false;
  }

  get isDynamicDataEnabledForSearchBox(): boolean {
    return this.searchBoxOptions?.dynamicData?.enabled ?? false;
  }

  get isCacheEnabled(): boolean {
    return Boolean(this.dynamicSearchResultData?.cache);
  }

  @Action({ commit: "save" })
  async enhanceSearchResultsWithDynamicData({
    result,
    mode,
  }: {
    result?: SearchQueryResult;
    mode?: "searchBox" | "searchResults";
  }): Promise<Record<string, Document>> {
    const enabledForMode =
      mode === "searchBox"
        ? this.isDynamicDataEnabledForSearchBox
        : this.isDynamicDataEnabledForSearchResults;
    if (!result || !enabledForMode) {
      return {};
    }
    let requestedIds = (result?.items?.map((i) => i.id) as string[]) ?? [];
    if (this.isCacheEnabled) {
      requestedIds = requestedIds.filter((i) => !this.loadedIds.includes(i));
    }
    if (!requestedIds.length) {
      return {};
    }
    this.context.commit("setLoading", true);
    try {
      const dynamicData =
        this.dynamicSearchResultData || this.dynamicSearchBoxData;
      if (!dynamicData?.handler) {
        return {};
      }
      const dynamicDataResult =
        (await dynamicData?.handler(requestedIds)) ?? [];
      const seed: Record<string, Document> = {};
      const dynamicDataIdMap = dynamicDataResult.reduce(
        (a, c) => ({ ...a, [c.id as string]: c }),
        seed
      ) as Record<string, Document>;
      return dynamicDataIdMap;
    } finally {
      this.context.commit("setLoading", false);
    }
  }

  @Mutation
  save(newData: Record<string, Document>): void {
    this.dynamicDataIdMap = {
      ...this.dynamicDataIdMap,
      ...newData,
    };
  }

  @Mutation
  setLoading(state: boolean): void {
    this.loading = state;
  }
}
