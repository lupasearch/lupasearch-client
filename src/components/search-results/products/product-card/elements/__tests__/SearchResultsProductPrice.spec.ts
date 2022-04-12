import { mocked } from "ts-jest/utils";
import { shallowMount } from "@vue/test-utils";
import SearchResultsProductPrice from "../SearchResultsProductPrice.vue";
import { formatPrice } from "@/utils/price.utils";

jest.mock("@/utils/price.utils");
const formatPriceMock = mocked(formatPrice);

describe("SearchResultsProductPrice.vue", () => {
  beforeEach(() => {
    formatPriceMock.mockReturnValue("0.15 $");
  });

  it("should render formatted price", () => {
    const wrapper = shallowMount(SearchResultsProductPrice, {
      propsData: {
        options: { key: "price" },
        item: { price: 0.15 },
      },
    });
    const element = wrapper.find(".lupa-search-results-product-price");
    expect(element.text()).toEqual("0.15 $");
  });
});
