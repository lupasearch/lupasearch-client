<template>
  <div class="lupa-search-product-recommendations-wrapper">
    <div class="lupa-recommended-products" data-cy="lupa-recommended-products">
      <carousel
        v-if="!loading"
        :navigation-enabled="true"
        :pagination-enabled="false"
        :per-page-custom="pages"
      >
        <slide
          v-for="(product, index) in recommendations"
          :key="getProductKey(index, product)"
        >
          <SearchResultsProductCard
            :product="product"
            :options="options"
            :click-tracking-settings="clickTrackingSettings"
          />
        </slide>
      </carousel>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import lupaSearchSdk from "@getlupa/client-sdk";
import { Carousel, Slide } from "vue-carousel";
import { namespace } from "vuex-class";
import { ProductRecommendationOptions } from "@/types/recommendations/RecommendationsOptions";
import { Prop } from "vue-property-decorator";
import { getProductKey } from "@/utils/string.utils";
import { Document } from "@getlupa/client-sdk/Types";
import SearchResultsProductCard from "../search-results/products/product-card/SearchResultsProductCard.vue";
import { ProductClickTrackingSettings } from "@/types/AnalyticsOptions";
import { SearchResultsOptions } from "@/types/search-results/SearchResultsOptions";

const options = namespace("options");

@Component({
  name: "recommendations",
  components: {
    SearchResultsProductCard,
    Carousel,
    Slide,
  },
})
export default class Recommendations extends Vue {
  @Prop() options!: ProductRecommendationOptions;

  recommendations: Document[] = [];
  recommendationsType:
    | "recommendations_original"
    | "recommendations_lupasearch" = "recommendations_lupasearch";
  loading = true;

  @options.Mutation("setSearchResultOptions") setSearchResultOptions!: ({
    options,
  }: {
    options: SearchResultsOptions;
  }) => void;

  get pages(): number[][] {
    return this.options.carousel?.pageSizes ?? [];
  }

  mounted(): void {
    this.loadRecommendations();
    this.setSearchResultOptions({
      options: this.options as unknown as SearchResultsOptions,
    });
  }

  getProductKey(index: number, product: Document): string {
    return getProductKey(index.toString(), product, this.options.idKey);
  }

  loadRecommendations(): void {
    if (this.options.abTesting?.enabled) {
      const decisionValue = Math.random();
      if (
        !this.options.abTesting?.originalIds?.length ||
        decisionValue >
          (this.options.abTesting?.oldRecommenderDisplayRatio ?? 0)
      ) {
        this.loadLupaRecommendations();
      } else {
        this.loadOriginalRecommendations();
      }
    } else {
      this.loadLupaRecommendations();
    }
  }

  fetch() {
    this.loadRecommendations();
  }

  async loadOriginalRecommendations(): Promise<void> {
    this.recommendationsType = "recommendations_original";
    try {
      this.loading = true;
      const result = await lupaSearchSdk.queryByIds(
        this.options.queryKey,
        this.options.abTesting?.originalIds ?? [],
        this.options.options
      );
      if (!result.success) {
        return;
      }
      this.recommendations = result.items;
    } finally {
      this.loading = false;
    }
  }

  async loadLupaRecommendations(): Promise<void> {
    this.recommendationsType = "recommendations_lupasearch";
    try {
      this.loading = true;
      const result = await lupaSearchSdk.recommend(
        this.options.queryKey,
        this.options.itemId,
        this.options.options
      );
      if (!result.success) {
        return;
      }
      this.recommendations = result.recommended;
    } finally {
      this.loading = false;
    }
  }

  get clickTrackingSettings(): ProductClickTrackingSettings {
    return {
      eventType: "product_recommendation_click",
      listLabel: this.recommendationsType,
      eventLabel: this.recommendationsType,
    };
  }
}
</script>
