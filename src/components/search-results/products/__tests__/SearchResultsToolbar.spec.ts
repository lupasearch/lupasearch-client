/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getPageCount } from "@/utils/picker.utils";

jest.mock("@/store/modules/searchResult");
jest.mock("@/store/modules/params");
jest.mock("@/utils/picker.utils");

const SearchResultModuleMock = mocked(SearchResultModule, true);
const ParamsModuleMock = mocked(ParamsModule, true);
const getPageCountMock = mocked(getPageCount);

const localVue = createLocalVue();

localVue.use(Vuex);

const toolbarOptions = {
  labels: { mobileFilterButton: "filter", pageSize: "pageSize" },
  pagination: {
    sizeSelection: { position: { top: true }, sizes: [10, 20, 25, 50] },
    pageSelection: { position: { top: true }, display: 5 },
  },
  sort: [],
  toolbar: {
    layoutSelector: true,
  },
};

describe("SearchResultsToolbar", () => {
  let wrapper: Wrapper<SearchResultsToolbar, Element>;
  let store: Store<RootState>;

  beforeEach(() => {
    getPageCountMock.mockReturnValue(10);
    ParamsModuleMock.getters?.["page"].mockReturnValue(2);
    ParamsModuleMock.getters?.["limit"].mockReturnValue(20);

    store = new Vuex.Store({
      modules: {
        searchResult: SearchResultModuleMock,
        params: ParamsModuleMock,
      },
    });
    wrapper = mount(SearchResultsToolbar, {
      propsData: {
        options: toolbarOptions,
        paginationLocation: "top",
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
      options: {
        ...toolbarOptions,
        pagination: {
          sizeSelection: { position: { top: false }, sizes: [10, 20, 25, 50] },
          pageSelection: { position: { top: true }, display: 5 },
        },
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
      options: {
        ...toolbarOptions,
        pagination: {
          sizeSelection: { position: { top: true }, sizes: [10, 20, 25, 50] },
          pageSelection: { position: { top: false }, display: 5 },
        },
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
