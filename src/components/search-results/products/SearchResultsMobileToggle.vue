<template>
  <div
    class="lupa-mobile-toggle"
    @click="handleMobileToggle"
    :class="{ 'lupa-mobile-toggle-filters-empty': currentFilterCount < 1 }"
  >
    {{ label }}
    <span
      class="lupa-mobile-toggle-filter-count"
      v-if="showFilterCount && currentFilterCount > 0"
      >{{ currentFilterCount }}</span
    >
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const searchResult = namespace("searchResult");

@Component({
  name: "searchResultsMobileToggle",
})
export default class SearchResultsMobileToggle extends Vue {
  @Prop() label!: string;
  @Prop({ default: false }) showFilterCount!: boolean;

  @searchResult.Getter("currentFilterCount") currentFilterCount!: number;

  @searchResult.Mutation("setSidebarVisibility") setSidebarVisibility!: ({
    visible,
  }: {
    visible: boolean;
  }) => void;

  handleMobileToggle(): void {
    this.setSidebarVisibility({ visible: true });
  }
}
</script>
