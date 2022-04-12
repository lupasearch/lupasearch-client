/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchResultModule from "@/store/modules/searchResult";
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import SearchResultsProducts from "../SearchResultsProducts.vue";
import Vuex, { Store } from "vuex";
import { RootState } from "@/store/types/State";
import { pick } from "@/utils/picker.utils";
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";

const SearchResultModuleMock = mocked(SearchResultModule, true);

const localVue = createLocalVue();

localVue.use(Vuex);

describe("SearchResultsProducts", () => {
  let store: Store<RootState>;
  let wrapper: Wrapper<SearchResultsProducts, Element>;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        searchResult: SearchResultModuleMock,
      },
    });
    wrapper = shallowMount(SearchResultsProducts, {
      propsData: {
        options: pick(DEFAULT_OPTIONS_RESULTS, [
          "grid",
          "labels",
          "queryKey",
          "options",
          "pagination",
          "sort",
          "isInStock",
          "badges",
          "links",
          "elements",
        ]),
      },
      store,
      localVue,
    });
  });

  it("should display spinner overlay", async () => {
    await store.dispatch("searchResult/setLoading", true, { root: true });
    expect(wrapper.find(".lupa-loader").exists()).toBeTruthy();
  });
});
