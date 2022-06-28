/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";
import ParamsModule from "@/store/modules/params";
import SearchResultModule from "@/store/modules/searchResult";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import Vue from "vue";
import Vuex from "vuex";
import SearchResultsPageSelect from "../SearchResultsPageSelect.vue";

jest.mock("@/store/modules/searchResult");
jest.mock("@/store/modules/params");

const SearchResultModuleMock = mocked(SearchResultModule, true);
const ParamsModuleMock = mocked(ParamsModule, true);

const localVue = createLocalVue();

localVue.use(Vuex);

describe("SearchResultsPageSelect", () => {
  let wrapper: Wrapper<SearchResultsPageSelect, Element>;
  let wrapperVm: any;

  beforeEach(() => {
    const store = new Vuex.Store({
      modules: {
        searchResult: SearchResultModuleMock,
        params: ParamsModuleMock,
      },
    });
    wrapper = mount(SearchResultsPageSelect, {
      propsData: {
        options: {
          count: 50,
          selectedPage: 1,
          display: 5,
        },
        lastPageLabel: DEFAULT_OPTIONS_RESULTS.labels.showMore,
      },
      store,
      localVue,
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
