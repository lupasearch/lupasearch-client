<template>
  <div class="lupa-search-box-product-regular-price">{{ price }}</div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { RegularPriceDocumentElement } from "@/types/DocumentElement";
import { formatPrice } from "@/utils/price.utils";
import { SearchBoxOptionLabels } from "@/types/search-box/SearchBoxOptions";

@Component
export default class SearchBoxProductRegularPrice extends Vue {
  @Prop() item!: Document;
  @Prop() options!: RegularPriceDocumentElement;
  @Prop() labels!: SearchBoxOptionLabels;

  get price(): string {
    return formatPrice(
      this.item[this.options.key] as string,
      this.labels.currency
    );
  }
}
</script>
