/* eslint-disable @typescript-eslint/no-explicit-any */
import { QUERY_PARAMS } from "@/constants/queryParams.const";
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";
import ParamsModule from "@/store/modules/params";
import SearchResultModule from "@/store/modules/searchResult";
import { RootState } from "@/store/types/State";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import Vuex, { Store } from "vuex";
import SearchResultsSort from "../SearchResultsSort.vue";

jest.mock("@/store/modules/searchResult");
jest.mock("@/store/modules/params");

const SearchResultModuleMock = mocked(SearchResultModule, true);
const ParamsModuleMock = mocked(ParamsModule, true);

const localVue = createLocalVue();

localVue.use(Vuex);

const sort = [{ key: "s1" }, { key: "s2" }];

describe("SearchResultsSort", () => {
  let wrapper: Wrapper<SearchResultsSort, Element>;
  let wrapperVm: any;

  let store: Store<RootState>;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        history: SearchResultModuleMock,
        params: ParamsModuleMock,
      },
    });

    wrapper = mount(SearchResultsSort, {
      propsData: {
        options: {
          label: DEFAULT_OPTIONS_RESULTS.labels.sortBy,
          options: sort,
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
    wrapper.findAll("option").at(1).setSelected();

    const select = wrapper.find("select").element as HTMLSelectElement;
    expect(select.value).toBe(sort[1].key);

    const key = sort.find((x: any) => x.key === sort[1].key)?.key;
    expect(wrapperVm.appendParams).toHaveBeenCalledWith({
      params: [{ name: QUERY_PARAMS.SORT, value: key }],
      paramsToRemove: [QUERY_PARAMS.PAGE],
    });
  });
});
