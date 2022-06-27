<template>
  <div class="lupa-mobile-filter-sidebar" v-if="isMobileSidebarVisible">
    <div class="lupa-sidebar-top">
      <div class="lupa-sidebar-title">
        {{ sidebarTitle }}
        <span v-if="isFilterCountVisible" class="lupa-sidebar-filter-count">{{
          currentFilterCount
        }}</span>
      </div>
      <div class="lupa-filter-toggle-mobile" @click="handleMobileToggle"></div>
    </div>
    <div class="lupa-sidebar-filter-options">
      <SearchResultsFilters
        :options="options"
        :expandable="isActiveFiltersExpanded"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { SearchResultsFilterOptions } from "@/types/search-results/SearchResultsOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import SearchResultsFilters from "./SearchResultsFilters.vue";

const searchResult = namespace("searchResult");

@Component({
  name: "mobileFilerSidebar",
  components: {
    SearchResultsFilters,
  },
})
export default class MobileFilterSidebar extends Vue {
  @Prop() options!: SearchResultsFilterOptions;

  @searchResult.Action("setSidebarState") setSidebarState!: ({
    visible,
  }: {
    visible: boolean;
  }) => void;

  @searchResult.State((state) => state.isMobileSidebarVisible)
  isMobileSidebarVisible!: boolean;

  @searchResult.Getter("currentFilterCount") currentFilterCount!: number;

  get sidebarTitle(): string {
    return this.options.facets?.labels?.title ?? "";
  }

  get isFilterCountVisible(): boolean {
    return (
      Boolean(this.options.currentFilters?.mobileSidebar?.showFilterCount) &&
      this.currentFilterCount > 0
    );
  }

  get isActiveFiltersExpanded(): boolean {
    return !this.options.currentFilters?.mobileSidebar?.activeFiltersExpanded;
  }

  handleMobileToggle(): void {
    this.setSidebarState({ visible: false });
  }
}
</script>
