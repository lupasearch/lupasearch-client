import Vuex, { Store } from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import SearchBoxHistoryPanel from "../SearchBoxHistoryPanel.vue";
import { mocked } from "ts-jest/utils";
import HistoryModule from "@/store/modules/history";
import { RootState } from "@/store/types/State";
import SearchBoxModule from "@/store/modules/searchBox";

jest.mock("@/store/modules/history");
jest.mock("@/store/modules/searchBox");

const SearchBoxModuleMock = mocked(SearchBoxModule, true);
const HistoryModuleMock = mocked(HistoryModule, true);

const localVue = createLocalVue();

localVue.use(Vuex);

describe("searchBoxHistoryPanel", () => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        history: HistoryModuleMock,
        searchBox: SearchBoxModuleMock,
      },
    });
  });

  it("should render no history panel if there is no history", () => {
    const wrapper = mount(SearchBoxHistoryPanel, {
      propsData: {
        options: { labels: { clear: "Clear" } },
      },
      store,
      localVue,
    });
    expect(wrapper.find(".lupa-search-box-history-panel").exists()).toBe(false);
  });

  it("should render remove all button if there is at least one history item", async () => {
    HistoryModuleMock.state.items = ["one"];
    const wrapper = mount(SearchBoxHistoryPanel, {
      propsData: {
        options: { labels: { clear: "Clear" } },
      },
      store,
      localVue,
    });
    const clearAll = wrapper.find(".lupa-search-box-history-clear-all");
    expect(clearAll.exists()).toBe(true);
    expect(clearAll.text()).toBe("Clear");
  });

  it("should render all history items", async () => {
    HistoryModuleMock.state.items = ["one", "two", "three"];
    const wrapper = mount(SearchBoxHistoryPanel, {
      propsData: {
        options: { labels: { clear: "Clear" } },
      },
      store,
      localVue,
    });
    const elements = wrapper.findAll(".lupa-search-box-history-item");
    expect(elements.length).toBe(3);
    for (let i = 0; i < elements.wrappers.length; i++) {
      expect(
        elements.wrappers[i].find(".lupa-search-box-history-item-text").text()
      ).toBe(HistoryModuleMock.state.items[i]);
    }
  });

  it("should remove all items on clear all click", async () => {
    HistoryModuleMock.state.items = ["one", "two", "three"];
    const wrapper = mount(SearchBoxHistoryPanel, {
      propsData: {
        options: { labels: { clear: "Clear" } },
      },
      store,
      localVue,
    });
    await wrapper.find(".lupa-search-box-history-clear-all").trigger("click");
    expect(HistoryModuleMock.actions?.clear).toHaveBeenCalled();
  });

  it("should remove specific item on click", async () => {
    HistoryModuleMock.state.items = ["one", "two", "three"];
    const wrapper = mount(SearchBoxHistoryPanel, {
      propsData: {
        options: { labels: { clear: "Clear" } },
      },
      store,
      localVue,
    });
    await wrapper
      .findAll(".lupa-search-box-history-item-clear")
      .wrappers[1].trigger("click");
    expect(HistoryModuleMock.actions?.remove).toHaveBeenCalledWith(
      expect.anything(),
      {
        item: "two",
      }
    );
  });
});
