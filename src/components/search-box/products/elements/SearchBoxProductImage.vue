<template>
  <ProductImage
    :item="item"
    :options="options"
    wrapper-class="lupa-search-box-image-wrapper"
    image-class="lupa-search-box-image"
  />
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { ImageDocumentElement } from "@/types/DocumentElement";
import ProductImage from "../../../common/ProductImage.vue";

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
