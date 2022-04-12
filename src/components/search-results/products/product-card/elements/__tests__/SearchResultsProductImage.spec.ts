import { shallowMount } from "@vue/test-utils";
import SearchResultsProductImage from "../SearchResultsProductImage.vue";

describe("SearchResultsProductImage.vue", () => {
  it("should render placeholder if product has no image", () => {
    const wrapper = shallowMount(SearchResultsProductImage, {
      propsData: {
        options: { key: "image", placeholder: "placeholder.jpg" },
        item: { image: "" },
      },
    });
    const element = wrapper.find(".lupa-search-results-image");
    expect(element.attributes().src).toEqual("placeholder.jpg");
  });

  it("should render image if it is defined", () => {
    const wrapper = shallowMount(SearchResultsProductImage, {
      propsData: {
        options: { key: "imageUrl", placeholder: "placeholder.jpg" },
        item: { imageUrl: "https://google.com/image/123" },
      },
    });
    const element = wrapper.find(".lupa-search-results-image");
    expect(element.attributes().src).toEqual("https://google.com/image/123");
  });

  it("should render image with base url", () => {
    const wrapper = shallowMount(SearchResultsProductImage, {
      propsData: {
        options: {
          key: "imageUrl",
          placeholder: "placeholder.jpg",
          baseUrl: "https://google.com/image",
        },
        item: { imageUrl: "123.png" },
      },
    });
    const element = wrapper.find(".lupa-search-results-image");
    expect(element.attributes().src).toEqual(
      "https://google.com/image/123.png"
    );
  });

  it("should render image if it has no base url", () => {
    const wrapper = shallowMount(SearchResultsProductImage, {
      propsData: {
        options: {
          key: "imageUrl",
          placeholder: "placeholder.jpg",
        },
        item: { imageUrl: "123.png" },
      },
    });
    const element = wrapper.find(".lupa-search-results-image");
    expect(element.attributes().src).toEqual("/123.png");
  });
});
