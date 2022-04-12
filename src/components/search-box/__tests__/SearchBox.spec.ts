/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchBox from "@/components/search-box/SearchBox.vue";
import { SuggestionsMockData } from "@/constants/mockData..const";
import { DEFAULT_SEARCH_BOX_OPTIONS } from "@/constants/searchBox.const";
import { FetchedData, InputSuggestion } from "@/types/search-box/Common";
import {
  SearchBoxInputOptions,
  SearchBoxPanelOptions,
} from "@/types/search-box/SearchBoxOptions";
import { SearchBoxPanelType } from "@/types/search-box/SearchBoxPanel";
import { Suggestion } from "@getlupa/client-sdk/Types";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuex from "vuex";
import Vue from "vue";
import { mocked } from "ts-jest/utils";
import SearchBoxModule from "@/store/modules/searchBox";
import HistoryModule from "@/store/modules/history";
import SearchBoxInput from "../SearchBoxInput.vue";
import ParamsModule from "@/store/modules/params";
import { SdkOptions } from "@/types/General";

jest.mock("@/store/modules/searchBox");
jest.mock("@/store/modules/history");
jest.mock("@/store/modules/params");

const SearchBoxModuleMock = mocked(SearchBoxModule, true);
const HistoryModuleMock = mocked(HistoryModule, true);
const ParamsModuleMock = mocked(ParamsModule, true);

const mountSearchBox = () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Vuex.Store({
    modules: {
      searchBox: SearchBoxModuleMock,
      history: HistoryModuleMock,
      params: ParamsModuleMock,
    },
  });

  return mount(SearchBox, {
    propsData: { options: DEFAULT_SEARCH_BOX_OPTIONS },
    store,
    localVue,
    data() {
      return {
        suggestedValue: {
          item: SuggestionsMockData.items[0],
          override: false,
          queryKey: "123",
        },
      };
    },
    stubs: { SearchBoxMainPanel: { template: "<span/>" } },
  });
};

describe("SearchBox.vue", () => {
  let searchBox: Wrapper<SearchBox, Element>;
  let searchBoxVm: any;

  beforeEach(() => {
    searchBox = mountSearchBox();
    searchBoxVm = searchBox.vm as any;

    jest.spyOn(window.history, "pushState");
  });

  it("check panelOptions", () => {
    expect(searchBoxVm.panelOptions).toStrictEqual<SearchBoxPanelOptions>({
      minInputLength: DEFAULT_SEARCH_BOX_OPTIONS.minInputLength,
      panels: DEFAULT_SEARCH_BOX_OPTIONS.panels as any[],
      history: DEFAULT_SEARCH_BOX_OPTIONS.history,
      labels: DEFAULT_SEARCH_BOX_OPTIONS.labels,
      links: DEFAULT_SEARCH_BOX_OPTIONS.links,
      options: DEFAULT_SEARCH_BOX_OPTIONS.options as SdkOptions,
      debounce: DEFAULT_SEARCH_BOX_OPTIONS.debounce,
      showTotalCount: DEFAULT_SEARCH_BOX_OPTIONS.showTotalCount,
    });
  });

  it("check inputOptions", () => {
    expect(searchBoxVm.inputOptions).toStrictEqual<SearchBoxInputOptions>({
      minInputLength: DEFAULT_SEARCH_BOX_OPTIONS.minInputLength,
      labels: DEFAULT_SEARCH_BOX_OPTIONS.labels,
      links: DEFAULT_SEARCH_BOX_OPTIONS.links,
      inputAttributes: DEFAULT_SEARCH_BOX_OPTIONS.inputAttributes,
    });
  });

  it("handle items fetch", () => {
    const fetchedData: FetchedData = {
      items: SuggestionsMockData.items,
      type: SearchBoxPanelType.SUGGESTION,
    };
    searchBoxVm.handleItemsFetch(fetchedData);
    expect(searchBoxVm.suggestedValue).toStrictEqual<InputSuggestion>({
      item: fetchedData.items[0] as Suggestion,
      override: false,
      queryKey: "",
    });
  });

  it("when TAB is clicked, input should be filled with suggestion", async () => {
    const suggestionValue = SuggestionsMockData.items[0].suggestion;

    searchBox = mountSearchBox();
    searchBoxVm = searchBox.vm as any;

    // Substitute for actual Tab click (can't simulate KeyboardEvent with specific target)
    searchBoxVm.selectSuggestion({
      item: SuggestionsMockData.items[0],
      override: true,
      queryKey: "123",
    });

    expect(searchBoxVm.inputValue).toBe(suggestionValue);
    expect(searchBoxVm.suggestedValue).toStrictEqual<InputSuggestion>({
      item: SuggestionsMockData.items[0],
      override: true,
      queryKey: "123",
    });

    await Vue.nextTick();

    const input = searchBox.findComponent(SearchBoxInput);

    expect((input.vm as any).input).toBe(suggestionValue);

    expect((input.find("input").element as HTMLInputElement).value).toBe(
      suggestionValue
    );
  });
});
