import { retrieveHistory, saveHistory } from "@/utils/history.utils";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

@Module({ namespaced: true })
export default class HistoryModule extends VuexModule {
  items: string[] = retrieveHistory();

  get count(): number {
    return this.items.length;
  }

  @Mutation
  save(items: string[]): void {
    this.items = items;
  }

  @Action({ commit: "save" })
  add({ item }: { item?: string }): string[] {
    if (!item) {
      return this.items;
    }
    const newItems = this.items ? [item, ...this.items] : [item];
    const uniqueItems = Array.from(new Set(newItems));
    saveHistory(uniqueItems);
    return uniqueItems;
  }

  @Action({ commit: "save" })
  remove({ item }: { item: string }): string[] {
    const items = this.items?.filter((i) => i !== item) ?? [];
    saveHistory(items);
    return items;
  }

  @Action({ commit: "save" })
  clear(): string[] {
    saveHistory([]);
    return [];
  }
}
