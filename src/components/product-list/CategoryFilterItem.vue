<template>
  <div
    class="lupa-child-category-item"
    :class="{ 'lupa-child-category-item-active': isActive }"
  >
    <a data-cy="lupa-child-category-item" :href="url">
      {{ title }}
    </a>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { CategoryFilterOptions } from "@/types/product-list/ProductListOptions";
import SearchResults from "../search-results/SearchResults.vue";

@Component({
  name: "productList",
  components: {
    SearchResults,
  },
})
export default class CategoryFilterItem extends Vue {
  @Prop() options!: CategoryFilterOptions;
  @Prop({ default: () => ({}) }) item!: Record<string, string>;

  get title(): string {
    return this.options.keys.titleKey
      ? this.item?.[this.options.keys.titleKey] ?? ""
      : "";
  }

  get url(): string {
    return this.options.keys.urlKey
      ? this.item?.[this.options.keys.urlKey] ?? ""
      : "";
  }

  get isActive(): boolean {
    return window.location.href === this.url;
  }
}
</script>
