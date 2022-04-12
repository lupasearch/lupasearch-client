import Vuex from "vuex";
import { ResultCurrentFilterOptions } from "@/types/search-results/SearchResultsOptions";
import { getLabeledFilters } from "@/utils/filter.utils";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import CurrentFilters from "../CurrentFilters.vue";
import CurrentFilterDisplay from "../CurrentFilterDisplay.vue";
import ParamsModule from "@/store/modules/params";
import SearchResultModule from "@/store/modules/searchResult";

jest.mock("@/utils/filter.utils");
jest.mock("@/store/modules/params");

const ParamsModuleMock = mocked(ParamsModule, true);
const SearchResultModuleMock = mocked(SearchResultModule, true);
const getLabeledFiltersMock = mocked(getLabeledFilters);

const localVue = createLocalVue();

localVue.use(Vuex);

const baseOptions: ResultCurrentFilterOptions = {
  labels: {
    title: "Filters:",
    clearAll: "Clear all:",
  },
  visibility: {
    mobileSidebar: false,
    mobileToolbar: false,
  },
};

const getComponent = () => {
  const store = new Vuex.Store({
    modules: {
      params: ParamsModuleMock,
      searchResult: SearchResultModuleMock,
    },
  });
  return shallowMount(CurrentFilters, {
    propsData: {
      options: baseOptions,
    },
    store,
    localVue,
  });
};

describe("FacetList", () => {
  it("should not render anything if there are no filters", () => {
    getLabeledFiltersMock.mockReturnValue([]);
    const wrapper = getComponent();
    expect(wrapper.find(".lupa-search-result-current-filters").exists()).toBe(
      false
    );
  });

  it("should render filter section if at least one filter is visible", () => {
    getLabeledFiltersMock.mockReturnValue([
      { key: "tag", label: "Tag", type: "terms", value: "1" },
      { key: "price", label: "Price", type: "range", value: "1 - 2" },
    ]);
    const wrapper = getComponent();
    expect(wrapper.find(".lupa-filter-title-text").text()).toBe("Filters:");
    expect(wrapper.find(".lupa-clear-all-filters").text()).toBe("Clear all:");
  });

  it("should render a given number of filters", () => {
    getLabeledFiltersMock.mockReturnValue([
      { key: "tag", label: "Tag", type: "terms", value: "1" },
      { key: "price", label: "Price", type: "range", value: "1 - 2" },
      { key: "tag1", label: "Tag", type: "terms", value: "1" },
      { key: "price1", label: "Price", type: "range", value: "1 - 2" },
    ]);
    const wrapper = getComponent();
    expect(wrapper.findAllComponents(CurrentFilterDisplay).length).toBe(4);
  });
});
