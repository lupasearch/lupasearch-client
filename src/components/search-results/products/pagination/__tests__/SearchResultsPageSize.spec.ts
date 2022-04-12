/* eslint-disable @typescript-eslint/no-explicit-any */
import { QUERY_PARAMS } from "@/constants/queryParams.const";
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";
import SearchResultModule from "@/store/modules/searchResult";
import { RootState } from "@/store/types/State";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import Vuex, { Store } from "vuex";
import SearchResultsPageSize from "../SearchResultsPageSize.vue";

jest.mock("@/store/modules/searchResult");

const SearchResultModuleMock = mocked(SearchResultModule, true);

const localVue = createLocalVue();

localVue.use(Vuex);

describe("SearchResultsPageSize", () => {
  let wrapper: Wrapper<SearchResultsPageSize, Element>;
  let wrapperVm: any;

  let store: Store<RootState>;

  const pageSizes = DEFAULT_OPTIONS_RESULTS.pagination.sizeSelection.sizes;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        searchResult: SearchResultModuleMock,
      },
    });

    wrapper = mount(SearchResultsPageSize, {
      propsData: {
        label: DEFAULT_OPTIONS_RESULTS.labels.pageSize,
        options: {
          sizes: DEFAULT_OPTIONS_RESULTS.pagination.sizeSelection.sizes,
          selectedSize:
            DEFAULT_OPTIONS_RESULTS.pagination.sizeSelection.sizes[1],
        },
      },
      store,
      localVue,
    });
    wrapperVm = wrapper.vm as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const location = new URL("https://www.example.com/search?q=abc") as any;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete window.location;
    window.location = location;

    jest.spyOn(wrapperVm, "appendParams");
  });

  it("should change select value when option is selected", async () => {
    wrapper.find("select").trigger("click");
    wrapper.findAll("option").at(2).setSelected();

    const select = wrapper.find("select").element as HTMLSelectElement;
    expect(select.value).toBe(pageSizes[2].toString());

    expect(wrapperVm.appendParams).toHaveBeenCalledWith({
      params: [{ name: QUERY_PARAMS.LIMIT, value: pageSizes[2].toString() }],
      paramsToRemove: [QUERY_PARAMS.PAGE],
    });
  });
});
