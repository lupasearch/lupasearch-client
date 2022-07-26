<template>
  <div id="lupa-search-results-badges">
    <div id="lupa-badges" :class="anchorPosition">
      <search-results-badge
        v-for="(badge, index) in leftBadges"
        :is="getBadgeComponent(badge.type)"
        :key="index"
        :badge="badge"
      />
      <SearchResultGeneratedBadges :options="options" />
    </div>
    <div class="lupa-bottom-badges">
      <search-results-badge
        v-for="(badge, index) in bottomBadges"
        :is="getBadgeComponent(badge.type)"
        :key="index"
        :badge="badge"
      />
    </div>
  </div>
</template>
<script lang="ts">
import {
  BadgeElement,
  BadgeOptions,
  BadgeType,
} from "@/types/search-results/BadgeOptions";
import { AnchorPosition } from "@/types/search-results/SearchResultsProductCardOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import CustomBadge from "./CustomBadge.vue";
import TextBadge from "./TextBadge.vue";
import ImageBadge from "./ImageBadge.vue";
import SearchResultGeneratedBadges from "./SearchResultGeneratedBadges.vue";

@Component({
  name: "searchResultsBadgeWrapper",
  components: {
    CustomBadge,
    TextBadge,
    ImageBadge,
    SearchResultGeneratedBadges,
  },
})
export default class SearchResultsBadgeWrapper extends Vue {
  @Prop({ default: {} }) options!: BadgeOptions;

  get anchorPosition(): AnchorPosition {
    return this.options.anchor;
  }

  get badges(): BadgeElement[] {
    if (!this.options.elements) {
      return [];
    }
    return this.options.elements
      .filter((e) => !e.display || e.display(this.options.product ?? {}))
      .map((x) => {
        return {
          ...x,
          value: (this.options.product?.[x.key] as string) || "badge",
          product: this.options.product,
        };
      });
  }

  get leftBadges(): BadgeElement[] {
    return this.badges.filter((b) => !b.position || b.position === "left");
  }

  get bottomBadges(): BadgeElement[] {
    return this.badges.filter((b) => b.position === "bottom");
  }

  getBadgeComponent(type: string): string {
    switch (type) {
      case BadgeType.TEXT:
        return "TextBadge";
      case BadgeType.IMAGE:
        return "ImageBadge";
      case BadgeType.CUSTOM_HTML:
        return "CustomBadge";
      default:
        return "CustomBadge";
    }
  }
}
</script>
