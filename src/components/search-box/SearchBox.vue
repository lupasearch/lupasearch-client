<template>
  <div id="lupa-search-box">
    <div class="lupa-search-box-wrapper">
      <SearchBoxInput
        :options="inputOptions"
        :suggestedValue="suggestedValue"
        :can-close="isSearchContainer"
        :emit-input-on-focus="!isSearchContainer"
        @input="handleInput"
        @focus="opened = true"
        @close="$emit('close')"
      />
      <SearchBoxMainPanel
        v-if="opened || isSearchContainer"
        :options="panelOptions"
        :inputValue="inputValue"
        @fetched="handleItemsFetch"
        @itemSelect="handleItemSelect"
        @go-to-results="handleSearch"
        @product-click="handleProductClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  FetchedData,
  HighlightedDocInfo,
  InputSuggestion,
  InputSuggestionFacet,
  SelectedData,
  TrackableEventData,
} from "@/types/search-box/Common";
import {
  SearchBoxInputOptions,
  SearchBoxOptions,
  SearchBoxPanelOptions,
} from "@/types/search-box/SearchBoxOptions";
import { SearchBoxPanelType } from "@/types/search-box/SearchBoxPanel";
import { QueryParams } from "@/types/search-results/QueryParams";
import { pick } from "@/utils/picker.utils";
import { Document, Suggestion } from "@getlupa/client-sdk/Types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import SearchBoxInput from "./SearchBoxInput.vue";
import SearchBoxMainPanel from "./SearchBoxMainPanel.vue";
import { bindSearchTriggers, unbindSearchTriggers } from "@/utils/event.utils";
import { debounce } from "lodash";

const defaultSuggestedValue = {
  item: { suggestion: "" },
  queryKey: "",
  override: false,
};
const history = namespace("history");
const params = namespace("params");
const searchBox = namespace("searchBox");
const options = namespace("options");
const tracking = namespace("tracking");

@Component({
  name: "searchBox",
  components: {
    SearchBoxInput,
    SearchBoxMainPanel,
  },
})
export default class SearchBox extends Vue {
  @Prop() options!: SearchBoxOptions;
  @Prop({ default: false }) isSearchContainer!: boolean;

  inputValue = "";
  suggestedValue: InputSuggestion = defaultSuggestedValue;

  opened = this.isSearchContainer;

  @searchBox.Getter("highlightedDocument") highlightedDocument?: {
    doc?: Document;
    link?: string;
  };

  @history.Action("add") addHistory!: ({ item }: { item: string }) => string[];
  @searchBox.Mutation("saveOptions") saveOptions!: ({
    options,
  }: {
    options: SearchBoxOptions;
  }) => void;

  get searchValue(): string {
    return this.suggestedValue.override
      ? this.suggestedValue.item.suggestion
      : this.inputValue;
  }

  get inputOptions(): SearchBoxInputOptions {
    return pick(this.options, [
      "minInputLength",
      "labels",
      "links",
      "inputAttributes",
    ]);
  }

  get panelOptions(): SearchBoxPanelOptions {
    return pick(this.options, [
      "minInputLength",
      "panels",
      "history",
      "labels",
      "links",
      "options",
      "debounce",
      "showTotalCount",
    ]);
  }

  get searchTriggers(): string[] {
    return this.options.searchTriggers ?? [];
  }

  @tracking.Action("track") trackClick!: ({
    queryKey,
    data,
  }: {
    queryKey: string;
    data: TrackableEventData;
  }) => void;

  @params.Action("setSearchResultsLink") setSearchResultsLink!: (
    searchResultsLink: string
  ) => {
    searchResultsLink: string;
  };

  @options.Mutation("setSearchBoxOptions") setSearchBoxOptions!: ({
    options,
  }: {
    options: SearchBoxOptions;
  }) => void;

  mounted(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("click", this.handleMouseClick);

    this.setSearchResultsLink(this.options.links.searchResults);
    this.saveOptions({ options: this.options });
    this.setSearchBoxOptions({ options: this.options });
    bindSearchTriggers(this.searchTriggers, this.handleCurrentValueSearch);
  }

  beforeDestroy(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("click", this.handleMouseClick);
    unbindSearchTriggers(this.searchTriggers, this.handleCurrentValueSearch);
  }

  handleMouseClick(e: MouseEvent): void {
    const el = document.getElementById("lupa-search-box");
    const elementClass = (e.target as HTMLElement)?.className ?? "";
    const hasLupaClass =
      typeof elementClass.includes == "function" &&
      elementClass.includes("lupa-search-box");
    const isOutsideElement =
      el && !el.contains(e.target as Node) && !hasLupaClass;
    if (!isOutsideElement) {
      return;
    }
    this.opened = false;
    this.suggestedValue = defaultSuggestedValue;
  }

