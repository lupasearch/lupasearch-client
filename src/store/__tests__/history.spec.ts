import { createLocalVue } from "@vue/test-utils";
import { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import HistoryModule from "../modules/history";
import { HistoryState, RootState } from "../types/State";

describe("historyModule", () => {
  let localVue: VueConstructor<Vue>;
  let store: Store<RootState>;
  let state: HistoryState;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store({});
    store.registerModule("history", HistoryModule);
    state = store.state.history;
  });

  it("should have initial state", () => {
    expect(state.items).toEqual([]);
  });

  describe("add", () => {
    it("should prepend a new item", async () => {
      await store.dispatch("history/add", { item: "new" }, { root: true });
      expect(state.items).toEqual(["new"]);
    });

    it("should prepend a new item to the beginning of array", async () => {
      state.items = ["a", "b"];
      await store.dispatch("history/add", { item: "new" }, { root: true });
      expect(state.items).toEqual(["new", "a", "b"]);
    });

    it("should not add the same item again, but move it to beginning of array", async () => {
      state.items = ["a", "b", "c"];
      await store.dispatch("history/add", { item: "b" }, { root: true });
      expect(state.items).toEqual(["b", "a", "c"]);
    });

    it("should not add an empty item", async () => {
      state.items = ["a", "b", "c"];
      await store.dispatch("history/add", { item: "" }, { root: true });
      expect(state.items).toEqual(["a", "b", "c"]);
    });
  });

  describe("remove", () => {
    it("should remove existing item", async () => {
      state.items = ["a", "b", "c"];
      await store.dispatch("history/remove", { item: "b" }, { root: true });
      expect(state.items).toEqual(["a", "c"]);
    });

    it("should not remove item if it does not exist", async () => {
      state.items = ["a", "b", "c"];
      await store.dispatch("history/remove", { item: "d" }, { root: true });
      expect(state.items).toEqual(["a", "b", "c"]);
    });
  });

  describe("clear", () => {
    it("should clear history", async () => {
      state.items = ["a", "b", "c"];
      await store.dispatch("history/clear", {}, { root: true });
      expect(state.items).toEqual([]);
    });
  });
});
