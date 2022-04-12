<template>
  <div
    class="lupa-search-results-product-description"
    :style="`-webkit-line-clamp: ${maxLines}`"
    v-if="isHtml"
    v-html="description"
  ></div>
  <div
    class="lupa-search-results-product-description"
    :style="`-webkit-line-clamp: ${maxLines}`"
    v-else
  >
    {{ description }}
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { DescriptionDocumentElement } from "@/types/DocumentElement";

@Component({
  name: "searchResultsProductDescription",
})
export default class SearchResultsProductDescription extends Vue {
  @Prop() item!: Document;
  @Prop() options!: DescriptionDocumentElement;

  get description(): unknown {
    return this.item[this.options.key];
  }

  get isHtml(): boolean {
    return this.options.isHtml ?? false;
  }

  get maxLines(): number {
    return this.options.maxLines;
  }
}
</script>
<style lang="scss">
@use "./styles/base/searchResults";

.lupa-search-results-product-description {
  max-height: searchResults.$product-description-height;

  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
