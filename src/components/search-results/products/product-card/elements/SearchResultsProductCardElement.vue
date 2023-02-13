<template>
  <search-box-element
    v-if="displayElement"
    :is="elementComponent"
    :item="item"
    :options="element"
    :labels="labels"
    :inStock="inStock"
    :link="link"
    @productEvent="handleProductEvent"
  >
  </search-box-element>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { SearchBoxOptionLabels } from "@/types/search-box/SearchBoxOptions";
import SearchResultsProductImage from "./SearchResultsProductImage.vue";
import SearchResultsProductTitle from "./SearchResultsProductTitle.vue";
import SearchResultsProductDescription from "./SearchResultsProductDescription.vue";
import SearchResultsProductRating from "./SearchResultsProductRating.vue";
import SearchResultsProductRegularPrice from "./SearchResultsProductRegularPrice.vue";
import SearchResultsProductPrice from "./SearchResultsProductPrice.vue";
import SearchResultsProductAddToCart from "./SearchResultsProductAddToCart.vue";
import SearchResultsProductCustom from "./SearchResultsProductCustom.vue";
import SearchResultsProductCustomHtmlElement from "./custom/SearchResultsProductCustomHtmlElement.vue";
import { DocumentElement, DocumentElementType } from "@/types/DocumentElement";
import SearchResultsProductSingleStarRating from "./SearchResultsProductSingleStarRating.vue";

@Component({
  name: "searchResultsProductCardElement",
  components: {
    SearchResultsProductImage,
    SearchResultsProductTitle,
    SearchResultsProductDescription,
    SearchResultsProductRating,
    SearchResultsProductSingleStarRating,
    SearchResultsProductRegularPrice,
    SearchResultsProductPrice,
    SearchResultsProductAddToCart,
    SearchResultsProductCustom,
    SearchResultsProductCustomHtmlElement,
  },
})
export default class SearchResultsProductCardElement extends Vue {
  @Prop() item!: Document;
  @Prop() element!: DocumentElement;
  @Prop() labels?: SearchBoxOptionLabels;
  @Prop() inStock?: boolean;
  @Prop({ default: "" }) link!: string;

  get elementComponent(): string {
    switch (this.element.type) {
      case DocumentElementType.IMAGE:
        return "searchResultsProductImage";
      case DocumentElementType.TITLE:
        return "searchResultsProductTitle";
      case DocumentElementType.DESCRIPTION:
        return "searchResultsProductDescription";
      case DocumentElementType.RATING:
        return "searchResultsProductRating";
      case DocumentElementType.SINGLE_STAR_RATING:
        return "SearchResultsProductSingleStarRating";
      case DocumentElementType.PRICE:
        return "searchResultsProductPrice";
      case DocumentElementType.REGULARPRICE:
        return "searchResultsProductRegularPrice";
      case DocumentElementType.ADDTOCART:
        return "searchResultsProductAddToCart";
      case DocumentElementType.CUSTOM:
        return "searchResultsProductCustom";
      case DocumentElementType.CUSTOM_HTML:
        return "searchResultsProductCustomHtmlElement";
    }
    return "searchResultsProductTitle";
  }

  get displayElement(): boolean {
    return this.element.display ? this.element.display(this.item) : true;
  }

  handleProductEvent(item: { type: string }): void {
    this.$emit("productEvent", item);
  }
}
</script>
