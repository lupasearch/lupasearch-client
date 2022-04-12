<template>
  <div
    class="lupa-search-box-product-description"
    v-if="isHtml"
    v-html="description"
  ></div>
  <div class="lupa-search-box-product-description" v-else>
    {{ description }}
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { DescriptionDocumentElement } from "@/types/DocumentElement";

@Component
export default class SearchBoxProductDescription extends Vue {
  @Prop() item!: Document;
  @Prop() options!: DescriptionDocumentElement;

  get description(): unknown {
    return this.item[this.options.key];
  }

  get isHtml(): boolean {
    return this.options.isHtml ?? false;
  }
}
</script>
