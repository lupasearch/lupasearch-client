<template>
  <a class="lupa-more-results" data-cy="lupa-more-results" @click="handleClick"
    >{{ labels.moreResults }} {{ totalCount }}</a
  >
</template>
<script lang="ts">
import {
  SearchBoxOptionLabels,
  SearchBoxOptions,
} from "@/types/search-box/SearchBoxOptions";
import { SearchQueryResult } from "@getlupa/client-sdk/Types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const searchBox = namespace("searchBox");

@Component({
  name: "searchBoxMoreResults",
})
export default class SearchBoxMoreResults extends Vue {
  @Prop() labels!: SearchBoxOptionLabels;
  @Prop({ default: false }) showTotalCount!: boolean;

  @searchBox.State((state) => state.docResults)
  docResults!: Record<string, SearchQueryResult>;

  @searchBox.State((state) => state.options)
  options!: SearchBoxOptions;

  get totalCount(): string {
    if (!this.showTotalCount) {
      return "";
    }
    const queryKey = this.options?.panels.find(
      (x) => x.type === "document"
    )?.queryKey;
    const total = queryKey ? this.docResults[queryKey]?.total : "";
    return total ? `(${total})` : "";
  }

  handleClick(): void {
    this.$emit("go-to-results");
  }
}
</script>
