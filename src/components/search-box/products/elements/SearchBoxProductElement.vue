<template>
  <search-box-element
    v-if="displayElement"
    :is="elementComponent"
    :item="enhancedItem"
    :options="element"
    :labels="labels"
    :class="{ 'lupa-loading-dynamic-data': isLoadingDynamicData }"
  >
  </search-box-element>
</template>
<script lang="ts">
import Vue from "vue";
import { namespace } from "vuex-class";
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

const dynamicData = namespace("dynamicData");

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

  @dynamicData.State("loading") loading!: boolean;

  @dynamicData.State("dynamicDataIdMap") dynamicDataIdMap!: Record<
    string,
    Document
  >;

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

  get isLoadingDynamicData(): boolean {
    return Boolean(this.element.dynamic && this.loading);
  }

  get enhancedItem(): Document {
    if (!this.item?.id) {
      return this.item;
    }
    const enhancementData =
      this.dynamicDataIdMap?.[this.item?.id as string] ?? {};
    return {
      ...this.item,
      ...enhancementData,
    };
  }
}
</script>
