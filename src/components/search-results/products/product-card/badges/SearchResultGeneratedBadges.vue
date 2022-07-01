<template>
  <div class="lupa-generated-badges">
    <SearchResultGeneratedBadge
      v-for="badge in badges"
      :key="badge.id"
      :badge="badge"
      :options="options"
    />
  </div>
</template>
<script lang="ts">
import {
  BadgeGenerateSeed,
  BadgeOptions,
} from "@/types/search-results/BadgeOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SearchResultGeneratedBadge from "./SearchResultGeneratedBadge.vue";

const test = [
  {
    background_color: "#4b80eb",
    head_text: "Įsigykite iš anksto!",
    key: "17-25176-prod",
    prod_color: "#ffffff",
    text: "",
    __typename: "Label",
  },
  {
    background_color: "#88022A",
    head_text: null,
    key: "14-25176-prod",
    prod_color: "#ffffff",
    text: "Naujiena",
    __typename: "Label",
  },
  {
    background_color: "#C9247C",
    head_text: "Top",
    key: "15-25176-prod",
    prod_color: "#ffffff",
    text: "Top prekė",
    __typename: "Label",
  },
  {
    background_color: "#f8eaee",
    head_text: null,
    key: "19-25176-prod",
    prod_color: "#730324",
    text: "Su Pegaso kortele",
    __typename: "Label",
  },
  {
    background_color: "#F5A623",
    head_text: "Greitai",
    key: "18-25176-prod",
    prod_color: "#ffffff",
    text: "Pasirodys prekyboje",
    __typename: "Label",
  },
];

@Component({
  name: "searchResultsBadgeWrapper",
  components: {
    SearchResultGeneratedBadge,
  },
})
export default class SearchResultGeneratedBadges extends Vue {
  @Prop({ default: {} }) options!: BadgeOptions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get badgeField(): Record<string, any>[] {
    // return (
    //   (this.options.generate?.key &&
    //     this.options.product[this.options.generate?.key ?? ""] &&
    //     Array.isArray(
    //       this.options.product[this.options.generate?.key ?? ""]
    //     )) ??
    //   []
    // );
    return test;
  }

  get keyMap(): Record<string, string> {
    return this.options.generate?.keyMap ?? {};
  }

  get hasBadges(): boolean {
    return Boolean(
      this.options.generate?.key &&
        this.options.generate.keyMap &&
        this.badgeField.length > 0
    );
  }

  get badges(): BadgeGenerateSeed[] {
    return this.badgeField.map((f) => ({
      backgroundColor: this.keyMap.backgroundColor
        ? f[this.keyMap.backgroundColor]
        : undefined,
      color: this.keyMap.color ? f[this.keyMap.color] : undefined,
      titleText: this.keyMap.titleText ? f[this.keyMap.titleText] : undefined,
      additionalText: this.keyMap.additionalText
        ? f[this.keyMap.additionalText]
        : undefined,
      id: this.keyMap.id ? f[this.keyMap.id] : undefined,
    }));
  }
}
</script>
