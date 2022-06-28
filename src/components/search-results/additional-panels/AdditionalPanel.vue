<template>
  <div v-if="hasResults" class="lupa-results-additional-panel">
    <div
      class="lupa-results-additional-panel-items"
      data-cy="lupa-results-additional-panel-items"
    >
      <SearchResultsProductCard
        v-for="(item, index) in visibleItems"
        :key="index"
        :product="item"
        :options="panel"
        :isAdditionalPanel="true"
      />
    </div>

    <div
      v-if="displayShowMore"
      class="lupa-additional-panel-show-more"
      :class="{ 'lupa-additional-panel-show-less': showAll }"
      data-cy="lupa-additional-panel-show-more"
      @click="toggleShowMore"
    >
      {{
        showAll
          ? addParams(panel.labels.showLess, itemCount)
          : addParams(panel.labels.showMore, itemCount)
      }}
    </div>
  </div>
</template>
<script lang="ts">
import { SearchResultsAdditionalPanelOptions } from "@/types/search-results/SearchResultsAdditionalPanelOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import lupaSearchSdk from "@getlupa/client-sdk";
import { SdkOptions } from "@/types/General";
import { SearchQueryResult } from "@getlupa/client-sdk/Types";
import SearchResultsProductCard from "../products/product-card/SearchResultsProductCard.vue";
import { Document } from "@getlupa/client-sdk/Types";
import { addParamsToLabel } from "@/utils/string.utils";
import { getLupaTrackingContext } from "@/utils/tracking.utils";
import { SearchResultsOptions } from "@/types/search-results/SearchResultsOptions";

const params = namespace("params");
const options = namespace("options");

@Component({
  name: "additionalPanel",
  components: { SearchResultsProductCard },
})
export default class AdditionalPanels extends Vue {
  @Prop({ required: true }) panel!: SearchResultsAdditionalPanelOptions;
  @Prop({ required: true }) options!: SdkOptions;

  result: SearchQueryResult = {
    total: 0,
    searchText: "",
    items: [],
    success: true,
  };

  @params.Getter("query") query!: string;
  @options.State((o) => o.searchResultOptions)
  searchResultOptions!: SearchResultsOptions;

  showAll = false;

  get displayShowMore(): boolean {
    return this.items.length > this.panel.initialCountLimit;
  }

  get itemCount(): number {
    return this.result?.items.length ?? 0;
  }

  get items(): Document[] {
    return this.result?.items ?? [];
  }

  get visibleItems(): Document[] {
    return this.showAll
      ? this.items
      : this.items.slice(0, this.panel.initialCountLimit);
  }

  get hasResults(): boolean {
    return Boolean(
      this.query && this.result.total > 0 && this.result.items.length
    );
  }

  mounted(): void {
    if (!this.query) {
      return;
    }
    this.handleQueryChange();
  }

  @Watch("query")
  handleQueryChange(): void {
    const context = getLupaTrackingContext();
    const query = {
      ...context,
      limit: this.panel.totalCountLimit,
      searchText: this.query,
    };
    lupaSearchSdk
      .query(this.panel.queryKey, query, this.options)
      .then((res) => {
        if (res.success) {
          this.handleResults(res);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleResults(res: SearchQueryResult): void {
    this.result = res;
    this.searchResultOptions.callbacks?.onAdditionalPanelResults?.({
      queryKey: this.panel.queryKey,
      hasResults: res.total > 0,
    });
  }

  toggleShowMore(): void {
    this.showAll = !this.showAll;
  }

  addParams(label: string, itemCount: number): string {
    return addParamsToLabel(label, itemCount);
  }
}
</script>
