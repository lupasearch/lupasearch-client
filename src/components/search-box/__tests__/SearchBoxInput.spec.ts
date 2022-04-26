/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import SearchBoxInput from "@/components/search-box/SearchBoxInput.vue";
import { DEFAULT_SEARCH_BOX_OPTIONS } from "@/constants/searchBox.const";
import { SuggestionsMockData } from "@/constants/mockData..const";
import Vuex from "vuex";
import SearchBoxModule from "@/store/modules/searchBox";
import { mocked } from "ts-jest/utils";
import ParamsModule from "@/store/modules/params";

jest.mock("@/store/modules/searchBox");

const SearchBoxModuleMock = mocked(SearchBoxModule, true);
const ParamsModuleMock = mocked(ParamsModule, true);

const localVue = createLocalVue();

localVue.use(Vuex);

describe("SearchBoxInput", () => {
  let wrapper: Wrapper<SearchBoxInput, Element>;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    const store = new Vuex.Store({
      modules: {
        searchBox: SearchBoxModuleMock,
        params: ParamsModuleMock,
      },
    });
    wrapper = shallowMount(SearchBoxInput, {
      propsData: {
        suggestedValue: {
          item: SuggestionsMockData.items[0],
          override: false,
        },
        options: {
          minInputLength: DEFAULT_SEARCH_BOX_OPTIONS.minInputLength,
          labels: DEFAULT_SEARCH_BOX_OPTIONS.labels,
          links: DEFAULT_SEARCH_BOX_OPTIONS.links,
        },
      },
      localVue,
      store,
    });
  });

  it("suggestion hint should be displayed", async () => {
    const input = wrapper.find(".lupa-search-box-input-field");
    await input.setValue(SuggestionsMockData.items[0].suggestion.slice(0, 2));
    const hintField: HTMLInputElement = wrapper.find(".lupa-hint")
      .element as HTMLInputElement;
    const value = hintField.value;
    expect(value).toMatch(SuggestionsMockData.items[0].suggestion);
  });

  it("input should be displayed", () => {
    const text = "Knyga";
    const input = wrapper.find(".lupa-search-box-input-field");
    input.setValue(text);
    expect((input.element as HTMLInputElement).value).toMatch(text);
  });
});
