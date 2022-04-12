<template>
  <div class="lupa-search-box-history-panel" v-if="hasHistory">
    <SearchBoxHistoryItem
      v-for="(item, index) in history"
      :key="item"
      :item="item"
      :highlighted="index === highlightIndex"
      @click="goToResults"
      @remove="remove"
    />
    <div class="lupa-search-box-history-clear-all" @click="removeAll">
      {{ options.labels.clear }}
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { namespace } from "vuex-class";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SearchBoxHistoryItem from "./SearchBoxHistoryItem.vue";
import { SearchBoxHistory } from "@/types/search-box/SearchBoxHistory";

const history = namespace("history");
const searchBox = namespace("searchBox");

@Component({
  name: "searchBoxHistoryPanel",
  components: {
    SearchBoxHistoryItem,
  },
})
export default class SearchBoxHistoryPanel extends Vue {
  @Prop() options!: SearchBoxHistory;

  @searchBox.State((state) => state.highlightedIndex) highlightedIndex!: number;

  @history.State((state) => state.items) history!: string[];

  @history.Action("remove") removeItem!: ({
    item,
  }: {
    item: string;
  }) => string[];
  @history.Action("clear") clear!: () => string[];

  get highlightIndex(): number {
    return this.highlightedIndex ?? -1;
  }

  get hasHistory(): boolean {
    return this.history && this.history.length > 0;
  }

  mounted(): void {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  beforeDestroy(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  remove({ item }: { item: string }): void {
    this.removeItem({ item });
  }

  removeAll(): void {
    this.clear();
  }

  goToResults({ query }: { query: string }): void {
    this.$emit("go-to-results", { query });
  }

  handleKeyDown(e: KeyboardEvent): void {
    if (!this.hasHistory || this.highlightIndex < -1) {
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      this.goToResults({ query: this.history[this.highlightIndex] });
    }
  }
}
</script>
