<template>
  <div class="lupa-mobile-toggle" @click="handleMobileToggle">{{ label }}</div>
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
