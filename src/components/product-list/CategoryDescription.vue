<template>
  <div class="lupa-category-overview" v-if="overviewVisible">
    <div class="lupa-category-title">{{ title }}</div>
    <div class="lupa-category-description">{{ description }}</div>
  </div>
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
export default class CategoryDescription extends Vue {
  @Prop() options!: ProductListOptions;

  get title(): string | undefined {
    return this.options.categories?.current?.title;
  }

  get description(): string | undefined {
    return this.options.categories?.current?.description;
  }

  get overviewVisible(): boolean {
    return Boolean(this.options.categories?.current?.title);
  }
}
</script>
