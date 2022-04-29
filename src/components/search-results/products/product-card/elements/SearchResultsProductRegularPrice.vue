<template>
  <div
    class="lupa-search-results-product-regular-price"
    data-cy="lupa-search-results-product-regular-price"
  >
    {{ price }}
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { RegularPriceDocumentElement } from "@/types/DocumentElement";
import { formatPrice } from "@/utils/price.utils";
import { SearchResultsOptionLabels } from "@/types/search-results/SearchResultsOptions";

@Component({
  name: "searchResultsProductRegularPrice",
})
export default class SearchResultsProductRegularPrice extends Vue {
  @Prop() item!: Document;
  @Prop() options!: RegularPriceDocumentElement;
  @Prop() labels!: SearchResultsOptionLabels;

  get price(): string {
    return formatPrice(
      this.item[this.options.key] as string,
      this.labels?.currency,
      this.labels?.priceSeparator
    );
  }
}
</script>
