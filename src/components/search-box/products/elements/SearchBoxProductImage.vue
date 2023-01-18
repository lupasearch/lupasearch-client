<template>
  <ProductImage
    :item="item"
    :options="options"
    wrapperClass="lupa-search-box-image-wrapper"
    imageClass="lupa-search-box-image"
  />
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { ImageDocumentElement } from "@/types/DocumentElement";
import ProductImage from "@/components/common/ProductImage.vue";

@Component({
  components: {
    ProductImage,
  },
})
export default class SearchBoxProductImage extends Vue {
  @Prop() item!: Document;
  @Prop() options!: ImageDocumentElement;
}
</script>
