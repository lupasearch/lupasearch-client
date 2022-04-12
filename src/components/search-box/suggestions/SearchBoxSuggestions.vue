<template>
  <div id="lupa-search-box-suggestions" data-cy="lupa-search-box-suggestions">
    <SearchBoxSuggestion
      v-for="(item, index) in items"
      :key="getSuggestionKey(item)"
      :class="[
        'lupa-suggestion',
        index === highlightedIndex ? 'lupa-suggestion-highlighted' : '',
      ]"
      :suggestion="item"
      :highlight="highlight"
      :labels="labels"
      data-cy="lupa-suggestion"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
import {
  DisplaySuggestion,
  InputSuggestionFacet,
} from "@/types/search-box/Common";
import { SearchBoxOptionLabels } from "@/types/search-box/SearchBoxOptions";
import { Suggestion } from "@getlupa/client-sdk/Types";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import SearchBoxSuggestion from "./SearchBoxSuggestion.vue";

const searchBox = namespace("searchBox");

@Component({
  name: "searchBoxSuggestions",
  components: {
    SearchBoxSuggestion,
  },
})
export default class SearchBoxSuggestions extends Vue {
  @Prop({ default: [] }) items!: DisplaySuggestion[];
  @Prop({ default: true }) highlight!: boolean[];
  @Prop({ required: true }) queryKey!: string;
  @Prop() labels!: SearchBoxOptionLabels;

  @searchBox.Getter("highlightedItem") highlightedItem?: {
    queryKey: string;
    index: number;
  };

  get highlightedIndex(): number {
    if (this.queryKey !== this.highlightedItem?.queryKey) {
      return -1;
    }
    return this.highlightedItem?.index ?? -1;
  }

  handleSelect({
    suggestion,
    override,
    facet,
  }: {
    suggestion: Suggestion;
    override: boolean;
    facet?: InputSuggestionFacet;
  }): void {
    this.$emit("suggestionSelect", {
      item: {
        item: suggestion,
        queryKey: this.queryKey,
        override,
        facet,
      },
      type: "suggestion",
    });
  }

  @Watch("highlightedIndex")
  handleHighlight(): void {
    if (this.highlightedIndex < 0) {
      return;
    }
    const selected = this.items[this.highlightedIndex];
    this.handleSelect({
      suggestion: selected.suggestion,
      facet: selected.facet,
      override: false,
    });
  }

  getSuggestionKey(suggestion: DisplaySuggestion): string {
    return `${suggestion.display}${suggestion.facet?.key}${suggestion.facet?.title}`;
  }
}
</script>
