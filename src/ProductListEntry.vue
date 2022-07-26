<template>
  <ProductList :options="productListOptions" ref="productList" />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import cloneDeep from "lodash.clonedeep";
import ProductList from "./components/product-list/ProductList.vue";
import { ProductListOptions } from "./types/product-list/ProductListOptions";

@Component({
  name: "productList",
  components: {
    ProductList,
  },
})
export default class ProductListEntry extends Vue {
  @Prop() productListOptions!: ProductListOptions;

  get fullProductListOptions(): ProductListOptions {
    return cloneDeep(this.productListOptions);
  }

  fetch(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs.productList as any)?.fetch();
  }
}
</script>
