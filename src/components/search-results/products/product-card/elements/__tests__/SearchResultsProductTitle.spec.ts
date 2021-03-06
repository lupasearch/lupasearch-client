import { shallowMount } from "@vue/test-utils";
import SearchResultsProductTitle from "../SearchResultsProductTitle.vue";

describe("SearchResultsProductTitle.vue", () => {
  it("should render item text as simple string", () => {
    const wrapper = shallowMount(SearchResultsProductTitle, {
      propsData: {
        options: { isHtml: false, key: "name" },
        item: { name: "<div>Product title</div>" },
      },
    });
    const element = wrapper.find(".lupa-search-results-product-title");
    expect(element.text()).toEqual("<div>Product title</div>");
  });

  it("should render item text as html string", () => {
    const wrapper = shallowMount(SearchResultsProductTitle, {
      propsData: {
        options: { isHtml: true, key: "name" },
        item: { name: "<div>Product title</div>" },
      },
    });
    const element = wrapper.find(".lupa-search-results-product-title");
    expect(element.text()).toEqual("Product title");
  });

  it("should render empty string if property is empty", () => {
    const wrapper = shallowMount(SearchResultsProductTitle, {
      propsData: {
        options: { isHtml: false, key: "other" },
        item: { name: "<div>Product title</div>" },
      },
    });
    const element = wrapper.find(".lupa-search-results-product-title");
    expect(element.text()).toEqual("");
  });
});
