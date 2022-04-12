<template>
  <span id="lupa-similar-query-text-component">
    <span
      v-for="(text, index) in insertValue(label, searchText)"
      :key="index"
      :class="getStyle(text)"
      :data-cy="getStyle(text)"
    >
      {{ text }}
    </span>
    ({{ count }})
  </span>
</template>
<script lang="ts">
import { addParamsToLabel } from "@/utils/string.utils";
import { SimilarQueryResult } from "@getlupa/client-sdk/Types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const searchResult = namespace("searchResult");

@Component({
  name: "similarQueryText",
})
export default class SimilarQueryText extends Vue {
  @Prop({ default: {} }) similarQuery!: SimilarQueryResult;
  @Prop({ default: "" }) label!: string;

  @searchResult.State((state) => state.searchResult.searchText)
  searchText!: string;

  get count(): number {
    return this.similarQuery.count;
  }

  insertValue(text: string, query: string): string[] {
    return text.includes("{1}")
      ? addParamsToLabel(text, query).split(" ")
      : text.split(" ");
  }

  getStyle(text: string): string {
    return !this.similarQuery.query.includes(text)
      ? "lupa-similar-query-crossed"
      : "";
  }
}
</script>
