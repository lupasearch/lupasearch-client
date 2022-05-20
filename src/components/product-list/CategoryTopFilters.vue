<template>
  <div class="lupa-category-top-mobile-filters">
    <div class="lupa-category-back" v-if="hasBackButton">
      <a
        data-cy="lupa-category-back"
        :href="backUrlLink"
        @click="handleNavigationBack"
      >
        {{ backTitle }}
      </a>
    </div>
    <SearchResultsToolbar
      class="lupa-toolbar-mobile"
      pagination-location="top"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import { ProductListOptions } from "@/types/product-list/ProductListOptions";
import { handleRoutingEvent } from "@/utils/routing.utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SearchResultsToolbar from "../search-results/products/SearchResultsToolbar.vue";

@Component({
  name: "categoryTopFilters",
  components: {
    SearchResultsToolbar,
  },
})
export default class CategoryTopFilters extends Vue {
  @Prop() options!: ProductListOptions;

  get hasBackButton(): boolean {
    return Boolean(this.options.categories?.back?.title);
  }

  get backTitle(): string | undefined {
    return this.options.categories?.back?.title;
  }

  get backUrlLink(): string | undefined {
    return this.options.categories?.back?.url ?? "";
  }

  get hasEventRouting(): boolean {
    return this.options.routingBehavior === "event";
  }

  handleNavigationBack(event?: Event): void {
    if (!this.backUrlLink) {
      return;
    }
    handleRoutingEvent(this.backUrlLink, event, this.hasEventRouting);
  }
}
</script>
