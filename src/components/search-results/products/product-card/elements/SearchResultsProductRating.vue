<template>
  <div id="lupa-search-results-rating">
    <div class="lupa-ratings">
      <div class="lupa-ratings-base">
        <div
          v-for="(star, index) in baseStars"
          :key="index"
          v-html="star"
          class="lupa-rating lupa-rating-not-highlighted"
        />
      </div>
      <div class="lupa-rating-wrapper">
        <div
          class="lupa-ratings-highlighted"
          :style="{ width: ratingPercentage + '%' }"
        >
          <div
            v-for="(star, index) in highlightedStars"
            :key="index"
            v-html="star"
            class="lupa-rating lupa-rating-highlighted"
          />
        </div>
      </div>
    </div>
    <a :href="ratingLink" class="lupa-total-ratings">{{ totalRatings }}</a>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { RatingElement } from "@/types/DocumentElement";
import { generateLink } from "@/utils/link.utils";
import { RATING_STAR_HTML } from "@/constants/global.const";

const STAR_COUNT = 5;

@Component({
  name: "searchResultsProductRating",
})
export default class SearchResultsProductRating extends Vue {
  @Prop() item!: Document;
  @Prop() options!: RatingElement;

  get totalRatings(): string {
    return `(${this.options.labels.numberOfRatings}${
      this.item[this.options.totalKey] || 0
    })`;
  }

  get currentRating(): number {
    return Math.round((this.item[this.options.key] as number) || 0);
  }

  get baseStars(): string[] {
    return new Array(STAR_COUNT).fill(RATING_STAR_HTML);
  }

  get highlightedStars(): string[] {
    return new Array(STAR_COUNT).fill(RATING_STAR_HTML);
  }

  get ratingPercentage(): number {
    return this.options.getRatingPercentage
      ? this.options.getRatingPercentage(this.item)
      : this.currentRating;
  }

  get ratingLink(): string {
    if (!this.options.links?.ratingDetails) {
      return "";
    }
    return generateLink(this.options.links.ratingDetails, this.item);
  }
}
</script>
