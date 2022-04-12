<template>
  <div class="lupa-image-badges">
    <div
      class="lupa-badge lupa-image-badge"
      v-for="item in displayBadges"
      :key="item"
    >
      <img :src="getImageUrl(item)" />
    </div>
  </div>
</template>
<script lang="ts">
import { ImageBadgeElement } from "@/types/search-results/BadgeOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  name: "ImageBadge",
})
export default class ImageBadge extends Vue {
  @Prop({ default: {} }) badge!: ImageBadgeElement;

  get badges(): string[] {
    return this.badge.value as unknown as string[];
  }

  getImageUrl(src: string): string {
    if (!this.badge.rootImageUrl) {
      return src;
    }
    return `${this.badge.rootImageUrl}${src}`;
  }

  get displayBadges(): string[] {
    return this.badges.slice(0, this.badge.maxItems);
  }
}
</script>
