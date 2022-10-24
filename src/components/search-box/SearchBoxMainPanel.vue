<template>
  <div id="lupa-search-box-panel" v-if="displayResults" ref="panel">
    <div class="lupa-main-panel" data-cy="lupa-main-panel">
      <div
        v-for="(panel, index) in panels"
        :key="index"
        :class="[
          'lupa-panel-' + panel.type + '-index',
          panel.customClassName ? panel.customClassName : '',
        ]"
        :data-cy="'lupa-panel-' + panel.type + '-index'"
      >
        <search-box-panel
          v-if="panel.queryKey"
          :is="getComponent(panel.type)"
          :panel="panel"
          :options="sdkOptions"
          :debounce="options.debounce"
          :inputValue="getInput(panel)"
          :labels="labels"
          @fetched="(data) => $emit('fetched', data)"
          @itemSelect="(item) => $emit('itemSelect', item)"
          @product-click="$emit('product-click')"
        ></search-box-panel>
      </div>
    </div>
    <SearchBoxMoreResults
      :labels="labels"
      :showTotalCount="options.showTotalCount"
      @go-to-results="$emit('go-to-results')"
    ></SearchBoxMoreResults>
  </div>
  <div id="lupa-search-box-panel" ref="panel" v-else-if="displayHistory">
    <SearchBoxHistoryPanel
      ref="panel"
      :options="options.history"
      :history="history"
      @go-to-results="handleGoToResults"
      @remove="remove"
      @remove-all="removeAll"
    />
  </div>
</template>

<script lang="ts">
import { SearchBoxPanelOptions } from "@/types/search-box/SearchBoxOptions";
import {
  SearchBoxPanel,
  SearchBoxPanelType,
} from "@/types/search-box/SearchBoxPanel";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SearchBoxProductsWrapper from "./products/SearchBoxProductsWrapper.vue";
import SearchBoxSuggestionsWrapper from "./suggestions/SearchBoxSuggestionsWrapper.vue";
import SearchBoxMoreResults from "./SearchBoxMoreResults.vue";
import SearchBoxHistoryPanel from "./history/SearchBoxHistoryPanel.vue";
import { SdkOptions } from "@/types/General";
import { namespace } from "vuex-class";
import { DisplaySuggestion } from "@/types/search-box/Common";

const searchBox = namespace("searchBox");

@Component({
  name: "searchBoxMainPanel",
  components: {
    SearchBoxSuggestionsWrapper,
    SearchBoxProductsWrapper,
    SearchBoxMoreResults,
    SearchBoxHistoryPanel,
  },
})
export default class SearchBoxMainPanel extends Vue {
  @Prop() options!: SearchBoxPanelOptions;
  @Prop() inputValue!: string;
  @Prop({ default: false }) focused!: boolean;
  @Prop({ default: () => [] }) history!: string[];

  labels = this.options.labels;
  panels: SearchBoxPanel[] = this.options.panels;
  sdkOptions: SdkOptions = this.options.options as SdkOptions;

  get displayResults(): boolean {
    return this.inputValue?.length >= this.options.minInputLength;
  }

  get displayHistory(): boolean {
    return Boolean(this.options.history) && this.inputValue?.length < 1;
  }

  @searchBox.State((state) => state.suggestionResults)
  suggestionResults!: Record<string, DisplaySuggestion[]>;

  getInput(panel: SearchBoxPanel): string {
    if (
      panel.type === SearchBoxPanelType.SUGGESTION ||
      !panel.searchBySuggestion
    ) {
      return this.inputValue;
    }

    const queryKey = this.panels.find(
      (x) => x.type === SearchBoxPanelType.SUGGESTION
    )?.queryKey;
    const displaySuggestion =
      queryKey && this.suggestionResults[queryKey]?.length
        ? this.suggestionResults[queryKey][0]
        : "";
    return displaySuggestion
      ? displaySuggestion.suggestion.suggestion
      : this.inputValue;
  }

  @searchBox.Action("highlightChange") highlightChange!: ({
    action,
  }: {
    action: "up" | "down" | "clear";
  }) => void;

  mounted(): void {
    window.addEventListener("resize", this.appHeight);
    window.addEventListener("keydown", this.handleNavigation);
    this.appHeight();
  }

  beforeDestroy(): void {
    this.highlightChange({ action: "clear" });
    window.removeEventListener("resize", this.appHeight);
    window.removeEventListener("keydown", this.handleNavigation);
  }

  handleNavigation(e: KeyboardEvent): void {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.highlightChange({ action: "down" });
        break;
      case "ArrowUp":
        e.preventDefault();
        this.highlightChange({ action: "up" });
        break;
      default:
        break;
    }
  }

  handleGoToResults({ query } = { query: "" }): void {
    this.$emit("go-to-results", { query });
  }

  remove({ item }: { item: string }): void {
    this.$emit("clear-history-item", { item });
  }

  removeAll(): void {
    this.$emit("clear-history");
  }

  getComponent(type: SearchBoxPanelType): string {
    switch (type) {
      case "suggestion":
        return "searchBoxSuggestionsWrapper";
      default:
        return "searchBoxProductsWrapper";
    }
  }

  appHeight(): void {
    const doc = document.documentElement;
    const panel = this.$refs.panel as Element;
    if (!panel) {
      return;
    }
    doc.style.setProperty(
      "--lupa-available-height",
      `${window.innerHeight - panel.getBoundingClientRect().y - 10}px`
    );
  }
}
</script>

<style lang="scss">
#lupa-search-box-panel {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.lupa-more-results {
  text-align: center;
}
</style>
