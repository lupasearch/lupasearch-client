<template>
  <SearchBox :options="fullSearchBoxOptions" />
</template>

<script lang="ts">
import { SearchBoxOptions } from "@/types/search-box/SearchBoxOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SearchBox from "./components/search-box/SearchBox.vue";
import { DEFAULT_SEARCH_BOX_OPTIONS } from "@/constants/searchBox.const";
import { merge } from "@/utils/merger.utils";

@Component({
  name: "searchBox",
  components: {
    SearchBox,
  },
})
export default class SearchBoxEntry extends Vue {
  @Prop() searchBoxOptions!: SearchBoxOptions;

  get fullSearchBoxOptions(): SearchBoxOptions {
    return merge(DEFAULT_SEARCH_BOX_OPTIONS, this.searchBoxOptions);
  }
}
</script>
