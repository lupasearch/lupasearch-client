<template>
  <div class="lupa-search-results-summary" v-if="totalItems > 0">
    <div v-html="summaryLabel"></div>
    <span
      v-if="clearable"
      class="lupa-filter-clear"
      data-cy="lupa-facets-summary-clear"
      @click="$emit('clear')"
      >✕</span
    >
  </div>
</template>
<script lang="ts">
import { addParamsToLabel } from "@/utils/string.utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const searchResult = namespace("searchResult");

@Component({
  name: "searchResultsSummary",
})
export default class SearchResultsSummary extends Vue {
  @Prop() label!: string;
  @Prop({ default: false }) clearable!: boolean;

  @searchResult.Getter("totalItems") totalItems!: number;

  @searchResult.Getter("itemRange") itemRange!: number[];

  get summaryLabel(): string {
    const range = this.itemRange.join("-");
    return addParamsToLabel(
      this.label,
      range,
      `<span>${this.totalItems}</span>`
    );
  }
}
</script>
