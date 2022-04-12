import {
  SearchBoxPanel,
  SearchBoxPanelType,
} from "@/types/search-box/SearchBoxPanel";
import { generateLink } from "@/utils/link.utils";
import { SearchQueryResult, Suggestion } from "@getlupa/client-sdk/Types";
import { createLocalVue } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import SearchBoxModule from "../modules/searchBox";
import { RootState, SearchBoxState } from "../types/State";

jest.mock("@/utils/link.utils");

const generateLinkMock = mocked(generateLink);

const testPanels = [
  { type: SearchBoxPanelType.DOCUMENT, queryKey: "1", limit: 4 },
  { type: SearchBoxPanelType.DOCUMENT, queryKey: "2", limit: 4 },
  { type: SearchBoxPanelType.SUGGESTION, queryKey: "1s", limit: 4 },
  { type: SearchBoxPanelType.DOCUMENT, queryKey: "3", limit: 4 },
] as SearchBoxPanel[];

const docResults: Record<string, SearchQueryResult> = {
  "1": {
    items: [{ k: "1" }, { k: "2" }],
    searchText: "a",
    total: 10,
    success: true,
  },
  "2": { items: [{ k: "1" }], searchText: "a", total: 10, success: true },
  "3": {
    items: [{ k: "1ss" }, { k: "2" }, { k: "3" }],
    searchText: "a",
    total: 10,
    success: true,
  },
};

const suggestionResults: Record<string, Suggestion[]> = {
  "1s": [{ suggestion: "1" }],
};

