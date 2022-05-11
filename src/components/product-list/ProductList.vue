<template>
  <SearchResults
    :options="componentOptions"
    :initial-filters="options.initialFilters"
    :is-product-list="true"
  />
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { ProductListOptions } from "@/types/product-list/ProductListOptions";
import SearchResults from "../search-results/SearchResults.vue";

@Component({
  name: "productList",
  components: {
    SearchResults,
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
