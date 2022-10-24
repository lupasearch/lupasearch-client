<template>
  <div id="lupa-search-box-products">
    <SearchBoxProduct
      v-for="(item, index) in items"
      :key="index"
      :item="item"
      :panelOptions="panelOptions"
      :labels="labels"
      :highlighted="index === highlightedIndex"
      :inputValue="inputValue"
      @product-click="$emit('product-click')"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { DocumentSearchBoxPanel } from "@/types/search-box/SearchBoxPanel";
import SearchBoxProduct from "./SearchBoxProduct.vue";
import { SearchBoxOptionLabels } from "@/types/search-box/SearchBoxOptions";
import { namespace } from "vuex-class";

const searchBox = namespace("searchBox");

@Component({
  components: { SearchBoxProduct },
})
export default class SearchBoxProducts extends Vue {
  @Prop({ default: () => [] }) items!: Document[];
  @Prop({ default: "" }) inputValue!: string;
  @Prop() panelOptions!: DocumentSearchBoxPanel;
  @Prop() labels!: SearchBoxOptionLabels;

  @searchBox.Getter("highlightedItem") highlightedItem?: {
    queryKey: string;
    index: number;
  };

  get highlightedIndex(): number {
    if (this.panelOptions.queryKey !== this.highlightedItem?.queryKey) {
      return -1;
    }
    return this.highlightedItem?.index ?? -1;
  }
}
</script>
