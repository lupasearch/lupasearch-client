<template>
  <div :class="className" v-if="isHtml" v-html="text"></div>
  <div :class="className" v-else>{{ text }}</div>
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

  get isHtml(): boolean {
    return this.options.isHtml ?? false;
  }
}
</script>
