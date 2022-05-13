<template>
  <div>
    <SearchResults
      :options="componentOptions"
      :initial-filters="options.initialFilters"
      :is-product-list="true"
    />
    <CategoryDescription :options="options" />
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
}
</script>
