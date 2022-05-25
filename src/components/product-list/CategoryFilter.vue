<template>
  <div class="lupa-category-filter" data-cy="lupa-category-filter">
    <div class="lupa-category-back">
      <a
        v-if="hasBackButton"
        data-cy="lupa-category-back"
        :href="backUrl"
        v-on="
          hasDirectRouting ? {} : { click: () => handleNavigation(backUrlLink) }
        "
      >
        {{ backTitle }}
      </a>
    </div>
    <div
      class="lupa-current-category"
      :class="{ 'lupa-current-category-active': isActive }"
    >
      <a
        data-cy="lupa-current-category"
        :href="parentUrl"
        :class="{ 'lupa-title-category': !hasBackButton }"
        v-on="
          hasDirectRouting
            ? {}
            : { click: () => handleNavigation(parentUrlLink) }
        "
        >{{ parentTitle }}</a
      >
    </div>

    <div class="lupa-child-category-list">
      <CategoryFilterItem
        v-for="child of categoryChildren"
        :key="getCategoryKey(child)"
        :item="child"
        :options="options"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import lupaSearchSdk from "@getlupa/client-sdk";
import { Options } from "@getlupa/client-sdk/Types";
import { CategoryFilterOptions } from "@/types/product-list/ProductListOptions";
import { namespace } from "vuex-class";
import CategoryFilterItem from "./CategoryFilterItem.vue";
import { emitRoutingEvent } from "@/utils/routing.utils";

const options = namespace("options");

@Component({
  name: "categoryFilter",
  components: {
    CategoryFilterItem,
  },
})
export default class CategoryFilter extends Vue {
  @Prop() options!: CategoryFilterOptions;
  categoryChildren: Record<string, string>[] = [];

  @options.Getter("envOptions") envOptions!: Options;

  get hasBackButton(): boolean {
    return Boolean(this.options.back?.title);
  }

  get hasDirectRouting(): boolean {
    return this.options.routingBehavior === "direct-link";
  }

  get backTitle(): string | undefined {
    return this.options.back?.title;
  }

  get backUrl(): string | undefined {
    return this.hasDirectRouting ? this.backUrlLink : undefined;
  }

  get backUrlLink(): string | undefined {
    return this.options.back?.url;
  }

  get parentTitle(): string | undefined {
    return this.options.parent?.title;
  }

  get parentUrl(): string | undefined {
    return this.hasDirectRouting ? this.options.parent?.url : undefined;
  }

  get parentUrlLink(): string | undefined {
    return this.options.parent?.url;
  }

  get isActive(): boolean {
    return this.parentUrl === window.location.href;
  }

  async mounted(): Promise<void> {
    const result = await lupaSearchSdk.query(
      this.options.queryKey,
      {
        searchText: "",
        filters: this.options.filters,
      },
      this.envOptions
    );
    if (!result.success) {
      return;
    }
    this.categoryChildren = result.items as Record<string, string>[];
  }

  getCategoryKey(item: Record<string, string>): string {
    return (
      item?.[this.options.keys.titleKey ?? ""] +
      item?.[this.options.keys.urlKey ?? ""]
    );
  }

  handleNavigation(url: string): void {
    emitRoutingEvent(url);
  }
}
</script>