describe("historyModule", () => {
  let localVue: VueConstructor<Vue>;
  let store: Store<RootState>;
  let state: SearchBoxState;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store({});
    store.registerModule("searchBox", SearchBoxModule);
    state = store.state.searchBox;
  });

  it("should have initial state", () => {
    expect(state.docResults).toEqual({});
    expect(state.suggestionResults).toEqual({});
  });

  describe("resultsVisible", () => {
    it("should return false if input length is less than min length", () => {
      state.inputValue = "a";
      state.options.minInputLength = 2;
      expect(store.getters["searchBox/resultsVisible"]).toBe(false);
    });

    it("should return true if input length is more than min length", () => {
      state.inputValue = "abc";
      state.options.minInputLength = 2;
      expect(store.getters["searchBox/resultsVisible"]).toBe(true);
    });
  });

  describe("totalCount", () => {
    it("should return sum of all doc and suggestion counts", () => {
      state.options.panels = testPanels;
      state.docResults = docResults;
      state.suggestionResults = suggestionResults;
      state.inputValue = "abc";
      state.options.minInputLength = 2;
      expect(store.getters["searchBox/totalCount"]).toBe(7);
    });

    it("should return 0 if there are no items", () => {
      state.options.panels = testPanels;
      state.docResults = {};
      state.suggestionResults = {};
      state.inputValue = "abc";
      state.options.minInputLength = 2;
      expect(store.getters["searchBox/totalCount"]).toBe(0);
    });
  });

  describe("panelItemCounts", () => {
    it("should return an array of item counts in each panel", () => {
      state.options.panels = testPanels;
      state.docResults = docResults;
      state.suggestionResults = suggestionResults;
      state.inputValue = "abc";
      state.options.minInputLength = 2;
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        store.getters["searchBox/panelItemCounts"].map((c: any) => c.count)
      ).toEqual([2, 1, 1, 3]);
    });

    it("should return 0 if there are no items", () => {
      state.options.panels = testPanels;
      state.docResults = {};
      state.suggestionResults = {};
      state.inputValue = "abc";
      state.options.minInputLength = 2;
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        store.getters["searchBox/panelItemCounts"].map((c: any) => c.count)
      ).toEqual([0, 0, 0, 0]);
    });
  });

  describe("highlightedItem", () => {
    it("should return which item should be highlighted based on highlight index", () => {
      state.options.panels = testPanels;
      state.docResults = docResults;
      state.suggestionResults = suggestionResults;

      state.inputValue = "abc";
      state.options.minInputLength = 2;
      state.highlightedIndex = 4;
      expect(store.getters["searchBox/highlightedItem"]).toEqual({
        queryKey: "3",
        index: 0,
        panel: { type: SearchBoxPanelType.DOCUMENT, queryKey: "3", limit: 4 },
      });
    });
  });

  describe("highlightedDocument", () => {
    it("should return which item should be highlighted based on highlight index", () => {
      state.options.panels = testPanels;
      state.docResults = docResults;
      state.suggestionResults = suggestionResults;

      state.inputValue = "abc";
      state.options.minInputLength = 2;
      state.highlightedIndex = 4;
      generateLinkMock.mockReturnValue("generated-link");
      expect(store.getters["searchBox/highlightedDocument"]).toEqual({
        doc: { k: "1ss" },
        link: "generated-link",
        id: "",
        queryKey: "3",
      });
    });

    it("should return undefined if results are not visible", () => {
      state.options.panels = testPanels;
      state.docResults = docResults;
      state.suggestionResults = suggestionResults;
      state.inputValue = "a";
      state.options.minInputLength = 2;
      state.highlightedIndex = 4;
      generateLinkMock.mockReturnValue("generated-link");
      expect(store.getters["searchBox/highlightedDocument"]).toEqual({
        doc: undefined,
      });
    });

    it("should return undefined if selected item is suggestion", () => {
      state.options.panels = testPanels;
      state.docResults = docResults;
      state.suggestionResults = suggestionResults;
      state.inputValue = "abc";
      state.options.minInputLength = 2;
      state.highlightedIndex = 3;
      generateLinkMock.mockReturnValue("generated-link");
      expect(store.getters["searchBox/highlightedDocument"]).toEqual({
        doc: undefined,
      });
    });
  });

  describe("highlightChange", () => {
    it("should return new index of -1 if action is clear", async () => {
      const result = await store.dispatch(
        "searchBox/highlightChange",
        { action: "clear" },
        { root: true }
      );
      expect(result.highlightIndex).toBe(-1);
    });

    it("should return new index of 4 if action is down", async () => {
      state.options.panels = testPanels;
      state.docResults = docResults;
      state.suggestionResults = suggestionResults;
      state.inputValue = "abc";
      state.options.minInputLength = 2;
      state.highlightedIndex = 3;
      const result = await store.dispatch(
        "searchBox/highlightChange",
        { action: "down" },
        { root: true }
      );
      expect(result.highlightIndex).toBe(4);
    });

    it("should return new index of 2 if action is up", async () => {
      state.options.panels = testPanels;
      state.docResults = docResults;
      state.suggestionResults = suggestionResults;
      state.inputValue = "abc";
      state.options.minInputLength = 2;
      state.highlightedIndex = 3;
      const result = await store.dispatch(
        "searchBox/highlightChange",
        { action: "up" },
        { root: true }
      );
      expect(result.highlightIndex).toBe(2);
    });

    it("should loop back if next index would become -1", async () => {
      state.options.panels = testPanels;
      state.docResults = docResults;
      state.suggestionResults = suggestionResults;
      state.inputValue = "abc";
      state.options.minInputLength = 2;
      state.highlightedIndex = 0;
      const result = await store.dispatch(
        "searchBox/highlightChange",
        { action: "up" },
        { root: true }
      );
      expect(result.highlightIndex).toBe(6);
    });

    it("should loop back if next index would be more than number of items", async () => {
      state.options.panels = testPanels;
      state.docResults = docResults;
      state.suggestionResults = suggestionResults;
      state.inputValue = "abc";
      state.options.minInputLength = 2;
      state.highlightedIndex = 6;
      const result = await store.dispatch(
        "searchBox/highlightChange",
        { action: "down" },
        { root: true }
      );
      expect(result.highlightIndex).toBe(0);
    });
  });
});
