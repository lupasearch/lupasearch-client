<template>
  <div class="lupa-search-results-add-to-cart-wrapper">
    <div class="lupa-search-results-product-addtocart">
      <button
        @click.stop="handleClick"
        :class="loading ? 'lupa-add-to-cart-loading' : 'lupa-add-to-cart'"
        data-cy="lupa-add-to-cart"
        :disabled="!inStock || loading"
      >
        {{ label }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { namespace } from "vuex-class";
import { AddToCartElement } from "@/types/DocumentElement";

const searchResult = namespace("searchResult");

@Component({
  name: "searchResultsProductAddToCart",
})
export default class SearchResultsProductAddToCart extends Vue {
  @Prop() item!: Document;
  @Prop() options!: AddToCartElement;

  @Prop({ default: true }) inStock!: boolean;

  @searchResult.State((state) => state.addToCartAmount)
  addToCartAmount!: number;

  loading = false;

  get label(): string {
    return this.options.labels.addToCart;
  }

  async handleClick(): Promise<void> {
    this.loading = true;

    await this.options.action(this.item, this.addToCartAmount);
    this.$emit("productEvent", { type: "addToCart" });

    this.loading = false;
  }
}
</script>
<style></style>
