<template>
  <div class="lupa-search-box-history-item">
    <div class="lupa-search-box-history-item-content">
      <div
        class="lupa-search-box-history-item-text"
        :class="{ 'lupa-search-box-history-item-highlighted': highlighted }"
        @click="click"
      >
        {{ item }}
      </div>
      <div class="lupa-search-box-history-item-clear" @click="remove">×</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  name: "SearchBoxHistoryItem",
})
export default class SearchBoxHistoryItem extends Vue {
  @Prop({ default: () => "" }) item!: string;
  @Prop({ default: false }) highlighted!: boolean;

  remove(): void {
    this.$emit("remove", { item: this.item });
  }

  click(): void {
    this.$emit("click", { query: this.item });
  }
}
</script>
