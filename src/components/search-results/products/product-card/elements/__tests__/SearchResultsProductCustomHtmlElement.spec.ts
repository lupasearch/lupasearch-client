import { Document } from "@getlupa/client-sdk/Types";
import { shallowMount } from "@vue/test-utils";
import SearchResultsProductCustomHtmlElement from "../custom/SearchResultsProductCustomHtmlElement.vue";

describe("SearchResultsProductCustomHtmlElement.vue", () => {
  it("should render item text as html string", () => {
    const wrapper = shallowMount(SearchResultsProductCustomHtmlElement, {
      propsData: {
        options: {
          className: "custom-class",
          html: (doc: Document) =>
            `
              <a href='/'>Create account</a>
              <span>to save ${doc["discount"]} € (${doc["discountPercentages"]})</span>
            `,
        },
        item: { discount: "5", discountPercentages: "15%" },
      },
    });
    const element = wrapper.find(".custom-class");
    expect(element.find("a").text()).toEqual("Create account");
    expect(element.find("span").text()).toEqual("to save 5 € (15%)");
  });

  it("should render empty string if property is empty", () => {
    const wrapper = shallowMount(SearchResultsProductCustomHtmlElement, {
      propsData: {
        options: { html: () => "", className: "custom-class" },
        item: { name: "<div>Product title</div>" },
      },
    });
    const element = wrapper.find(".custom-class");
    expect(element.text()).toEqual("");
  });
});
