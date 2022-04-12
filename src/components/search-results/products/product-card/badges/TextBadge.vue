<template>
  <div class="lupa-text-badges">
    <div
      class="lupa-badge lupa-text-badge"
      v-for="item in displayBadges"
      :key="item"
    >
      {{ badge.prefix }}{{ item }}
    </div>
  </div>
</template>
<script lang="ts">
import { TextBadgeElement } from "@/types/search-results/BadgeOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  name: "TextBadge",
})
export default class TextBadge extends Vue {
  @Prop({ default: {} }) badge!: TextBadgeElement;

  get badges(): string[] {
    return (this.badge?.value as unknown as string[]) ?? [];
  }

  get displayBadges(): string[] {
    return this.badges.slice(0, this.badge.maxItems);
  }
}
</script>
