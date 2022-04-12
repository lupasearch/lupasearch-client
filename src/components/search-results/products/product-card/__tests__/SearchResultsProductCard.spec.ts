/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnchorPosition } from "@/types/search-results/SearchResultsProductCardOptions";
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import SearchResultsProductCard from "../SearchResultsProductCard.vue";
import Vuex, { Store } from "vuex";
import { mocked } from "ts-jest/utils";
import ParamsModule from "@/store/modules/params";
import TrackingModule from "@/store/modules/tracking";
import { RootState } from "@/store/types/State";
import SearchResultModule from "@/store/modules/searchResult";
import { ResultsLayoutEnum } from "@/types/search-results/ResultsLayout";

const TrackingModuleMock = mocked(TrackingModule, true);
const ParamsModuleMock = mocked(ParamsModule, true);
const SearchResultModuleMock = mocked(SearchResultModule, true);

const localVue = createLocalVue();

localVue.use(Vuex);

describe("SearchResultsProductCard", () => {
  let store: Store<RootState>;
  let wrapper: Wrapper<SearchResultsProductCard, Element>;
  let wrapperVm: any;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        tracking: TrackingModuleMock,
        params: ParamsModuleMock,
        searchResult: SearchResultModuleMock,
      },
    });
    wrapper = shallowMount(SearchResultsProductCard, {
      propsData: {
        options: {
          isInStock: (): boolean => {
            return true;
          },
          badges: {
            anchor: "tr" as AnchorPosition,
            elements: [],
          },
          links: {
            details: "/{name}",
          },
          elements: [],
        },
        product: {
          name: "test",
          price: "10",
        },
      },
      localVue,
      store,
    });
    wrapperVm = wrapper.vm as any;

    jest.spyOn(window.location, "assign");
  });

  it("should correctly check if product is in stock", () => {
    expect(wrapperVm.isInStock).toBeTruthy();
  });

  it("should have a link attribute", async () => {
    const cardLink = wrapper.find("a.lupa-search-result-product-image-section");
    expect(cardLink.attributes().href).toEqual("/test");
  });

  it("should add lupa-search-result-product-contents-list class when layout is 'List' and isAdditionalPanel is false", () => {
    if (
      wrapperVm.layout === ResultsLayoutEnum.LIST &&
      !wrapperVm.isAdditionalPanel
    ) {
      expect(
        wrapper.find("#lupa-search-result-product-contents-list").exists()
      ).toBeTruthy();
    } else {
      expect(
        wrapper.find("#lupa-search-result-product-contents-list").exists()
      ).toBeFalsy();
    }
  });
});