  handleKeyDown(e: KeyboardEvent): void {
    if (!this.opened) {
      return;
    }
    switch (e.key) {
      case "Tab":
        e.preventDefault();
        this.selectSuggestion({ ...this.suggestedValue, override: true });
        break;
      case "Enter":
        e.preventDefault();
        this.handleSearch();
        this.resetValues();
        break;
      default:
        break;
    }
  }

  handleInput(value: string): void {
    this.opened = true;
    this.inputValue = value;
    this.suggestedValue = defaultSuggestedValue;
    if (this.isSearchContainer) {
      this.goToResultsDebounced({
        searchText: this.searchValue,
      });
    }
  }

  handleItemsFetch(data: FetchedData): void {
    switch (data.type) {
      case SearchBoxPanelType.SUGGESTION: {
        const item = data.items[0] as Suggestion | undefined;
        let suggestion = item || { suggestion: "" };
        suggestion =
          !suggestion.suggestion.includes(this.inputValue) ||
          suggestion.suggestion.length === this.inputValue?.length
            ? { suggestion: "" }
            : suggestion;
        this.suggestedValue = {
          item: suggestion,
          override: false,
          queryKey: "",
        };
        break;
      }
      default:
        break;
    }
  }

  handleItemSelect(data: SelectedData): void {
    switch (data.type) {
      case SearchBoxPanelType.SUGGESTION: {
        const suggestion = data.item as InputSuggestion;
        this.selectSuggestion(suggestion, suggestion.override);
        break;
      }
      default:
        break;
    }
  }

  selectSuggestion(
    inputSuggestion: InputSuggestion,
    shouldSearch = false
  ): void {
    if (inputSuggestion.item.suggestion) {
      this.suggestedValue = {
        ...inputSuggestion,
        override: true,
      };
      if (inputSuggestion.override) {
        this.trackSuggestionClick();
      }
      this.inputValue = inputSuggestion.override
        ? inputSuggestion.item.suggestion
        : this.inputValue;
    }
    if (shouldSearch) {
      this.handleSearch();
    }
  }

  handleNavigateDocument({ link }: { doc?: Document; link?: string }): void {
    if (!link) {
      return;
    }
    window.location.assign(link);
  }

  handleCurrentValueSearch(): void {
    if (this.searchValue?.length < this.options.minInputLength) {
      return;
    }
    this.opened = false;
    this.goToResults({ searchText: this.searchValue });
    this.resetValues();
  }

  @params.Action("goToResults") goToResults!: ({
    searchText,
    facet,
  }: {
    searchText: string;
    facet?: InputSuggestionFacet;
  }) => { params: QueryParams };

  goToResultsDebounced = debounce(
    this.goToResults,
    this.options.debounce ?? 300
  );

  handleSearch({ query } = { query: "" }): void {
    const searchText = query || this.searchValue;
    if (searchText.length < this.options.minInputLength) {
      return;
    }
    if (this.highlightedDocument?.doc) {
      this.trackDocumentClick(this.highlightedDocument);
      this.handleNavigateDocument(this.highlightedDocument);
      return;
    }
    this.trackSuggestionClick();
    this.addHistory({ item: searchText });
    this.opened = false;

    this.goToResults({ searchText, facet: this.suggestedValue.facet });
  }

  trackDocumentClick(doc: HighlightedDocInfo): void {
    if (!doc.queryKey || !doc.doc) {
      return;
    }
    this.trackClick({
      queryKey: doc.queryKey,
      data: {
        itemId: doc.id as string,
        searchQuery: this.inputValue,
        type: "itemClick",
        analytics: {
          type: "autocomplete_product_click",
          label: (doc.doc.url as string) || (doc.id as string),
        },
      },
    });
  }

  trackSuggestionClick(suggestion?: string): void {
    if (
      suggestion ||
      this.inputValue?.length < this.options.minInputLength ||
      this.inputValue === this.searchValue
    ) {
      return;
    }
    this.trackClick({
      queryKey: this.suggestedValue.queryKey,
      data: {
        itemId: suggestion || this.searchValue,
        searchQuery: this.inputValue,
        type: "suggestionClick",
        analytics: {
          type: "autocomplete_keyword_click",
          label: suggestion || this.searchValue,
        },
      },
    });
  }

  resetValues(): void {
    this.inputValue = "";
    this.suggestedValue = defaultSuggestedValue;
  }

  handleProductClick() {
    this.opened = false;
  }
}
</script>

<style>
#lupa-search-box {
  width: 100%;
}
.lupa-search-box-wrapper {
  position: relative;
}
</style>
