/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";
import { pick } from "@/utils/picker.utils";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import SearchResultsToolbar from "@/components/search-results/products/SearchResultsToolbar.vue";
import SearchResultsPageSelect from "../pagination/SearchResultsPageSelect.vue";
import SearchResultsPageSize from "../pagination/SearchResultsPageSize.vue";
import SearchResultsLayoutSelection from "@/components/search-results/products/SearchResultsLayoutSelection.vue";
import Vue from "vue";
import Vuex, { Store } from "vuex";
import { mocked } from "ts-jest/utils";
import SearchResultModule from "@/store/modules/searchResult";
import ParamsModule from "@/store/modules/params";
import { RootState } from "@/store/types/State";

jest.mock("@/store/modules/searchResult");
jest.mock("@/store/modules/params");

const SearchResultModuleMock = mocked(SearchResultModule, true);
const ParamsModuleMock = mocked(ParamsModule, true);

const localVue = createLocalVue();

localVue.use(Vuex);

describe("SearchResultsToolbar", () => {
  let wrapper: Wrapper<SearchResultsToolbar, Element>;
  let store: Store<RootState>;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        searchResult: SearchResultModuleMock,
        params: ParamsModuleMock,
      },
    });
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
      store,
      localVue,
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
