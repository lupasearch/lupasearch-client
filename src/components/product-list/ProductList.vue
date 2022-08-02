<template>
  <div>
    <SearchResults
      :options="componentOptions"
      :initial-filters="options.initialFilters"
      :is-product-list="true"
      ref="searchResults"
    >
      <CategoryDescription :options="options" />
    </SearchResults>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { ProductListOptions } from "@/types/product-list/ProductListOptions";
import SearchResults from "../search-results/SearchResults.vue";
import CategoryDescription from "./CategoryDescription.vue";

@Component({
  name: "productList",
  components: {
    SearchResults,
    CategoryDescription,
  },
})
export default class ProductList extends Vue {
  @Prop() options!: ProductListOptions;

  get componentOptions(): ProductListOptions {
    return {
      ...this.options,
      filters: {
        ...this.options.filters,
        categories: this.options.categories,
      },
    };
  }

  fetch(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs.searchResults as any)?.handleMounted();
  }
}
</script>
