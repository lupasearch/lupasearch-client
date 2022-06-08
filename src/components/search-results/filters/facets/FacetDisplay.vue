<template>
  <div
    ref="facet"
    class="lupa-search-result-facet-display"
    data-cy="lupa-search-result-facet-display"
    v-if="hasItems"
  >
    <div
      class="lupa-search-result-facet-label"
      data-cy="lupa-search-result-facet-label"
      :class="{ open: isOpen, 'lupa-has-filter': hasFilter }"
      @click="toggleFacet"
    >
      <div class="lupa-facet-label-text">{{ facet.label }}</div>
      <div class="lupa-facet-label-caret" :class="isOpen && 'open'"></div>
    </div>
    <div class="lupa-facet-content" data-cy="lupa-facet-content" v-if="isOpen">
      <component
        :is="facetType"
        :facet="facet"
        :currentFilters="currentFilters[facet.key]"
        :options="options"
        @select="handleFacetSelect"
      />
      <div
        class="lupa-single-facet-clear"
        data-cy="lupa-single-facet-clear"
        v-if="clearable"
        @click="clear"
      >
        {{ options.labels.facetClear }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import {
  FacetGroup,
  FacetResult,
  FilterGroup,
} from "@getlupa/client-sdk/Types";
import TermFacet from "./TermFacet.vue";
import StatsFacet from "./StatsFacet.vue";
import HierarchyFacet from "./HierarchyFacet.vue";
import { ResultFacetOptions } from "@/types/search-results/SearchResultsOptions";
import { FacetAction } from "@/types/search-results/FacetAction";
import { namespace } from "vuex-class";

const searchResult = namespace("searchResult");

@Component({
  name: "facetDisplay",
  components: {
    TermFacet,
    StatsFacet,
    HierarchyFacet,
  },
})
export default class FacetDisplay extends Vue {
  @Prop() options!: ResultFacetOptions;
  @Prop({ default: () => [] }) facet!: FacetResult;
  @Prop({ default: () => ({}) }) currentFilters!: FilterGroup;
  @Prop({ default: false }) clearable!: boolean;

  @searchResult.Getter("currentFilterKeys") currentFilterKeys!: string[];

  isOpen = false;

  get facetType(): string {
    switch (this.facet.type) {
      case "terms":
        return "term-facet";
      case "stats":
        return "stats-facet";
      case "hierarchy":
        return "hierarchy-facet";
      default:
        return "term-facet";
    }
  }

  get hasItems(): boolean {
    if (this.facet.type === "stats") {
      return true;
    }
    const facet = this.facet as FacetGroup;
    return facet.items?.length > 0;
  }

  get hasFilter(): boolean {
    return Boolean((this.currentFilters ?? {})[this.facet.key]);
  }

  get filterQueryKey(): string | undefined {
    return this.options.facetFilterQueries?.[this.facet.key]?.queryKey;
  }

  get activeFilterKeys(): string {
    return (this.currentFilterKeys ?? []).join(",");
  }

  mounted(): void {
    if (this.options.style?.type === "top-dropdown") {
      window.addEventListener("click", this.handleMouseClick);
    }
  }

  beforeDestroy(): void {
    if (this.options.style?.type === "top-dropdown") {
      window.addEventListener("click", this.handleMouseClick);
    }
  }

  handleMouseClick(e: MouseEvent): void {
    const el = this.$refs.facet as HTMLElement | undefined;
    if (!el) {
      return;
    }
    const isOutsideElement = el && !el.contains(e.target as Node);
    if (isOutsideElement) {
      this.isOpen = false;
    }
  }

  @Watch("activeFilterKeys")
  handleParamsChange(): void {
    this.handleFacetQueryFilter();
  }

  @searchResult.Action("queryFacet") queryFacet!: ({
    queryKey,
    facetKey,
  }: {
    queryKey: string;
    facetKey: string;
  }) => Promise<void>;

  toggleFacet(): void {
    this.isOpen = !this.isOpen;
    this.handleFacetQueryFilter();
  }

  handleFacetQueryFilter(): void {
    if (!this.filterQueryKey || !this.isOpen) {
      return;
    }
    this.queryFacet({
      queryKey: this.filterQueryKey,
      facetKey: this.facet.key,
    });
  }

  handleFacetSelect(item: FacetAction): void {
    this.$emit("select", item);
  }

  clear(): void {
    this.$emit("clear", this.facet);
    this.isOpen = false;
  }
}
</script>
