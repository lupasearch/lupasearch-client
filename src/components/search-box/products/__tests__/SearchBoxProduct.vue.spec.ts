import { mocked } from "ts-jest/utils";
import { shallowMount } from "@vue/test-utils";
import SearchBoxProduct from "../SearchBoxProduct.vue";
import { generateLink } from "@/utils/link.utils";
import SearchBoxProductElement from "../elements/SearchBoxProductElement.vue";

jest.mock("@/utils/link.utils");

const generateLinkMock = mocked(generateLink);

describe("SearchBoxProduct.vue", () => {
  beforeEach(() => {
    generateLinkMock.mockReturnValue("https://getlupa.com/link");
  });

  it("should be rendered", () => {
    const wrapper = shallowMount(SearchBoxProduct, {
      propsData: {
        panelOptions: { links: { details: "{url}" } },
        item: { url: "test" },
      },
    });
    expect(wrapper.find("a").exists()).toBe(true);
  });

  it("should render a correct link", () => {
    const wrapper = shallowMount(SearchBoxProduct, {
      propsData: {
        panelOptions: { links: { details: "{url}" } },
        item: { url: "test" },
      },
    });
    const product = wrapper.find("a");
    expect(product.attributes().href).toEqual("https://getlupa.com/link");
    expect(wrapper.find("a").exists()).toBe(true);
  });

  it("should render no elements if there are no elements passed in config", () => {
    const wrapper = shallowMount(SearchBoxProduct, {
      propsData: {
        panelOptions: { links: { details: "{url}" }, elements: [] },
        item: { url: "test" },
      },
    });
    const elements = wrapper.findAllComponents(SearchBoxProductElement);
    expect(elements.length).toBe(0);
  });

  it("should render correct number of components passed in config", () => {
    const wrapper = shallowMount(SearchBoxProduct, {
      propsData: {
        panelOptions: {
          links: { details: "{url}" },
          elements: [
            { type: "custom", key: "key1" },
            { type: "custom", key: "key2" },
          ],
        },
        item: { url: "test" },
      },
    });
    const elements = wrapper.findAllComponents(SearchBoxProductElement);
    expect(elements.length).toBe(2);
  });

  it("should render image element in separate wrapper", () => {
    const wrapper = shallowMount(SearchBoxProduct, {
      propsData: {
        panelOptions: {
          links: { details: "{url}" },
          elements: [
            { type: "image", key: "image" },
            { type: "custom", key: "key2" },
            { type: "custom", key: "key3" },
          ],
        },
        item: { url: "test" },
      },
    });
    const imageElements = wrapper.findAll(
      ".lupa-search-box-product-image-section > .lupa-search-box-product-element"
    );
    expect(imageElements.length).toBe(1);
    const detailElements = wrapper.findAll(
      ".lupa-search-box-product-details-section > .lupa-search-box-product-element"
    );
    expect(detailElements.length).toBe(2);
  });
});
