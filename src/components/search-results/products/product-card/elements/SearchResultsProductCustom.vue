<template>
  <div :class="className" v-if="isHtml" v-html="text"></div>
  <div :class="className" v-else>
    <div v-if="!label">
      {{ text }}
    </div>
    <div v-else>
      <div class="lupa-search-box-custom-label">{{ label }}</div>
      <div class="lupa-search-box-custom-text">{{ text }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { CustomDocumentElement } from "@/types/DocumentElement";

@Component({
  name: "searchResultsProductCustom",
})
export default class SearchResultsProductCustom extends Vue {
  @Prop() item!: Document;
  @Prop() options!: CustomDocumentElement;

  get text(): string {
    return this.item[this.options.key] as string;
  }

  get className(): string {
    return this.options.className;
  }

  get label(): string | undefined {
    return this.options.label;
  }

  get isHtml(): boolean {
    return this.options.isHtml ?? false;
  }
}
</script>
