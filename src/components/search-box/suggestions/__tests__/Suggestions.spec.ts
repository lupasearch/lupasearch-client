import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import SearchBoxSuggestions from "@/components/search-box/suggestions/SearchBoxSuggestions.vue";
import { DisplaySuggestionsMockData } from "@/constants/mockData..const";
import Vuex from "vuex";
import { mocked } from "ts-jest/utils";
import SearchBox from "@/store/modules/searchBox";
import { DisplaySuggestion } from "@/types/search-box/Common";

jest.mock("@/store/modules/searchBox");

const SearchBoxModuleMock = mocked(SearchBox, true);
const queryKey = "key123";

const getComponent = ({
  suggestions,
  highlight = false,
  highlightedIndex = -1,
}: {
  suggestions: DisplaySuggestion[];
  highlight?: boolean;
  highlightedIndex?: number;
}) => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Vuex.Store({
    modules: {
      searchBox: SearchBoxModuleMock,
    },
  });
  SearchBoxModuleMock.state.suggestionResults[queryKey] = suggestions;
  SearchBoxModuleMock.getters?.highlightedItem.mockReturnValue({
    index: highlightedIndex,
    queryKey,
  });

  return mount(SearchBoxSuggestions, {
    propsData: {
      queryKey,
      items: suggestions,
      highlight,
    },
    localVue,
    store,
  });
};

describe("Suggestions", () => {
  it("suggestions should be displayed without highlight", () => {
    const input = "kny";
    const mockData = DisplaySuggestionsMockData(input);
    const wrapper = getComponent({ suggestions: mockData });

    const suggestions = getSuggestions(wrapper);

    mockData.forEach((data, index) => {
      const suggestion = suggestions.at(index);
      expect(suggestion.text()).toBe(data.suggestion.suggestion);
    });
  });

  it("suggestions should be displayed with highlight", () => {
    const input = "kny";
    const mockData = DisplaySuggestionsMockData(input);
    const wrapper = getComponent({ suggestions: mockData, highlight: true });

    const suggestions = getSuggestions(wrapper);

    mockData.forEach((data, index) => {
      const suggestion = suggestions.at(index);
      expect(suggestion.html()).toContain(data.displayHighlight);
      expect(suggestion.find("strong").text()).toBe(input);
    });
  });

  it("highlight class should not be added when suggestion is not highlighted", async () => {
    const input = "kny";
    const mockData = DisplaySuggestionsMockData(input);
    const wrapper = getComponent({ suggestions: mockData });
    expect(wrapper.find(".lupa-suggestion-highlighted").exists()).toBe(false);
  });

  it("highlight class should be added when suggestion is highlighted", async () => {
    const input = "kny";
    const mockData = DisplaySuggestionsMockData(input);
    const wrapper = getComponent({
      suggestions: mockData,
      highlightedIndex: 2,
    });
    expect(wrapper.find(".lupa-suggestion-highlighted").exists()).toBe(true);
    expect(wrapper.find(".lupa-suggestion-highlighted").text()).toBe(
      "knygų akcija"
    );
  });

  const getSuggestions = (wrapper: Wrapper<SearchBoxSuggestions, Element>) => {
    return wrapper.findAll("div").filter((x) => x.classes("lupa-suggestion"));
  };
});
