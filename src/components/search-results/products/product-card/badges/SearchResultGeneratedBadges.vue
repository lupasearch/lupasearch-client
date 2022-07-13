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
    const fieldHasBadges =
      this.options.generate?.key &&
      this.options.product[this.options.generate?.key ?? ""] &&
      Array.isArray(this.options.product[this.options.generate?.key ?? ""]);

    return fieldHasBadges
      ? this.options.product[this.options.generate?.key ?? ""]
      : [];
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
    return this.badgeField
      .filter((f) => Boolean(f))
      .map((f) => ({
        backgroundColor: this.keyMap.backgroundColor
          ? f[this.keyMap.backgroundColor]
          : undefined,
        color: this.keyMap.color ? f[this.keyMap.color] : undefined,
        titleText: this.keyMap.titleText ? f[this.keyMap.titleText] : undefined,
        additionalText: this.keyMap.additionalText
          ? f[this.keyMap.additionalText]
          : undefined,
        id: this.keyMap.id ? f[this.keyMap.id] : undefined,
      }))
      .filter((b) => Boolean(b.id));
  }
}
</script>
