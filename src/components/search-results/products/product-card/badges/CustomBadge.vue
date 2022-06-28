<template>
  <div :class="className" v-html="text"></div>
</template>
<script lang="ts">
import { CustomHtmlBadgeElement } from "@/types/search-results/BadgeOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  name: "customBadge",
})
export default class CustomBadge extends Vue {
  @Prop({ default: {} }) badge!: CustomHtmlBadgeElement;

  get text(): string {
    return this.badge.html?.(this.badge.product ?? {});
  }

  get className(): string {
    return this.badge.className ?? "";
  }
}
</script>
