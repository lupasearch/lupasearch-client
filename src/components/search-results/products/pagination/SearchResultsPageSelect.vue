<template>
  <div
    id="lupa-search-results-page-select"
    data-cy="lupa-search-results-page-select"
    v-if="showPagination"
  >
    <div
      v-if="showBack"
      :class="firstPageLabel === '<' ? 'lupa-page-arrow' : 'lupa-show-less'"
      @click="() => handlePageChange(options.selectedPage - 1)"
    >
      {{ firstPageLabel }}
    </div>
    <template v-if="showFirstPage">
      <div
        class="lupa-page-number lupa-page-number-first"
        @click="() => handlePageChange(1)"
      >
        1
      </div>
      <div v-if="showFirstPageSeparator" class="lupa-page-number-separator">
        ...
      </div>
    </template>
    <div
      v-for="page in pages"
      :key="page"
      @click="() => handlePageChange(page)"
      :class="[
        'lupa-page-number',
        page === options.selectedPage ? 'lupa-page-number-selected' : '',
      ]"
      data-cy="lupa-page-number"
    >
      {{ page }}
    </div>
    <template v-if="showLastPage">
      <div v-if="showLastPageSeparator" class="lupa-page-number-separator">
        ...
      </div>
      <div
        class="lupa-page-number lupa-page-number-last"
        @click="() => handlePageChange(lastPage)"
      >
        {{ lastPage }}
      </div>
    </template>
    <div
      v-if="options.selectedPage < options.count"
      :class="lastPageLabel === '>' ? 'lupa-page-arrow' : 'lupa-show-more'"
      data-cy="lupa-show-more"
      @click="() => handlePageChange(options.selectedPage + 1)"
    >
      {{ lastPageLabel }}
    </div>
  </div>
</template>
<script lang="ts">
import { QUERY_PARAMS } from "@/constants/queryParams.const";
import { PaginationPageSelect } from "@/types/search-results/PaginationOptions";
import { QueryParams } from "@/types/search-results/QueryParams";
import { scrollToSearchResults } from "@/utils/scroll.utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const params = namespace("params");
const searchResult = namespace("searchResult");

@Component({
  name: "searchResultsPageSelect",
})
export default class SearchResultsPageSelect extends Vue {
  @Prop({ default: ">" }) lastPageLabel!: string;
  @Prop({ default: "<" }) firstPageLabel!: string;

  @Prop({ default: {} }) options!: PaginationPageSelect;

  @searchResult.Getter("isMobileWidth") isMobileWidth!: boolean;

  get pageOptionsCount(): number {
    return this.isMobileWidth
      ? this.options.displayMobile
      : this.options.display;
  }

  get pages(): number[] {
    const currentPage = Math.min(this.options.count, this.options.selectedPage);
    const delta = Math.floor(this.pageOptionsCount / 2),
      left = currentPage - delta,
      right = currentPage + (this.pageOptionsCount - delta);

    return Array.from({ length: this.options.count }, (v, k) => k + 1).filter(
      (i) => i && i >= left && i < right
    );
  }

  get showBack(): boolean {
    return (
      this.options.selectedPage > 1 &&
      this.options.selectedPage <= this.options.count
    );
  }

  get lastPage(): number | undefined {
    return this.options.count ?? undefined;
  }

  get showLastPage(): boolean {
    return Boolean(this.lastPage && !this.pages.includes(this.lastPage));
  }

  get showLastPageSeparator(): boolean {
    return this.showLastPage && !this.pages.includes((this.lastPage ?? 0) - 1);
  }

  get showFirstPage(): boolean {
    return !this.pages.includes(1);
  }

  get showFirstPageSeparator(): boolean {
    return this.showFirstPage && !this.pages.includes(2);
  }

  get showPagination(): boolean {
    return this.pages.length > 1;
  }

  @params.Action("appendParams") appendParams!: ({
    params,
    paramsToRemove,
  }: {
    params: { name: string; value: string }[];
    paramsToRemove?: string[];
  }) => { params: QueryParams };
  handlePageChange(page: number): void {
    if (page > 0) {
      this.appendParams({
        params: [{ name: QUERY_PARAMS.PAGE, value: page.toString() }],
      });
      scrollToSearchResults();
    }
  }
}
</script>
