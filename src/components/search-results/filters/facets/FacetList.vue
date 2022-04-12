<template>
  <div class="lupa-search-result-facet-section">
    <div class="lupa-facets-title" v-if="options.labels.title">
      {{ options.labels.title }}
    </div>
    <div class="lupa-search-result-facet-list" :class="'lupa-' + facetStyle">
      <FacetDisplay
        v-for="facet of facets"
        :key="facet.key"
        :facet="facet"
        :currentFilters="currentFilters"
        :options="options"
        :clearable="clearable"
        @select="handleFacetSelect"
        @clear="clear"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { FacetResult, FilterGroup } from "@getlupa/client-sdk/Types";
import {
  FacetStyle,
  ResultFacetOptions,
} from "@/types/search-results/SearchResultsOptions";
import FacetDisplay from "./FacetDisplay.vue";
import { FacetAction } from "@/types/search-results/FacetAction";

@Component({
  name: "facetList",
  components: {
    FacetDisplay,
  },
})
export default class FacetList extends Vue {
  @Prop() options!: ResultFacetOptions;
  @Prop({ default: () => [] }) facets!: FacetResult[];
  @Prop({ default: () => ({}) }) currentFilters!: FilterGroup;

  @Prop({ default: "" }) facetStyle!: FacetStyle;
  @Prop({ default: false }) clearable!: boolean;

  handleFacetSelect(facetAction: FacetAction): void {
    this.$emit("select", facetAction);
  }

  clear(facet: FacetResult): void {
    this.$emit("clear", facet);
  }
}
</script>
