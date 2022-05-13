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
      v-if="displayShowMore"
      class="lupa-facet-term lupa-show-more-facet-results"
      data-cy="lupa-facet-term"
      @click="toggleShowAll"
    >
      <span v-if="showAll"> {{ options.labels.showLess }}</span>
      <span v-else> {{ options.labels.showAll }}</span>
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
  FilterGroupItemTypeRange,
  FilterGroupItemTypeTerms,
} from "@getlupa/client-sdk/Types";
import { ResultFacetOptions } from "@/types/search-results/SearchResultsOptions";
import { MAX_FACET_VALUES } from "@/constants/global.const";
import { getDisplayValue, getNormalizedString } from "@/utils/string.utils";
import { FACET_TERM_RANGE_SEPARATOR } from "@/constants/queryParams.const";
import { rangeFilterToString } from "@/utils/filter.utils";

@Component({
  name: "termFacet",
})
export default class TermFacet extends Vue {
  @Prop() options!: ResultFacetOptions;
  @Prop({ default: () => ({}) }) facet!: FacetGroup;
  @Prop({ default: () => [] }) currentFilters!:
    | FilterGroupItemTypeTerms
    | FilterGroupItemTypeRange[];

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

  get isRange(): boolean {
    return this.facet.type === "range";
  }

  get displayShowMore(): boolean {
    return Boolean(
      (this.showAll && this.options.labels.showLess) ||
        this.itemLimit < this.filteredValues.length
    );
  }

  handleFacetClick(item: FacetGroupItem): void {
    const value = this.isRange
      ? item.title.split(FACET_TERM_RANGE_SEPARATOR)
      : item.title?.toString();
    this.$emit("select", {
      key: this.facet.key,
      value: value,
      type: this.facet.type,
    });
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  isChecked(item: FacetGroupItem): boolean {
    let selectedItems = this.currentFilters ?? [];
    selectedItems =
      this.isRange && selectedItems
        ? [rangeFilterToString(selectedItems as FilterGroupItemTypeRange)]
        : selectedItems;
    return selectedItems?.includes(item.title?.toString());
  }
}
</script>
