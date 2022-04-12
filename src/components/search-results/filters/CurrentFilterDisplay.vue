<template>
  <div class="lupa-search-result-filter-value">
    <div class="lupa-current-filter-action" @click="handleClick">⨉</div>
    <div class="lupa-current-filter-label" data-cy="lupa-current-filter-label">
      {{ filter.label }}:
    </div>
    <div class="lupa-current-filter-value" data-cy="lupa-current-filter-value">
      {{ filter.value }}
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { LabeledFilter } from "@/types/search-results/Filters";

@Component({
  name: "currentFilterDisplay",
})
export default class CurrentFilterDisplay extends Vue {
  @Prop({ required: true }) filter!: LabeledFilter;

  handleClick(): void {
    this.$emit("remove", { filter: this.filter });
  }
}
</script>
