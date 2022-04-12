<template>
  <div id="lupa-search-results-layout-selection">
    <div
      :class="[
        'lupa-layout-selection-grid',
        classMap.layoutSelectionGrid,
        layout === 'Grid'
          ? 'lupa-layout-selection-active ' + classMap.layoutSelectionGridActive
          : '',
      ]"
      @click="handleLayoutChange('Grid')"
    >
      &#9783;
    </div>
    <div
      :class="[
        'lupa-layout-selection-list',
        classMap.layoutSelectionList,
        layout === 'List'
          ? 'lupa-layout-selection-active ' + classMap.layoutSelectionListActive
          : '',
      ]"
      data-cy="lupa-layout-selection-list"
      @click="handleLayoutChange('List')"
    >
      &#9776;
    </div>
  </div>
</template>
<script lang="ts">
import { ResultsLayout } from "@/types/search-results/ResultsLayout";
import Vue from "vue";
import Component from "vue-class-component";
import { namespace } from "vuex-class";

const searchResult = namespace("searchResult");
const options = namespace("options");

@Component({
  name: "searchResultsLayoutSelection",
})
export default class SearchResultsLayoutSelection extends Vue {
  @searchResult.State((state) => state.layout)
  layout!: ResultsLayout;

  @options.Getter("classMap") classMap!: Record<string, string>;

  @searchResult.Action("setLayout") setLayout!: (layout: ResultsLayout) => void;

  handleLayoutChange(layout: ResultsLayout): void {
    this.setLayout(layout);
  }
}
</script>
