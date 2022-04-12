import { mocked } from "ts-jest/utils";
import { shallowMount } from "@vue/test-utils";
import SearchBoxProductPrice from "../SearchBoxProductPrice.vue";
import { formatPrice } from "@/utils/price.utils";

jest.mock("@/utils/price.utils");
const formatPriceMock = mocked(formatPrice);

describe("SearchBoxProductPrice.vue", () => {
  beforeEach(() => {
    formatPriceMock.mockReturnValue("0.15 $");
  });

  it("should render formatted price", () => {
    const wrapper = shallowMount(SearchBoxProductPrice, {
      propsData: {
        options: { key: "price" },
        item: { price: 0.15 },
      },
    });
    const element = wrapper.find(".lupa-search-box-product-price");
    expect(element.text()).toEqual("0.15 $");
  });
});
