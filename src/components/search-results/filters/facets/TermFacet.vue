<template>
  <div
    class="lupa-search-result-facet-term-values"
    data-cy="lupa-search-result-facet-term-values"
  >
    <input
      v-if="isFilterable"
      class="lupa-term-filter"
      data-cy="lupa-term-filter"
      v-model="termFilter"
      :placeholder="options.labels.facetFilter"
    />
    <div class="lupa-terms-list">
      <div
        class="lupa-facet-term"
        data-cy="lupa-facet-term"
        v-for="item of displayValues"
        :key="item.title"
        :class="{ checked: isChecked(item) }"
        @click="handleFacetClick(item)"
      >
        <div class="lupa-term-checkbox-wrapper">
          <span
            class="lupa-term-checkbox"
            :class="{ checked: isChecked(item) }"
          >
          </span>
        </div>
        <div class="lupa-term-checkbox-label">
          <span class="lupa-term-label">{{ item.title }}</span>
          <span v-if="options.showDocumentCount" class="lupa-term-count"
            >({{ item.count }})</span
          >
        </div>
      </div>
    </div>
    <div
      v-if="itemLimit < filteredValues.length"
      class="lupa-facet-term lupa-show-more-facet-results"
      data-cy="lupa-facet-term"
      @click="handleShowAll"
    >
      {{ options.labels.showAll }}
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import {
  FacetGroup,
  FacetGroupItem,
  FilterGroupItemTypeTerms,
} from "@getlupa/client-sdk/Types";
import { ResultFacetOptions } from "@/types/search-results/SearchResultsOptions";
import { MAX_FACET_VALUES } from "@/constants/global.const";
import { getDisplayValue, getNormalizedString } from "@/utils/string.utils";

@Component({
  name: "termFacet",
})
export default class TermFacet extends Vue {
  @Prop() options!: ResultFacetOptions;
  @Prop({ default: () => ({}) }) facet!: FacetGroup;
  @Prop({ default: () => [] }) currentFilters!: FilterGroupItemTypeTerms;

  showAll = false;
  termFilter = "";

  get itemLimit(): number {
    return this.showAll || !this.options.facetValueCountLimit
      ? MAX_FACET_VALUES
      : this.options.facetValueCountLimit;
  }

  get allValues(): FacetGroupItem[] {
    return this.facet?.items ?? [];
  }

  get displayValues(): FacetGroupItem[] {
    return this.filteredValues
      .slice(0, this.itemLimit)
      .map((v) => ({ ...v, title: getDisplayValue(v.title) }));
  }

  get filteredValues(): FacetGroupItem[] {
    return this.isFilterable
      ? this.allValues.filter((v) =>
          getNormalizedString(v.title)?.includes(
            getNormalizedString(this.termFilter)
          )
        )
      : this.allValues;
  }

  get isFilterable(): boolean {
    return (
      this.allValues.length >=
      (this.options.filterable?.minValues ?? MAX_FACET_VALUES)
    );
  }

  handleFacetClick(item: FacetGroupItem): void {
    this.$emit("select", {
      key: this.facet.key,
      value: item.title?.toString(),
      type: "terms",
    });
  }

  handleShowAll(): void {
    this.showAll = true;
  }

  isChecked(item: FacetGroupItem): boolean {
    const selectedItems = this.currentFilters ?? [];
    return selectedItems?.includes(item.title?.toString());
  }
}
</script>
