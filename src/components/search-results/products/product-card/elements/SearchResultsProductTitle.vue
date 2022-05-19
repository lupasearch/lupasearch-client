<template>
  <div
    class="lupa-search-results-product-title"
    :style="`-webkit-line-clamp: ${maxLines}`"
    v-if="isHtml"
    v-html="title"
  ></div>
  <div
    v-else
    class="lupa-search-results-product-title"
    :style="`-webkit-line-clamp: ${maxLines}`"
  >
    <span v-if="!options.link" class="lupa-search-results-product-title-text">{{
      title
    }}</span>
    <a
      v-if="options.link"
      :href="link"
      class="lupa-search-results-product-title-text lupa-title-link"
      @click="handleNavigation"
      >{{ title }}</a
    >
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { TitleDocumentElement } from "@/types/DocumentElement";
import { namespace } from "vuex-class";
import { SearchResultsOptions } from "@/types/search-results/SearchResultsOptions";
import { handleRoutingEvent } from "@/utils/routing.utils";

const options = namespace("options");

@Component({
  name: "searchResultsProductTitle",
})
export default class SearchResultsProductTitle extends Vue {
  @Prop() item!: Document;
  @Prop() options!: TitleDocumentElement;
  @Prop({ default: "" }) link!: string;

  @options.State((o) => o.searchResultOptions)
  searchResultOptions!: SearchResultsOptions;

  get title(): unknown {
    return this.item[this.options.key];
  }

  get isHtml(): boolean {
    return this.options.isHtml ?? false;
  }

  get maxLines(): number {
    return this.options.maxLines;
  }

  get hasEventRouting(): boolean {
    return this.searchResultOptions.routingBehavior === "event";
  }

  handleNavigation(event?: Event): void {
    handleRoutingEvent(this.link, event, this.hasEventRouting);
  }
}
</script>
