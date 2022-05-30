<template>
  <div id="lupa-search-results-sort" class="lupa-search-results-sort">
    <div id="lupa-select">
      <label class="lupa-select-label">{{ options.label }}</label>
      <select
        class="lupa-select-dropdown"
        data-cy="lupa-sort-select-dropdown"
        v-model="selectedKey"
        @change="handleSelect"
        ref="select"
      >
        <option
          v-for="option in sortItems"
          :key="option.key"
          :value="option.key"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>
<script lang="ts">
import { QUERY_PARAMS } from "@/constants/queryParams.const";
import { QueryParams } from "@/types/search-results/QueryParams";
import {
  SearchResultsSortOptions,
  SortOptions,
} from "@/types/search-results/SearchResultsSort";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";

const params = namespace("params");

@Component({
  name: "searchResultsSort",
})
export default class SearchResultsSort extends Vue {
  @Prop({ default: {} }) options!: SortOptions;

  selectedKey = "";

  @params.Getter("sort") sort!: string;

  get sortItems(): SearchResultsSortOptions[] {
    if (this.options.options && this.options.options.length) {
      return this.options.options;
    } else {
      return [];
    }
  }

  get defaultSortValue(): SearchResultsSortOptions {
    return (
      this.options.options.find((x) => x.default) ?? this.options.options[0]
    );
  }

  mounted(): void {
    this.setSortValue();
  }

  @Watch("sort")
  handleSortChange(): void {
    this.setSortValue();
  }

  setSortValue(): void {
    const optionToSelect = this.sortItems.find((x) => x.key === this.sort)?.key;
    this.selectedKey = optionToSelect ?? this.defaultSortValue?.key;
  }

  @params.Action("appendParams") appendParams!: ({
    params,
    paramsToRemove,
  }: {
    params: { name: string; value: string }[];
    paramsToRemove?: string[];
  }) => { params: QueryParams };

  handleSelect(): void {
    const value = this.sortItems.find((x) => x.key === this.selectedKey)?.key;
    if (!value) {
      return;
    }
    this.appendParams({
      params: [{ name: QUERY_PARAMS.SORT, value }],
      paramsToRemove: [QUERY_PARAMS.PAGE],
    });
  }
}
</script>
