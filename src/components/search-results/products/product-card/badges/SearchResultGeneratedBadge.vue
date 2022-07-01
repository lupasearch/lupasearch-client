<template>
  <div
    class="lupa-dynamic-badge"
    :style="{ background: badge.backgroundColor, color: badge.color }"
  >
    <span class="lupa-badge-title">
      <span v-if="badge.titleText"> {{ badge.titleText }}</span>
      <img v-if="image" :src="image" /></span
    ><span class="lupa-badge-full-text">{{ badge.additionalText }}</span>
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

@Component({
  name: "searchResultsBadgeWrapper",
})
export default class SearchResultGeneratedBadge extends Vue {
  @Prop({ default: () => ({}) }) options!: BadgeOptions;
  @Prop({ default: () => ({}) }) badge!: BadgeGenerateSeed;

  get image(): string | undefined {
    console.log(this.badge.titleText);
    return this.options.generate?.image?.(this.badge) ?? "";
  }
}
</script>
