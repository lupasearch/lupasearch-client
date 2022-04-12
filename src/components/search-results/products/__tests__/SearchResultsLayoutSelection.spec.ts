/* eslint-disable @typescript-eslint/no-explicit-any */
import OptionsModule from "@/store/modules/options";
import SearchResultModule from "@/store/modules/searchResult";
import { RootState } from "@/store/types/State";
import { ResultsLayoutEnum } from "@/types/search-results/ResultsLayout";
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import Vue from "vue";
import Vuex, { Store } from "vuex";
import SearchResultsLayoutSelection from "../SearchResultsLayoutSelection.vue";

const SearchResultModuleMock = mocked(SearchResultModule, true);
const OptionsModuleMock = mocked(OptionsModule, true);

const localVue = createLocalVue();

localVue.use(Vuex);

describe("SearchResultsLayoutSelection", () => {
  let store: Store<RootState>;
  let wrapper: Wrapper<SearchResultsLayoutSelection, Element>;
  let wrapperVm: any;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        searchResult: SearchResultModuleMock,
        options: OptionsModuleMock,
      },
    });
    wrapper = shallowMount(SearchResultsLayoutSelection, {
      localVue,
      store,
    });
    wrapperVm = wrapper.vm as any;
    jest.spyOn(wrapperVm, "handleLayoutChange");
  });

  it("should change to the correct layout", async () => {
    wrapper.find(".lupa-layout-selection-list").trigger("click");
    await Vue.nextTick();
    expect(wrapperVm.handleLayoutChange).toHaveBeenCalledWith(
      ResultsLayoutEnum.LIST
    );
    expect(store.state.searchResult.layout).toBe(ResultsLayoutEnum.LIST);

    wrapper.find(".lupa-layout-selection-grid").trigger("click");
    await Vue.nextTick();
    expect(wrapperVm.handleLayoutChange).toHaveBeenCalledWith(
      ResultsLayoutEnum.GRID
    );
    expect(store.state.searchResult.layout).toBe(ResultsLayoutEnum.GRID);
  });

  it("should add lupa-layout-selection-active class to the correct button", async () => {
    checkForActiveClass();
    wrapper.find(".lupa-layout-selection-list").trigger("click");
    await Vue.nextTick();
    checkForActiveClass();
  });

  const checkForActiveClass = (): void => {
    if (store.state.searchResult.layout === ResultsLayoutEnum.GRID) {
      expect(
        wrapper
          .find(".lupa-layout-selection-grid")
          .classes()
          .includes("lupa-layout-selection-active")
      ).toBeTruthy();
    } else {
      expect(
        wrapper
          .find(".lupa-layout-selection-list")
          .classes()
          .includes("lupa-layout-selection-active")
      ).toBeTruthy();
    }
  };
});
