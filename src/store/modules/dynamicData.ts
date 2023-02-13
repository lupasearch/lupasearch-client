import { DynamicData } from "@/types/search-results/SearchResultsOptions";
import { Document, SearchQueryResult } from "@getlupa/client-sdk/Types";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({ namespaced: true })
export default class DynamicDataModule extends VuexModule {
  loading = false;
  dynamicDataIdMap: Record<string, Document> = {};

  get loadedIds(): string[] {
    return Object.keys(this.dynamicDataIdMap);
  }

  get dynamicData(): DynamicData | undefined {
    return this.context.rootState["options"]?.searchResultOptions?.dynamicData;
  }

  get isDynamicDataEnabled(): boolean {
    return Boolean(this.dynamicData);
  }

  get isCacheEnabled(): boolean {
    return Boolean(this.dynamicData?.cache);
  }

  @Action({ commit: "save" })
  async enhanceSearchResultsWithDyanmicData({
    result,
  }: {
    result?: SearchQueryResult;
  }): Promise<Record<string, Document>> {
    if (!result || !this.isDynamicDataEnabled) {
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
      const dynamicDataResult =
        (await this.dynamicData?.handler(requestedIds)) ?? [];
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
