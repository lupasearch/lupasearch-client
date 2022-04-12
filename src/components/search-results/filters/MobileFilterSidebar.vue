<template>
  <div class="lupa-mobile-filter-sidebar" v-if="isMobileSidebarVisible">
    <div class="lupa-sidebar-top">
      <div class="lupa-filter-toggle-mobile" @click="handleMobileToggle"></div>
    </div>
    <div class="lupa-sidebar-filter-options">
      <SearchResultsFilters :options="options" :expandable="true" />
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

  @searchResult.Mutation("setSidebarVisibility") setSidebarVisibility!: ({
    visible,
  }: {
    visible: boolean;
  }) => void;

  @searchResult.State((state) => state.isMobileSidebarVisible)
  isMobileSidebarVisible!: boolean;

  handleMobileToggle(): void {
    this.setSidebarVisibility({ visible: false });
  }
}
</script>
