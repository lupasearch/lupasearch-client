<template>
  <SearchBoxSuggestions
    :items="searchResult"
    :highlight="panel.highlight"
    :queryKey="panel.queryKey"
    :labels="labels"
    @suggestionSelect="(item) => $emit('itemSelect', item)"
  />
</template>
<script lang="ts">
import { DisplaySuggestion } from "@/types/search-box/Common";
import { SdkOptions } from "@/types/General";
import { SuggestionSearchBoxPanel } from "@/types/search-box/SearchBoxPanel";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import SearchBoxSuggestions from "./SearchBoxSuggestions.vue";
import { namespace } from "vuex-class";
import {
  Options,
  PublicQuery,
  SuggestionQueryResult,
} from "@getlupa/client-sdk/Types";
import { debounce } from "@/utils/debounce.utils";
import { SearchBoxOptionLabels } from "@/types/search-box/SearchBoxOptions";

const searchBox = namespace("searchBox");

@Component({
  name: "searchBoxSuggestionsWrapper",
  components: {
    SearchBoxSuggestions,
  },
})
export default class SearchBoxSuggestionsWrapper extends Vue {
  items: DisplaySuggestion[] = [];
  @Prop() panel!: SuggestionSearchBoxPanel;
  @Prop() options!: SdkOptions;
  @Prop() inputValue!: string;
  @Prop() debounce?: number;
  @Prop() labels!: SearchBoxOptionLabels;

  @searchBox.State((state) => state.suggestionResults)
  suggestionResults!: Record<string, DisplaySuggestion[]>;

  get searchResult(): DisplaySuggestion[] {
    return this.suggestionResults[this.panel.queryKey] ?? {};
  }

  @searchBox.Action("querySuggestions") querySuggestions!: ({
    queryKey,
    publicQuery,
    options,
  }: {
    queryKey: string;
    publicQuery: PublicQuery;
    options?: Options;
  }) => Promise<{
    queryKey: string;
    suggestions?: SuggestionQueryResult;
  }>;

  created(): void {
    this.getSuggestionsDebounced();
  }

  @Watch("inputValue")
  onInputChange(): void {
    this.getSuggestionsDebounced();
  }

  getSuggestionsDebounced = debounce(this.getSuggestions, this.debounce);

  getSuggestions(): void {
    this.querySuggestions({
      queryKey: this.panel.queryKey,
      publicQuery: { searchText: this.inputValue, limit: this.panel.limit },
      options: this.options,
    })
      .then(({ suggestions }) => {
        if (!suggestions) {
          return;
        }
        this.$emit("fetched", { items: suggestions, type: this.panel.type });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
</script>
<style></style>
