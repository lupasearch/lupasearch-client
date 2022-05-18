<template>
  <div
    class="lupa-child-category-item"
    :class="{ 'lupa-child-category-item-active': isActive }"
  >
    <a
      data-cy="lupa-child-category-item"
      :href="url"
      v-on="hasDirectRouting ? {} : { click: handleNavigation }"
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
import { emitRoutingEvent } from "@/utils/routing.utils";

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

  get url(): string | undefined {
    if (!this.hasDirectRouting) {
      return undefined;
    }
    return this.urlLink;
  }

  get isActive(): boolean {
    return window.location.href === this.urlLink;
  }

  get hasDirectRouting(): boolean {
    return this.options.routingBehavior === "direct-link";
  }

  handleNavigation(): void {
    emitRoutingEvent(this.urlLink);
  }
}
</script>
