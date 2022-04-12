import { shallowMount } from "@vue/test-utils";
import SearchBoxProductCustom from "../SearchBoxProductCustom.vue";

describe("SearchBoxProductCustom.vue", () => {
  it("should render item text as simple string with custom class name", () => {
    const wrapper = shallowMount(SearchBoxProductCustom, {
      propsData: {
        options: { isHtml: false, key: "name", className: "custom-class" },
        item: { name: "<div>Product title</div>" },
      },
    });
    const element = wrapper.find(".custom-class");
    expect(element.text()).toEqual("<div>Product title</div>");
  });

  it("should render item text as html string", () => {
    const wrapper = shallowMount(SearchBoxProductCustom, {
      propsData: {
        options: { isHtml: true, key: "name", className: "custom-class" },
        item: { name: "<div>Product title</div>" },
      },
    });
    const element = wrapper.find(".custom-class");
    expect(element.text()).toEqual("Product title");
  });

  it("should render empty string if property is empty", () => {
    const wrapper = shallowMount(SearchBoxProductCustom, {
      propsData: {
        options: { isHtml: false, key: "other", className: "custom-class" },
        item: { name: "<div>Product title</div>" },
      },
    });
    const element = wrapper.find(".custom-class");
    expect(element.text()).toEqual("");
  });
});
