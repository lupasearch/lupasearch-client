import { DEFAULT_SEARCH_BOX_OPTIONS } from "@/constants/searchBox.const";
import { SearchBoxOptions } from "@/types/search-box/SearchBoxOptions";
import {
  PublicQuery,
  SearchQueryResult,
  Suggestion,
} from "@getlupa/client-sdk/Types";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import lupaSearchSdk from "@getlupa/client-sdk";
import {
  DisplaySuggestion,
  HighlightedDocInfo,
} from "@/types/search-box/Common";
import {
  SearchBoxPanel,
  SearchBoxPanelType,
} from "@/types/search-box/SearchBoxPanel";
import { generateLink } from "@/utils/link.utils";
import { flattenSuggestions } from "@/utils/suggestion.utils";
import { getLupaTrackingContext } from "@/utils/tracking.utils";
import { SdkOptions } from "@/types/General";

@Module({ namespaced: true })
export default class SearchBoxModule extends VuexModule {
  options: SearchBoxOptions = DEFAULT_SEARCH_BOX_OPTIONS as SearchBoxOptions;
  docResults: Record<string, SearchQueryResult> = {};
  suggestionResults: Record<string, DisplaySuggestion[]> = {};
  highlightedIndex = -1;
  inputValue = "";

  @Mutation
  saveOptions({ options }: { options: SearchBoxOptions }): void {
    this.options = options;
  }

  @Mutation
  saveInputValue({ input }: { input: string }): void {
    this.inputValue = input;
  }

  get resultsVisible(): boolean {
    return this.inputValue?.length >= this.options.minInputLength;
  }

  get panelItemCounts(): {
    queryKey: string;
    count: number;
    panel: SearchBoxPanel;
  }[] {
    return this.options.panels.map((p) => {
      if (p.type === SearchBoxPanelType.SUGGESTION) {
        return {
          queryKey: p.queryKey,
          count: this.suggestionResults[p.queryKey]?.length ?? 0,
          panel: p,
        };
      }
      return {
        queryKey: p.queryKey,
        count: this.docResults[p.queryKey]?.items?.length ?? 0,
        panel: p,
      };
    });
  }

  get totalCount(): number {
    return this.resultsVisible
      ? this.panelItemCounts?.reduce((a, c) => a + c.count, 0) ?? 0
      : this.context.rootGetters["history/count"] ?? 0;
  }

  get highlightedItem():
    | { queryKey: string; index: number; panel: SearchBoxPanel }
    | undefined {
    let i = 0;
    for (const panel of this.panelItemCounts) {
      if (this.highlightedIndex < i + panel.count) {
        const mod = this.highlightedIndex - i;
        return { queryKey: panel.queryKey, index: mod, panel: panel.panel };
      }
      i += panel.count;
    }
  }

  get highlightedDocument(): HighlightedDocInfo {
    if (
      !this.resultsVisible ||
      this.highlightedItem?.panel.type !== SearchBoxPanelType.DOCUMENT
    ) {
      return { doc: undefined };
    }
    const doc =
      this.docResults[this.highlightedItem.queryKey].items[
        this.highlightedItem.index
      ];
    const panel = this.highlightedItem.panel;
    return {
      doc,
      link: generateLink(panel.links?.details, doc),
      queryKey: panel.queryKey,
      id: panel.idKey ? doc[panel.idKey] : "",
      title: panel.titleKey ? (doc[panel.titleKey] as string) : "",
    };
  }

  @Mutation
  saveSuggestions({
    queryKey,
    suggestions,
    inputValue,
  }: {
    queryKey: string;
    suggestions?: Suggestion[];
    inputValue?: string;
  }): void {
    if (!suggestions) {
      return;
    }
    this.suggestionResults = {
      ...this.suggestionResults,
      [queryKey]: flattenSuggestions(suggestions, inputValue ?? ""),
    };
  }

  @Mutation
  saveResults({
    queryKey,
    result,
  }: {
    queryKey: string;
    result?: SearchQueryResult;
  }): void {
    if (!result) {
      return;
    }
    this.docResults = { ...this.docResults, [queryKey]: result };
  }

  @Mutation
  saveHighlight({ highlightIndex }: { highlightIndex: number }): void {
    this.highlightedIndex = highlightIndex;
  }

  @Action({ commit: "saveSuggestions" })
  async querySuggestions({
    queryKey,
    publicQuery,
    options,
  }: {
    queryKey: string;
    publicQuery: PublicQuery;
    options?: SdkOptions;
  }): Promise<{
    queryKey: string;
    suggestions?: Suggestion[];
    inputValue?: string;
  }> {
    try {
      const context = getLupaTrackingContext();
      const result = await lupaSearchSdk.suggestions(
        queryKey,
        { ...publicQuery, ...context },
        options
      );
      if (!result.success) {
        return { queryKey };
      }
      this.context.dispatch("highlightChange", { action: "clear" });
      return {
        queryKey,
        suggestions: result.items,
        inputValue: publicQuery.searchText,
      };
    } catch (err) {
      console.error(err);
      if (options?.onError) {
        options.onError(err);
      }
      return { queryKey };
    }
  }

  @Action({ commit: "saveResults" })
  async queryDocuments({
    queryKey,
    publicQuery,
    options,
  }: {
    queryKey: string;
    publicQuery: PublicQuery;
    options?: SdkOptions;
  }): Promise<{
    queryKey: string;
    result?: SearchQueryResult;
  }> {
    try {
      const context = getLupaTrackingContext();
      const result = await lupaSearchSdk.query(
        queryKey,
        { ...publicQuery, ...context },
        options
      );
      if (!result.success) {
        return { queryKey };
      }
      this.context.dispatch("highlightChange", { action: "clear" });

      return { queryKey, result };
    } catch (err) {
      console.error(err);
      if (options?.onError) {
        options.onError(err);
      }
      return { queryKey };
    }
  }

  @Action({ commit: "saveHighlight", rawError: true })
  highlightChange({ action }: { action: "down" | "up" | "clear" }): {
    highlightIndex: number;
  } {
    if (action === "clear") {
      return { highlightIndex: -1 };
    }
    const newIndex = this.highlightedIndex + (action === "up" ? -1 : 1);
    return newIndex >= 0
      ? { highlightIndex: newIndex % this.totalCount }
      : { highlightIndex: this.totalCount - 1 };
  }
}
