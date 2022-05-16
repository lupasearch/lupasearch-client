import { shallowMount, Wrapper } from "@vue/test-utils";
import SearchResultsProductRating from "../SearchResultsProductRating.vue";

describe("SearchResultsProductRating.vue", () => {
  let wrapper: Wrapper<SearchResultsProductRating, Element>;

  beforeEach(() => {
    wrapper = shallowMount(SearchResultsProductRating, {
      propsData: {
        options: {
          type: "rating",
          labels: {
            numberOfRatings: "Ratings:",
          },
          key: "ratingKey",
          totalKey: "totalRatingsKey",
        },
        item: { ratingKey: "80", totalRatingsKey: "10" },
      },
    });
  });

  it("should render correct ratings count", () => {
    expect(wrapper.find(".lupa-total-ratings").text()).toBe("(Ratings:10)");
  });

  it("should render base stars", () => {
    expect(
      wrapper.findAll(".lupa-rating-not-highlighted").wrappers.length
    ).toBe(5);
  });

  it("should render proper width based on rating", () => {
    expect(wrapper.find(".lupa-ratings-highlighted").attributes().style).toBe(
      "width: 80%;"
    );
  });
});
