<template>
  <search-box-element
    v-if="displayElement"
    :is="elementComponent"
    :item="item"
    :options="element"
    :labels="labels"
  >
  </search-box-element>
</template>
<script lang="ts">
import Vue from "vue";
import SearchBoxProductImage from "./SearchBoxProductImage.vue";
import SearchBoxProductTitle from "./SearchBoxProductTitle.vue";
import SearchBoxProductDescription from "./SearchBoxProductDescription.vue";
import SearchBoxProductPrice from "./SearchBoxProductPrice.vue";
import SearchBoxProductRegularPrice from "./SearchBoxProductRegularPrice.vue";
import SearchBoxProductCustom from "./SearchBoxProductCustom.vue";
import SearchBoxProductCustomHtml from "./custom/SearchBoxProductCustomHtml.vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { DocumentElementType, DocumentElement } from "@/types/DocumentElement";
import { SearchBoxOptionLabels } from "@/types/search-box/SearchBoxOptions";

@Component({
  components: {
    SearchBoxProductImage,
    SearchBoxProductTitle,
    SearchBoxProductDescription,
    SearchBoxProductPrice,
    SearchBoxProductRegularPrice,
    SearchBoxProductCustom,
    SearchBoxProductCustomHtml,
  },
})
export default class SearchBoxProductElement extends Vue {
  @Prop() item!: Document;
  @Prop() element!: DocumentElement;
  @Prop() labels?: SearchBoxOptionLabels;

  get elementComponent(): string {
    switch (this.element.type) {
      case DocumentElementType.IMAGE:
        return "search-box-product-image";
      case DocumentElementType.TITLE:
        return "search-box-product-title";
      case DocumentElementType.DESCRIPTION:
        return "search-box-product-description";
      case DocumentElementType.PRICE:
        return "search-box-product-price";
      case DocumentElementType.REGULARPRICE:
        return "search-box-product-regular-price";
      case DocumentElementType.CUSTOM:
        return "search-box-product-custom";
      case DocumentElementType.CUSTOM_HTML:
        return "search-box-product-custom-html";
    }
    return "search-box-product-title";
  }

  get displayElement(): boolean {
    return this.element.display ? this.element.display(this.item) : true;
  }
}
</script>
