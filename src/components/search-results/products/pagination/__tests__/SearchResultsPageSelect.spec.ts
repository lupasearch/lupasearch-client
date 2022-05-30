/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";
import { shallowMount, Wrapper } from "@vue/test-utils";
import Vue from "vue";
import SearchResultsPageSelect from "../SearchResultsPageSelect.vue";

describe("SearchResultsPageSelect", () => {
  let wrapper: Wrapper<SearchResultsPageSelect, Element>;
  let wrapperVm: any;

  beforeEach(() => {
    wrapper = shallowMount(SearchResultsPageSelect, {
      propsData: {
        options: {
          count: 50,
          selectedPage: 1,
          display: 5,
        },
        lastPageLabel: DEFAULT_OPTIONS_RESULTS.labels.showMore,
      },
    });
    wrapperVm = wrapper.vm as any;
  });

  it("should display correct label", () => {
    expect(
      wrapper
        .findAll("div")
        .filter((x) => x.text() === DEFAULT_OPTIONS_RESULTS.labels.showMore)
        .length
    ).not.toBe(0);
  });

  it("should display correct pages", async () => {
    expect(wrapperVm.pages).toStrictEqual([1, 2, 3]);

    wrapper.setProps({
      options: {
        count: 50,
        selectedPage: 5,
        display: 5,
      },
    });
    await Vue.nextTick();

    expect(wrapperVm.pages).toStrictEqual([3, 4, 5, 6, 7]);

    wrapper.setProps({
      options: {
        count: 8,
        selectedPage: 8,
        display: 5,
      },
    });
    await Vue.nextTick();

    expect(wrapperVm.pages).toStrictEqual([6, 7, 8]);
  });
});
