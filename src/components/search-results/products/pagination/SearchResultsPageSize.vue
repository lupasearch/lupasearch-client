<template>
  <div
    id="lupa-search-results-page-size"
    data-cy="lupa-search-results-page-size"
  >
    <div id="lupa-select">
      <label class="lupa-select-label">{{ label }}</label>
      <select
        class="lupa-select-dropdown"
        data-cy="lupa-page-size-select-dropdown"
        @change="handleSelect"
        ref="select"
      >
        <option v-for="option in options.sizes" :key="option">
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>
<script lang="ts">
import { QUERY_PARAMS } from "@/constants/queryParams.const";
import { PaginationPageSize } from "@/types/search-results/PaginationOptions";
import { QueryParams } from "@/types/search-results/QueryParams";
import { pickClosestNumber } from "@/utils/picker.utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const params = namespace("params");

@Component({
  name: "searchResultsPageSize",
})
export default class SearchResultsPageSize extends Vue {
  @Prop({ default: "" }) label!: string;
  @Prop({ default: {} }) options!: PaginationPageSize;

  @params.Getter("limit") limit!: number;

  updated(): void {
    const select = this.$refs.select as HTMLSelectElement;
    if (select) {
      select.value = pickClosestNumber(
        this.options.sizes,
        this.limit
      ).toString();
    }
  }

  @params.Action("appendParams") appendParams!: ({
    params,
    paramsToRemove,
  }: {
    params: { name: string; value: string }[];
    paramsToRemove?: string[];
  }) => { params: QueryParams };

  handleSelect(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    this.appendParams({
      params: [{ name: QUERY_PARAMS.LIMIT, value: value }],
      paramsToRemove: [QUERY_PARAMS.PAGE],
    });
  }
}
</script>
