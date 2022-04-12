<template>
  <div
    class="lupa-search-result-facet-term-values lupa-search-result-facet-hierarchy-values"
    data-cy="lupa-search-result-facet-term-values"
  >
    <div v-if="isFilterable">
      <input
        class="lupa-term-filter"
        data-cy="lupa-term-filter"
        v-model="termFilter"
        :placeholder="options.labels.facetFilter"
      />
    </div>
    <HierarchyFacetLevel
      v-for="item of displayValues"
      :key="item.title"
      :options="options"
      :item="item"
      :termFilter="termFilter"
      :currentFilters="currentFilters"
      :level="level"
      @select="handleFacetClick"
    />
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
  FacetGroupHierarchy,
  FacetGroupItem,
  FilterGroupItemTypeTerms,
  HierarchyTree,
} from "@getlupa/client-sdk/Types";
import { ResultFacetOptions } from "@/types/search-results/SearchResultsOptions";
import { MAX_FACET_VALUES } from "@/constants/global.const";
import HierarchyFacetLevel from "./HierarchyFacetLevel.vue";
import { recursiveFilter } from "@/utils/filter.utils";

@Component({
  name: "hierarchyFacet",
  components: {
    HierarchyFacetLevel,
  },
})
export default class HierarchyFacet extends Vue {
  @Prop() options!: ResultFacetOptions;
  @Prop({ default: () => ({}) }) facet!: FacetGroupHierarchy;
  @Prop({ default: () => [] }) currentFilters!: FilterGroupItemTypeTerms;

  showAll = false;
  termFilter = "";
  level = 0;

  get itemLimit(): number {
    return this.showAll || !this.options.hierarchy?.topLevelValueCountLimit
      ? MAX_FACET_VALUES
      : this.options.hierarchy?.topLevelValueCountLimit;
  }

  get allValues(): HierarchyTree[] {
    return this.facet?.items ?? [];
  }

  get displayValues(): HierarchyTree[] {
    return this.filteredValues.slice(0, this.itemLimit);
  }

  get filteredValues(): HierarchyTree[] {
    return this.isFilterable
      ? recursiveFilter(this.allValues, this.termFilter)
      : this.allValues;
  }

  get isFilterable(): boolean {
    return (
      Boolean(this.options.hierarchy?.filterable) &&
      this.allValues.length >=
        (this.options.filterable?.minValues ?? MAX_FACET_VALUES)
    );
  }

  handleFacetClick({ value }: { value: string }): void {
    this.$emit("select", {
      key: this.facet.key,
      value,
      type: "hierarchy",
    });
  }

  handleShowAll(): void {
    this.showAll = true;
  }

  isChecked(item: FacetGroupItem): boolean {
    const selectedItems = this.currentFilters ?? [];
    return selectedItems?.includes(item.title);
  }
}
</script>
