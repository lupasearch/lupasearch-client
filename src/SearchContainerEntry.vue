<template>
  <SearchContainer
    v-if="isOpen"
    :options="containerOptions"
    ref="productList"
    @hook:mounted="focus"
    @close="close"
  />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import cloneDeep from "lodash.clonedeep";
import SearchContainer from "./components/search-container/SearchContainer.vue";
import { SearchContainerOptions } from "./types/search-container/SearchContainerOptions";
import { QUERY_PARAMS } from "./constants/queryParams.const";

@Component({
  name: "productList",
  components: {
    SearchContainer,
  },
})
export default class SearchContainerEntry extends Vue {
  @Prop() searchContainerOptions!: SearchContainerOptions;

  isOpen = false;

  triggerElement: Element | null = null;

  get containerOptions(): SearchContainerOptions {
    return cloneDeep(this.searchContainerOptions);
  }

  focus(): void {
    const el = document.querySelector(
      "#lupa-search-box-input .lupa-search-box-input-field"
    );
    (el as HTMLInputElement)?.focus();
  }

  close(): void {
    this.isOpen = false;
  }

  openSearchContainer(): void {
    this.isOpen = true;
  }

  checkCloseOnEscape(e: KeyboardEvent): void {
    if (!["Escape", "Esc"].includes(e.key ?? "")) {
      return;
    }
    this.isOpen = false;
  }

  checkExistingQuery(): void {
    const url = new URL(window.location.href);
    const param = url.searchParams.get(QUERY_PARAMS.QUERY);
    if (!param) {
      return;
    }
    this.isOpen = true;
  }

  mountOpenListeners(): void {
    this.triggerElement = document.querySelector(
      this.searchContainerOptions.trigger
    );
    this.triggerElement?.addEventListener("focus", this.openSearchContainer);
    window.addEventListener("keydown", this.checkCloseOnEscape);
  }

  mounted(): void {
    this.mountOpenListeners();
    this.checkExistingQuery();
  }

  beforeDestroy(): void {
    this.triggerElement?.removeEventListener("focus", this.openSearchContainer);
    window.removeEventListener("keydown", this.checkCloseOnEscape);
  }
}
</script>
