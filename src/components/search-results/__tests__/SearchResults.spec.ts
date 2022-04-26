/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_PAGE_SIZE } from "@/constants/global.const";
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";
import OptionsModule from "@/store/modules/options";
import ParamsModule from "@/store/modules/params";
import SearchResultModule from "@/store/modules/searchResult";
import { RootState } from "@/store/types/State";
import { SdkOptions } from "@/types/General";
import { SearchResultsProductOptions } from "@/types/search-results/SearchResultsOptions";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import Vuex, { Store } from "vuex";
import SearchResults from "../SearchResults.vue";

const resizeSpy = jest.fn();

jest.mock("@/store/modules/searchResult");
jest.mock("@/store/modules/params");
jest.mock("@/store/modules/options");

const SearchResultModuleMock = mocked(SearchResultModule, true);
const ParamsModuleMock = mocked(ParamsModule, true);
const OptionsModuleMock = mocked(OptionsModule, true);

const localVue = createLocalVue();

localVue.use(Vuex);

beforeAll(() => {
  window.addEventListener("resize", resizeSpy);
});

describe("SearchResult", () => {
  let store: Store<RootState>;

  let searchResult: Wrapper<SearchResults, Element>;
  let searchResultVm: any;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        searchResult: SearchResultModuleMock,
        params: ParamsModuleMock,
        options: OptionsModuleMock,
      },
    });

    searchResult = mountSearchResults(store);
    searchResultVm = searchResult.vm as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const location = new URL("https://www.example.com") as any;
    location.assign = jest.fn();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete window.location;
    window.location = location;
  });

  it("check productsOptions", () => {
    expect(searchResultVm.productsOptions).toEqual<SearchResultsProductOptions>(
      {
        filters: DEFAULT_OPTIONS_RESULTS.filters,
        grid: DEFAULT_OPTIONS_RESULTS.grid,
        labels: DEFAULT_OPTIONS_RESULTS.labels,
        queryKey: DEFAULT_OPTIONS_RESULTS.queryKey,
        options: DEFAULT_OPTIONS_RESULTS.options as SdkOptions,
        pagination: DEFAULT_OPTIONS_RESULTS.pagination,
        sort: DEFAULT_OPTIONS_RESULTS.sort,
        isInStock: DEFAULT_OPTIONS_RESULTS.isInStock,
        badges: DEFAULT_OPTIONS_RESULTS.badges,
        links: DEFAULT_OPTIONS_RESULTS.links,
        elements: DEFAULT_OPTIONS_RESULTS.elements,
      }
    );
  });

  it("should change columnCount on window resize", async () => {
    window.dispatchEvent(new Event("resize"));
    expect(SearchResultModuleMock.actions?.setColumnCount).toHaveBeenCalled();
  });

  it("should set default limit on mount", async () => {
    expect(ParamsModuleMock.actions?.setDefaultLimit).toHaveBeenCalled();
    expect(store.state.params.defaultLimit).toBe(DEFAULT_PAGE_SIZE);
  });

  it("should get search results when url changes", () => {
    // TODO: use cypress to test this case
  });

  const mountSearchResults = (store: Store<RootState>) => {
    return mount(SearchResults, {
      propsData: {
        options: DEFAULT_OPTIONS_RESULTS,
      },
      store,
      localVue,
    });
  };
});
