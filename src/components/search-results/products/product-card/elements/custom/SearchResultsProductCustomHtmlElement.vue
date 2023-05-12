<template>
  <div
    :class="className"
    v-html="text"
    v-on="options.action ? { click: handleClick } : {}"
  ></div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { CustomHtmlElement } from "@/types/DocumentElement";

@Component({
  name: "searchResultsProductCustomHtmlElement",
})
export default class SearchResultsProductCustomHtmlElement extends Vue {
  @Prop() item!: Document;
  @Prop() options!: CustomHtmlElement;

  get text(): string {
    return this.options.html(this.item);
  }

  get className(): string {
    return this.options.className;
  }

  async handleClick(): Promise<void> {
    if (!this.options.action) {
      return;
    }
    await this.options.action(this.item);
  }
}
</script>
