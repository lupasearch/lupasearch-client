<template>
  <div
    class="lupa-child-category-item"
    :class="{ 'lupa-child-category-item-active': isActive }"
  >
    <a
      data-cy="lupa-child-category-item"
      :href="urlLink"
      @click="handleNavigation"
    >
      {{ title }}
    </a>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { CategoryFilterOptions } from "@/types/product-list/ProductListOptions";
import { handleRoutingEvent } from "@/utils/routing.utils";
import { linksMatch } from "@/utils/link.utils";

@Component({
  name: "categoryFilterItem",
})
export default class CategoryFilterItem extends Vue {
  @Prop() options!: CategoryFilterOptions;
  @Prop({ default: () => ({}) }) item!: Record<string, string>;

  get title(): string {
    return this.options.keys.titleKey
      ? this.item?.[this.options.keys.titleKey] ?? ""
      : "";
  }

  get urlLink(): string {
    return this.options.keys.urlKey
      ? this.item?.[this.options.keys.urlKey] ?? ""
      : "";
  }

  get isActive(): boolean {
    return linksMatch(
      this.urlLink,
      window.location.origin + window.location.pathname
    );
  }

  get hasEventRouting(): boolean {
    return this.options.routingBehavior === "event";
  }

  handleNavigation(event?: Event): void {
    handleRoutingEvent(this.urlLink, event, this.hasEventRouting);
  }
}
</script>
