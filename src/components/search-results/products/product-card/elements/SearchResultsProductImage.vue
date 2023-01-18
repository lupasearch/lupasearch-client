<template>
  <ProductImage
    :item="item"
    :options="options"
    wrapper-class="lupa-search-results-image-wrapper"
    image-class="lupa-search-results-image"
  />
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { ImageDocumentElement } from "@/types/DocumentElement";
import ProductImage from "@/components/common/ProductImage.vue";

@Component({
  name: "searchResultsProductImage",
  components: {
    ProductImage,
  },
})
export default class SearchResultsProductImage extends Vue {
  @Prop() item!: Document;
  @Prop() options!: ImageDocumentElement;
}
</script>
