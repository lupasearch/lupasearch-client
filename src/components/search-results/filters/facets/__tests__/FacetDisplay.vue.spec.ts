/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchResultModule from "@/store/modules/searchResult";
import { ResultFacetOptions } from "@/types/search-results/SearchResultsOptions";
import { merge } from "@/utils/merger.utils";
import { FacetResult } from "@getlupa/client-sdk/Types";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import Vuex from "vuex";
import FacetDisplay from "../FacetDisplay.vue";

jest.mock("@/store/modules/searchResult");

const SearchResultModuleMock = mocked(SearchResultModule, true);

const localVue = createLocalVue();
localVue.use(Vuex);

const baseOptions: ResultFacetOptions = {
  labels: {
    title: "Title",
    showAll: "Show all",
    facetFilter: "Facet filter",
  },
};

const baseFacet: FacetResult = {
  key: "123",
  type: "terms" as any,
  label: "Base",
  items: [],
};

const getComponent = (
  facet: Partial<FacetResult> = {},
  options: Partial<ResultFacetOptions> = {}
) => {
  SearchResultModuleMock.getters?.currentFilters.mockReturnValue({});
  const store = new Vuex.Store({
    modules: {
      searchResult: SearchResultModuleMock,
    },
  });
  return shallowMount(FacetDisplay, {
    propsData: {
      options: { ...baseOptions, ...options },
      facet: merge(baseFacet, facet),
    },
    store,
    localVue,
  });
};

describe("FacetDisplay", () => {
  it("should not render section label if terms facet has no items", () => {
    const wrapper = getComponent({ type: "terms" as any, items: [] });
    expect(wrapper.find(".lupa-facet-label-text").exists()).toBe(false);
  });

  it("should render section label for stats facet", () => {
    const wrapper = getComponent({ type: "stats" as any, label: "Price" });
    expect(wrapper.find(".lupa-facet-label-text").text()).toBe("Price");
  });

  it("should render render section label if terms facet has items", () => {
    const wrapper = getComponent({
      type: "terms" as any,
      label: "Tag",
      items: [{ key: "1", title: "1", count: 11 }],
    });
    expect(wrapper.find(".lupa-facet-label-text").text()).toBe("Tag");
  });

  it("should not render facet content initially", () => {
    const wrapper = getComponent({ type: "stats" as any, label: "Price" });
    expect(wrapper.find(".lupa-facet-content").exists()).toBe(false);
    expect(
      wrapper.find(".lupa-facet-label-caret").classes().includes("open")
    ).toBe(false);
  });

  it("should render facet when its opened", async () => {
    const wrapper = getComponent({ type: "stats" as any, label: "Price" });
    const label = wrapper.find(".lupa-search-result-facet-label");
    await label.trigger("click");
    expect(wrapper.find(".lupa-facet-content").exists()).toBe(true);
    expect(
      wrapper.find(".lupa-facet-label-caret").classes().includes("open")
    ).toBe(true);
  });

  it("should render facet opened by default", async () => {
    const wrapper = getComponent(
      { type: "stats" as any, label: "Price", key: "opened" },
      { expand: ["opened"] }
    );
    expect(wrapper.find(".lupa-facet-content").exists()).toBe(true);
    expect(
      wrapper.find(".lupa-facet-label-caret").classes().includes("open")
    ).toBe(true);
  });
});
