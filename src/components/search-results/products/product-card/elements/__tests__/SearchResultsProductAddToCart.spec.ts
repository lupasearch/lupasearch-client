/* eslint-disable @typescript-eslint/no-explicit-any */
import { shallowMount, Wrapper } from "@vue/test-utils";
import Vue from "vue";
import SearchResultsProductAddToCart from "../SearchResultsProductAddToCart.vue";

describe("SearchResultsProductAddToCart.vue", () => {
  let wrapper: Wrapper<SearchResultsProductAddToCart, Element>;
  let wrapperVm: any;

  beforeEach(() => {
    wrapper = shallowMount(SearchResultsProductAddToCart, {
      propsData: {
        options: {
          type: "addToCart",
          labels: {
            addToCart: "Add to Cart",
          },
          action: (
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            document: Document,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            amount: number
          ): Promise<unknown> | undefined => {
            return new Promise((resolve) => setTimeout(resolve, 2000));
          },
        },
        item: { name: "test" },
      },
    });
    wrapperVm = wrapper.vm as any;
    jest.spyOn(wrapperVm, "handleClick");
  });

  it("should render correct label", () => {
    expect(wrapper.find("button").text()).toBe("Add to Cart");
  });

  it("should set loading class to the button when its clicked", async () => {
    const button = wrapper.find("button");
    button.trigger("click");
    expect(wrapperVm.handleClick).toHaveBeenCalled();
    await Vue.nextTick();

    expect(wrapperVm.loading).toBe(true);
    expect(button.element.className).toBe("lupa-add-to-cart-loading");
  });
});
