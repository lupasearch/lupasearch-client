<template>
  <div
    id="lupa-search-result-product-card"
    data-cy="lupa-search-result-product-card"
    class="lupa-search-result-product-card"
    :class="!isInStock ? 'lupa-out-of-stock' : ''"
    @click="handleClick"
  >
    <SearchResultsBadgeWrapper :options="badgesOptions" />
    <div :class="['lupa-search-result-product-contents', listLayoutClass]">
      <a
        class="lupa-search-result-product-image-section"
        :href="link"
        @click="handleNavigation"
      >
        <SearchResultsProductCardElement
          class="lupa-search-results-product-element"
          v-for="element in imageElements"
          :item="product"
          :element="element"
          :key="element.key"
          :labels="labels"
          :inStock="isInStock"
          :link="link"
        />
        <SearchResultsBadgeWrapper
          :options="badgesOptions"
          position="image"
          class="lupa-image-badges"
        />
        <div v-if="labels.outOfStock && !isInStock" class="lupa-out-of-stock">
          {{ labels.outOfStock }}
        </div>
      </a>
      <div class="lupa-search-result-product-details-section">
        <SearchResultsProductCardElement
          class="lupa-search-results-product-element"
          v-for="element in detailElements"
          :item="product"
          :element="element"
          :key="element.key"
          :labels="labels"
          :inStock="isInStock"
          :link="link"
          @productEvent="handleProductEvent"
        />
      </div>
      <div
        v-for="group of elementGroups"
        :key="group"
        :class="'lupa-element-group-' + group"
      >
        <SearchResultsProductCardElement
          class="lupa-search-results-product-element"
          v-for="element in getGroupElements(group)"
          :item="product"
          :element="element"
          :key="element.key"
          :labels="labels"
          :inStock="isInStock"
          :link="link"
          @productEvent="handleProductEvent"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { DocumentElement, DocumentElementType } from "@/types/DocumentElement";
import { TrackableEventData } from "@/types/search-box/Common";
import { BadgeOptions } from "@/types/search-results/BadgeOptions";
import {
  ResultsLayout,
  ResultsLayoutEnum,
} from "@/types/search-results/ResultsLayout";
import { RoutingBehavior } from "@/types/search-results/RoutingBehavior";
import {
  SearchResultsOptionLabels,
  SearchResultsOptions,
} from "@/types/search-results/SearchResultsOptions";
import { SearchResultsProductCardOptions } from "@/types/search-results/SearchResultsProductCardOptions";
import { generateLink } from "@/utils/link.utils";
import { handleRoutingEvent } from "@/utils/routing.utils";
import { Document, ReportableEventType } from "@getlupa/client-sdk/Types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import SearchResultsBadgeWrapper from "./badges/SearchResultsBadgeWrapper.vue";
import SearchResultsProductCardElement from "./elements/SearchResultsProductCardElement.vue";

const tracking = namespace("tracking");
const params = namespace("params");
const searchResult = namespace("searchResult");
const options = namespace("options");

@Component({
  name: "searchResultsProductCard",
  components: {
    SearchResultsBadgeWrapper,
    SearchResultsProductCardElement,
  },
})
export default class SearchResultsProductCard extends Vue {
  @Prop({ default: {} }) product!: Document;
  @Prop({ default: {} }) options!: SearchResultsProductCardOptions;
  @Prop({ default: false }) isAdditionalPanel!: boolean;

  isInStock = false;

  @searchResult.State((state) => state.layout)
  layout!: ResultsLayout;

  @options.Getter("searchResultsRoutingBehavior")
  searchResultsRoutingBehavior!: RoutingBehavior;

  @options.State((o) => o.searchResultOptions)
  searchResultOptions!: SearchResultsOptions;

  @params.Getter("query") query!: string;

  @tracking.Action("track") trackClick!: ({
    queryKey,
    data,
  }: {
    queryKey: string;
    data: TrackableEventData;
  }) => void;

  get listLayoutClass(): string {
    return this.layout === ResultsLayoutEnum.LIST && !this.isAdditionalPanel
      ? "lupa-search-result-product-contents-list"
      : "";
  }

  get badgesOptions(): BadgeOptions {
    return { ...this.options.badges, product: this.product };
  }

  get imageElements(): DocumentElement[] {
    return (
      this.options.elements?.filter(
        (e) => e.type === DocumentElementType.IMAGE && !e.group
      ) ?? []
    );
  }

  get detailElements(): DocumentElement[] {
    return (
      this.options.elements?.filter(
        (e) => e.type !== DocumentElementType.IMAGE && !e.group
      ) ?? []
    );
  }

  get labels(): SearchResultsOptionLabels {
    return this.options.labels ?? {};
  }

  get link(): string {
    if (!this.options.links?.details) {
      return "";
    }
    return generateLink(this.options.links?.details ?? "", this.product);
  }

  get hasEventRouting(): boolean {
    return this.searchResultsRoutingBehavior === "event";
  }

  get elementGroups(): string[] {
    return this.options.elements
      ?.map((e) => e.group)
      .filter((g): g is string => Boolean(g));
  }

  getGroupElements(group: string): DocumentElement[] {
    return this.options.elements?.filter((e) => e.group === group) ?? [];
  }

  mounted(): void {
    this.checkIfIsInStock();
  }

  async checkIfIsInStock(): Promise<void> {
    this.isInStock = this.options.isInStock
      ? await this.options.isInStock(this.product)
      : true;
  }

  get id(): string {
    return this.options.idKey
      ? (this.product[this.options.idKey] as string)
      : "";
  }

  get title(): string {
    return this.options.titleKey
      ? (this.product[this.options.titleKey] as string)
      : "";
  }

  handleClick(): void {
    this.trackClick({
      queryKey: this.options.queryKey,
      data: {
        itemId: this.id,
        searchQuery: this.query,
        type: "itemClick",
        analytics: {
          type: "search_product_click",
          label: this.title || this.id || this.link,
        },
      },
    });
    this.searchResultOptions.callbacks?.onProductClick?.({
      queryKey: this.query,
      hasResults: true,
    });
  }

  handleProductEvent(item: { type: ReportableEventType }): void {
    this.trackClick({
      queryKey: this.options.queryKey,
      data: {
        itemId: this.id,
        searchQuery: this.query,
        type: item.type,
        analytics:
          item.type === "addToCart"
            ? {
                type: "search_add_to_cart",
                label: this.title || this.id || this.link,
              }
            : undefined,
      },
    });
  }

  handleNavigation(event?: Event): void {
    handleRoutingEvent(this.link, event, this.hasEventRouting);
  }
}
</script>
