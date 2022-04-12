<template>
  <div class="lupa-facet-hierarchy">
    <div
      class="lupa-facet-term"
      data-cy="lupa-facet-term"
      @click="handleFacetClick(item)"
    >
      <div class="lupa-term-checkbox-wrapper">
        <span class="lupa-term-checkbox" :class="{ checked: isChecked }">
        </span>
      </div>
      <div class="lupa-term-checkbox-label">
        <span class="lupa-term-label">{{ item.title }}</span>
        <span v-if="options.showDocumentCount" class="lupa-term-count"
          >({{ item.count }})</span
        >
      </div>
    </div>
    <div class="lupa-facet-level" v-if="showChildren">
      <HierarchyFacetLevel
        v-for="item of item.children"
        :key="item.title"
        :options="options"
        :item="item"
        :currentFilters="currentFilters"
        :level="level + 1"
        @select="(i) => $emit('select', i)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import {
  FilterGroupItemTypeHierarchy,
  HierarchyTree,
} from "@getlupa/client-sdk/Types";
import { ResultFacetOptions } from "@/types/search-results/SearchResultsOptions";

@Component({
  name: "HierarchyFacetLevel",
})
export default class HierarchyFacetLevel extends Vue {
  @Prop() options!: ResultFacetOptions;
  @Prop({ default: () => 0 }) level!: number;
  @Prop({ default: () => [] }) item!: HierarchyTree;
  @Prop({ default: () => [] }) currentFilters!: FilterGroupItemTypeHierarchy;

  handleFacetClick(item: HierarchyTree): void {
    this.$emit("select", {
      value: item.key,
    });
  }

  get showChildren(): boolean {
    return (
      this.isChecked ||
      this.level + 1 < (this.options.hierarchy?.maxInitialLevel ?? 2)
    );
  }

  get isChecked(): boolean {
    return (
      this.currentFilters?.terms?.some((t) => t.startsWith(this.item.key)) ??
      false
    );
  }
}
</script>
<style lang="scss">
.lupa-facet-level {
  margin-left: 25px;
}
</style>
