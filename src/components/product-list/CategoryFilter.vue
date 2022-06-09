<template>
  <div class="lupa-category-filter" data-cy="lupa-category-filter">
    <div class="lupa-category-back">
      <a
        v-if="hasBackButton"
        data-cy="lupa-category-back"
        :href="backUrlLink"
        @click="handleNavigationBack"
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
        :href="parentUrlLink"
        :class="{ 'lupa-title-category': !hasBackButton }"
        @click="handleNavigationParent"
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
import {
  Options,
  SdkError,
  SearchQueryResult,
} from "@getlupa/client-sdk/Types";
import { CategoryFilterOptions } from "@/types/product-list/ProductListOptions";
import { namespace } from "vuex-class";
import CategoryFilterItem from "./CategoryFilterItem.vue";
import { handleRoutingEvent } from "@/utils/routing.utils";
import { linksMatch } from "@/utils/link.utils";
import { SearchResultsOptions } from "@/types/search-results/SearchResultsOptions";

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
  @options.State((o) => o.searchResultOptions)
  searchResultOptions!: SearchResultsOptions;

  get hasBackButton(): boolean {
    return Boolean(this.options.back?.title);
  }

  get hasEventRouting(): boolean {
    return this.options.routingBehavior === "event";
  }

  get backTitle(): string | undefined {
    return this.options.back?.title;
  }

  get backUrlLink(): string | undefined {
    return this.options.back?.url ?? "";
  }

  get parentTitle(): string | undefined {
    return this.options.parent?.title;
  }

  get parentUrlLink(): string | undefined {
    return this.options.parent?.url ?? "";
  }

  get isActive(): boolean {
    return linksMatch(
      this.parentUrlLink,
      window.location.origin + window.location.pathname
    );
  }

  async mounted(): Promise<void> {
    if (!this.options?.queryKey) {
      return;
    }
    const result = await lupaSearchSdk.query(
      this.options.queryKey,
      {
        searchText: "",
        filters: this.options.filters,
      },
      this.envOptions
    );
    this.handleResult(result);
  }

  handleResult(result: SearchQueryResult | SdkError): void {
    if (!result.success || !this.options?.queryKey) {
      return;
    }
    this.categoryChildren = result.items as Record<string, string>[];
    this.searchResultOptions.callbacks?.onCategoryFilterResults?.({
      queryKey: this.options.queryKey,
      hasResults: result.total > 0,
    });
  }

  getCategoryKey(item: Record<string, string>): string {
    return (
      item?.[this.options.keys.titleKey ?? ""] +
      item?.[this.options.keys.urlKey ?? ""]
    );
  }

  handleNavigationParent(event?: Event): void {
    if (!this.parentUrlLink) {
      return;
    }
    handleRoutingEvent(this.parentUrlLink, event, this.hasEventRouting);
  }

  handleNavigationBack(event?: Event): void {
    if (!this.backUrlLink) {
      return;
    }
    handleRoutingEvent(this.backUrlLink, event, this.hasEventRouting);
  }
}
</script>
