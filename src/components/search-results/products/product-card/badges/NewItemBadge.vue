<template>
  <div
    class="lupa-new-item-badge"
    v-if="badge.isHtml"
    v-html="badge.value"
  ></div>
  <div class="lupa-new-item-badge" v-else>
    {{ badge.value }}
  </div>
</template>
<script lang="ts">
import { BadgeElement } from "@/types/search-results/BadgeOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  name: "newItemBadge",
})
export default class NewItemBadge extends Vue {
  @Prop({ default: {} }) badge!: BadgeElement;
}
</script>
<style lang="scss">
.lupa-new-item-badge {
  background-color: red;
}
</style>
