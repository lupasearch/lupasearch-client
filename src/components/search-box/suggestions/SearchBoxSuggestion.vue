<template>
  <div @click="handleSelect()">
    <div
      class="lupa-suggestion-value"
      data-cy="lupa-suggestion-value"
      v-if="highlight"
      v-html="suggestion.displayHighlight"
    ></div>
    <div data-cy="lupa-suggestion-value" class="lupa-suggestion-value" v-else>
      {{ suggestion.display }}
    </div>
    <div
      class="lupa-suggestion-facet"
      data-cy="lupa-suggestion-facet"
      v-if="suggestion.facet"
    >
      <span
        class="lupa-suggestion-facet-label"
        data-cy="lupa-suggestion-facet-label"
        >{{ facetLabel }}</span
      >
      <span
        class="lupa-suggestion-facet-value"
        data-cy="lupa-suggestion-facet-value"
        >{{ suggestion.facet.title }}</span
      >
    </div>
  </div>
</template>
<script lang="ts">
import { DisplaySuggestion } from "@/types/search-box/Common";
import { SearchBoxOptionLabels } from "@/types/search-box/SearchBoxOptions";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
  name: "searchBoxSuggestion",
})
export default class SearchBoxSuggestion extends Vue {
  @Prop({ required: true }) suggestion!: DisplaySuggestion;
  @Prop({ default: true }) highlight!: boolean[];
  @Prop() labels!: SearchBoxOptionLabels;

  get title(): string {
    return this.highlight
      ? this.suggestion.displayHighlight
      : this.suggestion.display;
  }

  get facetKey(): string {
    return this.suggestion.facet?.key || "";
  }

  get facetLabel(): string {
    return (
      this.suggestion.suggestion?.facetLabels?.[this.facetKey] ||
      this.labels.defaultFacetLabel ||
      this.facetKey
    );
  }

  handleSelect(): void {
    this.$emit("select", {
      suggestion: this.suggestion.suggestion,
      facet: this.suggestion.facet,
      override: true,
    });
  }
}
</script>
