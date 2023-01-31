<template>
  <div id="lupa-search-results-rating">
    <div v-html="star" class="lupa-rating lupa-rating-highlighted" />
    <div class="lupa-ratings">{{ rating }}</div>
    <a :href="ratingLink" class="lupa-total-ratings">{{ totalRatings }}</a>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { SingleStarRatingElement } from "@/types/DocumentElement";
import { generateLink } from "@/utils/link.utils";
import { RATING_STAR_HTML } from "@/constants/global.const";

@Component({
  name: "SearchResultsProductSingleStarRating",
})
export default class SearchResultsProductSingleStarRating extends Vue {
  @Prop() item!: Document;
  @Prop() options!: SingleStarRatingElement;

  get totalRatings(): string {
    return `(${this.options.labels.numberOfRatings}${
      this.item[this.options.totalKey] || 0
    })`;
  }

  get ratingLink(): string {
    if (!this.options.links?.ratingDetails) {
      return "";
    }
    return generateLink(this.options.links.ratingDetails, this.item);
  }

  get rating(): string {
    if (!this.options.displayRating) {
      return this.item[this.options.key] as string;
    }
    return this.options.displayRating(this.item);
  }

  get star(): string {
    return RATING_STAR_HTML;
  }
}
</script>
