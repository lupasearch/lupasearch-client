<template>
  <div class="lupa-search-result-facets">
    <FacetList
      v-if="regularFacets"
      :options="options"
      :facets="regularFacets"
      :currentFilters="currentFilters"
      :facetStyle="facetStyle"
      :clearable="clearable"
      @select="handleFacetSelect"
      @clear="clear"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  FacetStyle,
  ResultFacetOptions,
} from "@/types/search-results/SearchResultsOptions";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { FacetResult, FilterGroup } from "@getlupa/client-sdk/Types";
import FacetList from "./FacetList.vue";
import { scrollToSearchResults } from "@/utils/scroll.utils";
import { QueryParams } from "@/types/search-results/QueryParams";
import { FacetAction } from "@/types/search-results/FacetAction";
import {
  getFacetKey,
  toggleHierarchyFilter,
  toggleRangeFilter,
  toggleTermFilter,
} from "@/utils/filter.toggle.utils";
import { FilterType } from "@/types/search-results/Filters";

const searchResult = namespace("searchResult");
const params = namespace("params");

@Component({
  name: "facets",
  components: {
    FacetList,
  },
})
export default class Facets extends Vue {
  @Prop() options!: ResultFacetOptions;
  @Prop({ default: "" }) facetStyle!: FacetStyle;
  @Prop({ default: false }) clearable!: boolean;

  @params.Getter("filters") currentFilters!: FilterGroup;

  @searchResult.Getter("facets") facets: FacetResult[] | undefined;

  get promotedFacets(): FacetResult[] | undefined {
    return this.facets?.filter((f) =>
      this.options.promotedFacets?.includes(f.key)
    );
  }

  get regularFacets(): FacetResult[] | undefined {
    return this.facets?.filter(
      (f) => !this.options.promotedFacets?.includes(f.key)
    );
  }

  @params.Action("removeParams") removeParams!: ({
    paramsToRemove,
  }: {
    paramsToRemove?: string[];
  }) => { params: QueryParams };

  @params.Action("appendParams") appendParams!: ({
    params,
    paramsToRemove,
    encode,
  }: {
    params: { name: string; value: string | string[] }[];
    paramsToRemove?: string[];
    encode?: boolean;
  }) => { params: QueryParams };
  handleFacetSelect(facetAction: FacetAction): void {
    switch (facetAction.type) {
      case "terms":
        toggleTermFilter(this.appendParams, facetAction, this.currentFilters);
        break;
      case "range":
        toggleRangeFilter(this.appendParams, facetAction);
        break;
      case "hierarchy":
        toggleHierarchyFilter(
          this.appendParams,
          facetAction,
          this.currentFilters
        );
        break;
    }
    scrollToSearchResults();
  }

  clear(facet: FacetResult): void {
    const param = getFacetKey(facet.key, facet.type as FilterType);
    this.removeParams({ paramsToRemove: [param] });
  }
}
</script>
