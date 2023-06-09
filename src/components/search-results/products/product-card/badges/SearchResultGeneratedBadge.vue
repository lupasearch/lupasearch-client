<template>
  <div
    class="lupa-dynamic-badge"
    :class="customClassName"
    :style="{ background: badge.backgroundColor, color: badge.color }"
  >
    <span class="lupa-badge-title">
      <img v-if="image" :src="image" /><span v-if="hasTitleText && showTitle">
        {{ badge.titleText }}</span
      ></span
    ><span v-if="hasAdditionalText" class="lupa-badge-full-text">{{
      badge.additionalText
    }}</span>
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
    return this.options.generate?.image?.(this.badge) ?? "";
  }

  get showTitle(): boolean {
    return this.options.generate?.showTitle?.(this.badge) ?? true;
  }

  get hasAdditionalText(): boolean {
    return (
      Boolean(this.badge?.additionalText) &&
      typeof this.badge?.additionalText === "string"
    );
  }

  get hasTitleText(): boolean {
    return (
      Boolean(this.badge?.titleText) &&
      typeof this.badge?.titleText === "string"
    );
  }

  get customClassName(): string {
    return this.options.generate?.customClass?.(this.badge) ?? "";
  }
}
</script>
