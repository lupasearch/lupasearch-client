/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultFacetOptions } from "@/types/search-results/SearchResultsOptions";
import { merge } from "@/utils/merger.utils";
import { FacetResult } from "@getlupa/client-sdk/Types";
import { shallowMount } from "@vue/test-utils";
import FacetDisplay from "../FacetDisplay.vue";

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

const getComponent = (facet: Partial<FacetResult> = {}) => {
  return shallowMount(FacetDisplay, {
    propsData: {
      options: baseOptions,
      facet: merge(baseFacet, facet),
    },
  });
};

describe("FacetList", () => {
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
});
