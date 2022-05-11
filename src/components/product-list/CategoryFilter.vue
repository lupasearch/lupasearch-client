<template>
  <div class="lupa-category-filter" data-cy="lupa-category-filter">
    <div class="lupa-category-back">
      <a v-if="hasBackButton" data-cy="lupa-category-back" :href="backUrl">
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
import getLupaSdk from "@getlupa/client-sdk";
import { CategoryFilterOptions } from "@/types/product-list/ProductListOptions";
import { namespace } from "vuex-class";
import { Options } from "@getlupa/client-sdk/Types";
import CategoryFilterItem from "./CategoryFilterItem.vue";

const options = namespace("options");

@Component({
  name: "productList",
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

  get backTitle(): string | undefined {
    return this.options.back?.title;
  }

  get backUrl(): string | undefined {
    return this.options.back?.url;
  }

  get parentTitle(): string | undefined {
    return this.options.parent?.title;
  }

  get parentUrl(): string | undefined {
    return this.options.parent?.url;
  }

  get isActive(): boolean {
    return this.parentUrl === window.location.href;
  }

  async mounted(): Promise<void> {
    // Load categories by query key and filters
    const result = await getLupaSdk.query(
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
}
</script>
