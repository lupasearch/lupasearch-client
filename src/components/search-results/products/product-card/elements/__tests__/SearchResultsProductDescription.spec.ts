import { shallowMount } from "@vue/test-utils";
import SearchResultsProductDescription from "../SearchResultsProductDescription.vue";

describe("SearchResultsProductDescription.vue", () => {
  it("should render item text as simple string", () => {
    const wrapper = shallowMount(SearchResultsProductDescription, {
      propsData: {
        options: { isHtml: false, key: "description" },
        item: { description: "<div>Product description</div>" },
      },
    });
    const element = wrapper.find(".lupa-search-results-product-description");
    expect(element.text()).toEqual("<div>Product description</div>");
  });

  it("should render item text as html string", () => {
    const wrapper = shallowMount(SearchResultsProductDescription, {
      propsData: {
        options: { isHtml: true, key: "description" },
        item: { description: "<div>Product description</div>" },
      },
    });
    const element = wrapper.find(".lupa-search-results-product-description");
    expect(element.text()).toEqual("Product description");
  });

  it("should render empty string if property is empty", () => {
    const wrapper = shallowMount(SearchResultsProductDescription, {
      propsData: {
        options: { isHtml: false, key: "other" },
        item: { description: "<div>Product description</div>" },
      },
    });
    const element = wrapper.find(".lupa-search-results-product-description");
    expect(element.text()).toEqual("");
  });
});
