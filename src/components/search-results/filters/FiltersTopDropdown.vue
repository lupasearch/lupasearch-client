<template>
  <div id="lupa-search-result-filters">
    <Facets
      v-if="options.facets"
      :options="options.facets"
      :facet-style="options.facets.style.type"
      :clearable="true"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { SearchResultsFilterOptions } from "@/types/search-results/SearchResultsOptions";
import { Prop } from "vue-property-decorator";
import CurrentFilters from "./CurrentFilters.vue";
import Facets from "./facets/Facets.vue";

@Component({
  name: "filtersTopDropdown",
  components: {
    CurrentFilters,
    Facets,
  },
})
export default class FiltersTopDropdown extends Vue {
  @Prop() options!: SearchResultsFilterOptions;
}
</script>
