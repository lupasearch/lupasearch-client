/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";
import { pick } from "@/utils/picker.utils";
import { mount, Wrapper } from "@vue/test-utils";
import SearchResultsToolbar from "@/components/search-results/products/SearchResultsToolbar.vue";
import SearchResultsPageSelect from "../pagination/SearchResultsPageSelect.vue";
import SearchResultsPageSize from "../pagination/SearchResultsPageSize.vue";
import SearchResultsLayoutSelection from "@/components/search-results/products/SearchResultsLayoutSelection.vue";
import Vue from "vue";

describe("SearchResultsToolbar", () => {
  let wrapper: Wrapper<SearchResultsToolbar, Element>;

  beforeEach(() => {
    wrapper = mount(SearchResultsToolbar, {
      propsData: {
        paginationOptions: {
          pageSize: {
            sizes: DEFAULT_OPTIONS_RESULTS.pagination.sizeSelection.sizes,
            selectedSize:
              DEFAULT_OPTIONS_RESULTS.pagination.sizeSelection.sizes[0],
          },
          pageSelect: {
            count: 5,
            selectedPage: 1,
          },
          labels: pick(DEFAULT_OPTIONS_RESULTS.labels, [
            "pageSize",
            "showMore",
          ]),
        },
        paginationDisplay: {
          pageSize: true,
          pageSelect: true,
        },
        showLayoutSelection: true,
      },
      stubs: { SearchResultsLayoutSelection: { template: "<span/>" } },
    });
  });

  it("should display SearchResultsPageSelect and SearchResultsPageSize", () => {
    expect(
      wrapper.findComponent(SearchResultsPageSelect).exists()
    ).toBeTruthy();
    expect(wrapper.findComponent(SearchResultsPageSize).exists()).toBeTruthy();
  });

  it("should only display SearchResultsPageSelect", async () => {
    wrapper.setProps({
      paginationDisplay: {
        pageSize: false,
        pageSelect: true,
      },
    });
    await Vue.nextTick();
    expect(
      wrapper.findComponent(SearchResultsPageSelect).exists()
    ).toBeTruthy();
    expect(wrapper.findComponent(SearchResultsPageSize).exists()).toBeFalsy();
  });

  it("should only display SearchResultsPageSize", async () => {
    wrapper.setProps({
      paginationDisplay: {
        pageSize: true,
        pageSelect: false,
      },
    });
    await Vue.nextTick();
    expect(wrapper.findComponent(SearchResultsPageSize).exists()).toBeTruthy();
    expect(wrapper.findComponent(SearchResultsPageSelect).exists()).toBeFalsy();
  });

  it("should display SearchResultsLayoutSelection", () => {
    expect(
      wrapper.findComponent(SearchResultsLayoutSelection).exists()
    ).toBeTruthy();
    expect(
      wrapper.findComponent(SearchResultsLayoutSelection).exists()
    ).toBeTruthy();
  });
});
