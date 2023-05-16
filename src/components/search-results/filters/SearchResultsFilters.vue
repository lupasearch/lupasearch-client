<template>
  <div id="lupa-search-result-filters" class="lupa-search-result-filters">
    <CurrentFilters
      v-if="showCurrentFilters"
      :options="options.currentFilters"
      :expandable="expandable"
    />
    <CategoryFilter
      v-if="options.categories"
      :options="options.categories"
      ref="categoryFilters"
    />
    <Facets v-if="options.facets" :options="options.facets" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { SearchResultsFilterOptions } from "@/types/search-results/SearchResultsOptions";
import { Prop } from "vue-property-decorator";
import CurrentFilters from "./CurrentFilters.vue";
import Facets from "./facets/Facets.vue";
import CategoryFilter from "../../product-list/CategoryFilter.vue";

@Component({
  name: "searchResultsFilters",
  components: {
    CurrentFilters,
    Facets,
    CategoryFilter,
  },
})
export default class SearchResultsFilters extends Vue {
  @Prop() options!: SearchResultsFilterOptions;
  @Prop({ default: false }) expandable!: boolean;

  get desktopFiltersVisible(): boolean {
    // Default is true
    return this.options.currentFilters?.visibility?.desktopSidebar ?? true;
  }

  get currentFiltersVisible(): boolean {
    return (
      this.options.currentFilters?.visibility?.mobileSidebar ||
      this.desktopFiltersVisible
    );
  }

  get showCurrentFilters(): boolean {
    return this.currentFiltersVisible ? Boolean(this.options.facets) : false;
  }

  fetch(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs.categoryFilters as any)?.fetch();
  }
}
</script>
