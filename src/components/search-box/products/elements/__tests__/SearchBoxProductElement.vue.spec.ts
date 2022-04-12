import { mount } from "@vue/test-utils";
import SearchBoxProductElement from "../SearchBoxProductElement.vue";
import SearchBoxProductImage from "../SearchBoxProductImage.vue";
import SearchBoxProductTitle from "../SearchBoxProductTitle.vue";
import SearchBoxProductDescription from "../SearchBoxProductDescription.vue";

describe("SearchBoxProductElement.vue", () => {
  it("should render image item type", () => {
    const wrapper = mount(SearchBoxProductElement, {
      propsData: {
        element: { type: "image" },
        item: { name: "Product title" },
      },
    });
    const element = wrapper.findComponent(SearchBoxProductImage);
    expect(element.exists()).toBe(true);
  });

  it("should render title item type", () => {
    const wrapper = mount(SearchBoxProductElement, {
      propsData: {
        element: { type: "title" },
        item: { name: "Product title" },
      },
    });
    const element = wrapper.findComponent(SearchBoxProductTitle);
    expect(element.exists()).toBe(true);
  });

  it("should render description item type", () => {
    const wrapper = mount(SearchBoxProductElement, {
      propsData: {
        element: { type: "description" },
        item: { name: "Product title" },
      },
    });
    const element = wrapper.findComponent(SearchBoxProductDescription);
    expect(element.exists()).toBe(true);
  });

  it("should not render element if display element returns false", () => {
    const wrapper = mount(SearchBoxProductElement, {
      propsData: {
        element: { type: "description", display: () => false },
        item: { name: "Product title" },
      },
    });
    const element = wrapper.findComponent(SearchBoxProductDescription);
    expect(element.exists()).toBe(false);
  });
});
