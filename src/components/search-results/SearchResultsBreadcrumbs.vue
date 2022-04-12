<template>
  <div id="lupa-search-results-breadcrumbs">
    <span
      class="lupa-search-results-breadcrumb"
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="index"
    >
      <a
        v-if="breadcrumb.link"
        class="lupa-search-results-breadcrumb-link"
        :href="breadcrumb.link"
        >{{ getLabel(breadcrumb.label) }}</a
      >
      <span v-else class="lupa-search-results-breadcrumb-text">{{
        getLabel(breadcrumb.label)
      }}</span>
      <span v-if="index < breadcrumbs.length - 1"> / </span>
    </span>
  </div>
</template>
<script lang="ts">
import { SearchResultsBreadcrumb } from "@/types/search-results/SearchResultsOptions";
import { addParamsToLabel } from "@/utils/string.utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const searchResult = namespace("searchResult");

@Component({
  name: "searchResultsBreadcrumbs",
})
export default class SearchResultsBreadcrumbs extends Vue {
  @Prop({ default: () => [] }) breadcrumbs!: SearchResultsBreadcrumb[];

  @searchResult.Getter("currentQueryText") currentQueryText!: string;

  getLabel(label: string): string {
    return addParamsToLabel(label, `'${this.currentQueryText}'`);
  }
}
</script>
