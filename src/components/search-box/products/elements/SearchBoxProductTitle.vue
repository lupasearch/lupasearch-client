<template>
  <div class="lupa-search-box-product-title" v-if="isHtml" v-html="title"></div>
  <div v-else class="lupa-search-box-product-title">
    <strong>{{ title }}</strong>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { TitleDocumentElement } from "@/types/DocumentElement";

@Component
export default class SearchBoxProductTitle extends Vue {
  @Prop() item!: Document;
  @Prop() options!: TitleDocumentElement;

  get title(): unknown {
    return this.item[this.options.key];
  }

  get isHtml(): boolean {
    return this.options.isHtml ?? false;
  }
}
</script>
