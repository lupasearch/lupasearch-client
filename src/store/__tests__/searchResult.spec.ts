import { ResultsLayoutEnum } from "@/types/search-results/ResultsLayout";
import { createLocalVue } from "@vue/test-utils";
import { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import OptionsModule from "../modules/options";
import SearchResultModule from "../modules/searchResult";
import { RootState, SearchResultState } from "../types/State";

describe("searchResultModule", () => {
  let localVue: VueConstructor<Vue>;
  let store: Store<RootState>;
  let state: SearchResultState;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store({});
    store.registerModule("searchResult", SearchResultModule);
    store.registerModule("options", OptionsModule);
    state = store.state.searchResult;
  });

  it("should have initial state", () => {
    expect(state.searchResult).toEqual({});

    expect(state.columnCount).toEqual(2);
  });

  it("should set the search result", async () => {
    const searchResult = { searchText: "abc", total: 10, items: [] };
    await store.dispatch("searchResult/add", searchResult, { root: true });
    expect(state.searchResult).toStrictEqual(searchResult);
  });

  it("should set the column count", async () => {
    await store.dispatch(
      "searchResult/setColumnCount",
      {
        width: 1080,
        grid: {
          columns: {
            xl: 4,
            l: 3,
            md: 2,
            sm: 2,
            xs: 1,
          },
        },
      },
      { root: true }
    );
    expect(state.columnCount).toStrictEqual(3);
  });

  it("should set the layout", async () => {
    const layout = ResultsLayoutEnum.LIST;
    await store.dispatch("searchResult/setLayout", layout, { root: true });
    expect(state.layout).toBe(layout);
  });
});
