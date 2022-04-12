/* eslint-disable @typescript-eslint/no-explicit-any */
import { mocked } from "ts-jest/utils";
import { getDisplayValue, getNormalizedString } from "@/utils/string.utils";
import { FacetGroup } from "@getlupa/client-sdk/Types";
import { ResultFacetOptions } from "@/types/search-results/SearchResultsOptions";
import { shallowMount } from "@vue/test-utils";
import TermFacet from "../TermFacet.vue";
import { merge } from "@/utils/merger.utils";

jest.mock("@/utils/string.utils");

const getNormalizedStringMock = mocked(getNormalizedString);
const getDisplayValueMock = mocked(getDisplayValue);

const baseFacet: FacetGroup = {
  type: "terms" as unknown as any,
  key: "tag",
  label: "Tag",
  items: [
    { title: "one", count: 1 },
    { title: "two", count: 2 },
    { title: "three", count: 3 },
    { title: "four", count: 4 },
    { title: "five", count: 5 },
  ],
};

const baseOptions: ResultFacetOptions = {
  labels: {
    title: "Title",
    showAll: "Show all",
    facetFilter: "Facet filter",
  },
};

const getComponent = (
  options?: Partial<ResultFacetOptions>,
  facet?: Partial<TermFacet>,
  currentFilters: string[] = []
) => {
  return shallowMount(TermFacet, {
    propsData: {
      options: merge(baseOptions, options ?? {}),
      facet: merge(baseFacet, facet ?? {}),
      currentFilters,
    },
  });
};

describe("TermFacet", () => {
  beforeEach(() => {
    getDisplayValueMock.mockImplementation((v) => v as string);
  });

  it("should be rendered", () => {
    const wrapper = getComponent();
    expect(wrapper.find(".lupa-search-result-facet-term-values").exists()).toBe(
      true
    );
  });

  it("should render all 5 items", () => {
    const wrapper = getComponent();
    const items = wrapper.findAll(".lupa-term-label");
    const texts = items.wrappers.map((i) => i.text());
    const filter = wrapper.find(".lupa-term-filter");
    const showMore = wrapper.find(".lupa-show-more-facet-results");
    expect(texts).toEqual(["one", "two", "three", "four", "five"]);
    expect(showMore.exists()).toBe(false);
    expect(filter.exists()).toBe(false);
  });

  it("should render item counts, if configured", () => {
    const wrapper = getComponent({ showDocumentCount: true });
    const items = wrapper.findAll(".lupa-term-count");
    const texts = items.wrappers.map((i) => i.text());

    expect(texts).toEqual(["(1)", "(2)", "(3)", "(4)", "(5)"]);
  });

  it("should render 3 items and show more button if item count is limited", () => {
    const wrapper = getComponent({ facetValueCountLimit: 3 });
    const items = wrapper.findAll(".lupa-term-label");
    const showMore = wrapper.find(".lupa-show-more-facet-results");
    expect(items.length).toBe(3);
    expect(showMore.text()).toBe("Show all");
  });

  it("should render all items if show more is clicked", async () => {
    const wrapper = getComponent({ facetValueCountLimit: 3 });
    const showMore = wrapper.find(".lupa-show-more-facet-results");
    await showMore.trigger("click");
    const items = wrapper.findAll(".lupa-term-label");
    expect(items.length).toBe(5);
  });

  it("should render item filter", () => {
    const wrapper = getComponent({ filterable: { minValues: 4 } });
    const filter = wrapper.find(".lupa-term-filter");
    expect(filter.exists()).toBe(true);
  });

  it("should filter items", async () => {
    getNormalizedStringMock.mockImplementation(
      (s) => s ?? ("" as unknown as any)
    );
    const wrapper = getComponent({ filterable: { minValues: 4 } });
    const filter = wrapper.find(".lupa-term-filter");
    await filter.setValue("o");
    const items = wrapper.findAll(".lupa-term-label");
    const texts = items.wrappers.map((i) => i.text());
    expect(texts).toEqual(["one", "two", "four"]);
  });

  it("should render a checkbox if filter is checked", async () => {
    const wrapper = getComponent({}, {}, ["two", "five"]);
    const checkboxes = wrapper.findAll(".lupa-term-checkbox");
    const checkStatus = checkboxes.wrappers
      .map((c) => c.classes())
      .map((c) => c.includes("checked"));
    expect(checkStatus).toEqual([false, true, false, false, true]);
  });

  it("should emit event on click", async () => {
    const wrapper = getComponent();
    const items = wrapper.findAll(".lupa-facet-term");
    items.wrappers[3].trigger("click");
    expect(wrapper.emitted().select).toEqual([
      [{ key: "tag", value: "four", type: "terms" }],
    ]);
  });
});
