<template>
  <div
    class="lupa-search-result-current-filters"
    :class="{ expandable: expandable }"
    data-cy="lupa-search-result-current-filters"
    v-if="hasFilters"
  >
    <div class="lupa-current-filter-title" @click="isOpen = !isOpen">
      <div class="lupa-filter-title-text">
        {{ options.labels.title }}
        <span class="lupa-filter-count" v-if="expandable">
          ({{ currentFilterCount }})
        </span>
      </div>
      <div
        v-if="expandable"
        class="lupa-filter-title-caret"
        :class="isOpen && 'open'"
      ></div>
    </div>
    <div class="filter-values" v-if="!expandable || isOpen">
      <div class="lupa-current-filter-list">
        <CurrentFilterDisplay
          v-for="filter of labeledFilters"
          :key="filter.key + '_' + filter.value"
          :filter="filter"
          @remove="handleRemove"
        />
      </div>
      <div
        class="lupa-clear-all-filters"
        data-cy="lupa-clear-all-filters"
        @click="handleClearAll"
      >
        {{ options.labels.clearAll }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ResultCurrentFilterOptions } from "@/types/search-results/SearchResultsOptions";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { FacetResult, FilterGroup } from "@getlupa/client-sdk/Types";
import { LabeledFilter } from "@/types/search-results/Filters";
import CurrentFilterDisplay from "./CurrentFilterDisplay.vue";
import { QueryParams } from "@/types/search-results/QueryParams";
import { FACET_PARAMS_TYPE, QUERY_PARAMS } from "@/constants/queryParams.const";
import {
  toggleHierarchyFilter,
  toggleTermFilter,
} from "@/utils/filter.toggle.utils";

const searchResult = namespace("searchResult");
const params = namespace("params");

@Component({
  name: "currentFilters",
  components: {
    CurrentFilterDisplay,
  },
})
export default class CurrentFilters extends Vue {
  @Prop() options!: ResultCurrentFilterOptions;
  @Prop({ default: false }) expandable!: boolean;

  isOpen = false;

  @searchResult.Getter("filters") currentFilters!: FilterGroup;

  @searchResult.Getter("facets") facets: FacetResult[] | undefined;

  @searchResult.Getter("labeledFilters") labeledFilters!: LabeledFilter[];

  @searchResult.Getter("currentFilterCount") currentFilterCount!: number;

  get hasFilters(): boolean {
    return this.labeledFilters?.length > 0;
  }

  @params.Action("removeParams") removeParams!: ({
    paramsToRemove,
  }: {
    paramsToRemove?: string[];
  }) => { params: QueryParams };

  @params.Action("removeAllFilters") removeAllFilters!: () => {
    params: QueryParams;
  };
  handleClearAll = (): void => {
    this.removeAllFilters();
  };

  @params.Action("appendParams") appendParams!: ({
    params,
    paramsToRemove,
  }: {
    params: { name: string; value: string | string[] }[];
    paramsToRemove?: string[];
  }) => { params: QueryParams };
  handleRemove({ filter }: { filter: LabeledFilter }): void {
    switch (filter.type) {
      case "terms":
        toggleTermFilter(
          this.appendParams,
          { type: "terms", value: filter.value, key: filter.key },
          this.currentFilters
        );
        break;
      case "hierarchy":
        toggleHierarchyFilter(
          this.appendParams,
          { type: "hierarchy", value: filter.value, key: filter.key },
          this.currentFilters,
          true
        );
        break;
      case "range":
        this.removeParams({
          paramsToRemove: [
            QUERY_PARAMS.PAGE,
            `${FACET_PARAMS_TYPE.RANGE}${filter.key}`,
          ],
        });
        break;
    }
  }
}
</script>
