<template>
  <SearchBoxProducts
    :items="searchResult.items"
    :panelOptions="panel"
    :labels="labels"
    :inputValue="inputValue"
    @product-click="$emit('product-click')"
  />
</template>
<script lang="ts">
import { SdkOptions } from "@/types/General";
import { SearchBoxOptionLabels } from "@/types/search-box/SearchBoxOptions";
import { DocumentSearchBoxPanel } from "@/types/search-box/SearchBoxPanel";
import { debounce } from "@/utils/debounce.utils";
import {
  Options,
  PublicQuery,
  SearchQueryResult,
} from "@getlupa/client-sdk/Types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import SearchBoxProducts from "./SearchBoxProducts.vue";

const searchBox = namespace("searchBox");
const dynamicData = namespace("dynamicData");

@Component({
  name: "searchBoxProductsWrapper",
  components: {
    SearchBoxProducts,
  },
})
export default class SearchBoxProductsWrapper extends Vue {
  @Prop() panel!: DocumentSearchBoxPanel;
  @Prop() options!: SdkOptions;
  @Prop() inputValue!: string;
  @Prop() labels!: SearchBoxOptionLabels;
  @Prop() debounce?: number;

  @searchBox.State((state) => state.docResults) docResults!: Record<
    string,
    SearchQueryResult
  >;

  get searchResult(): SearchQueryResult {
    return this.docResults[this.panel.queryKey] ?? {};
  }

  @searchBox.Action("queryDocuments") queryDocuments!: ({
    queryKey,
    publicQuery,
    options,
  }: {
    queryKey: string;
    publicQuery: PublicQuery;
    options?: Options;
  }) => Promise<{
    queryKey: string;
    result?: SearchQueryResult;
  }>;

  @dynamicData.Action("enhanceSearchResultsWithDynamicData") enhanceData!: ({
    result,
    mode,
  }: {
    result: SearchQueryResult;
    mode: "searchBox";
  }) => Promise<void>;

  created(): void {
    this.getItemsDebounced();
  }

  @Watch("inputValue")
  onInputChange(): void {
    this.getItemsDebounced();
  }

  getItemsDebounced = debounce(this.getItems, this.debounce);

  enhanceDataDebounced = debounce(this.enhancePanelData, this.debounce);

  async enhancePanelData(): Promise<void> {
    await this.enhanceData({ result: this.searchResult, mode: "searchBox" });
  }

  getItems(): void {
    this.queryDocuments({
      queryKey: this.panel.queryKey,
      publicQuery: { searchText: this.inputValue, limit: this.panel.limit },
      options: this.options,
    }).then(({ result }) => {
      if (!result?.items.length) {
        return;
      }
      this.$emit("fetched", {
        items: result.items,
        type: this.panel.type,
      });
      this.enhanceDataDebounced();
    });
  }
}
</script>

<style></style>
