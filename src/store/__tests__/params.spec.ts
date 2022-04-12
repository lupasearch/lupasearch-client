/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLocalVue } from "@vue/test-utils";
import { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import ParamsModule from "../modules/params";
import { RootState } from "../types/State";

const setLocation = (locationString: string) => {
  const location = new URL(locationString) as any;
  location.assign = jest.fn();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete window.location;
  window.location = location;
};

describe("paramsModule", () => {
  let localVue: VueConstructor<Vue>;
  let store: Store<RootState>;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store({});
    store.registerModule("params", ParamsModule);
    store.dispatch("params/setSearchResultsLink", "/page-link");
    setLocation("https://www.example.com/page-link?l=20");
    jest.spyOn(window.history, "pushState");
  });

  it("should not change url if params do not exist", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await store.dispatch("params/appendParams", { params: [] }, { root: true });
    expect(window.history.pushState).not.toHaveBeenCalled();
  });

  it("should update only the supplied params", async () => {
    await store.dispatch(
      "params/appendParams",
      {
        params: [
          { name: "q", value: "abcd" },
          { name: "p", value: "2" },
        ],
      },
      { root: true }
    );
    expect(window.history.pushState).toHaveBeenCalledWith(
      "",
      "Append params",
      "/page-link?l=20&q=abcd&p=2"
    );
    expect(store.getters["params/page"]).toBe(2);
    expect(store.getters["params/query"]).toBe("abcd");
  });

  it("should append facet params", async () => {
    setLocation("https://www.example.com/page-link");

    await store.dispatch(
      "params/appendParams",
      {
        params: [
          { name: "f.facet1", value: "book" },
          { name: "f.facet2", value: "hammer" },
        ],
      },
      { root: true }
    );

    expect(window.history.pushState).toHaveBeenCalledWith(
      "",
      "Append params",
      "/page-link?f.facet1=book&f.facet2=hammer"
    );
  });

  it("should replace existing ones with new facets", async () => {
    setLocation("https://www.example.com/page-link?f.facet1=book");
    await store.dispatch(
      "params/appendParams",
      {
        params: [
          { name: "f.facet1", value: "page" },
          { name: "f.facet2", value: "hammer" },
        ],
      },
      { root: true }
    );
    expect(window.history.pushState).toHaveBeenCalledWith(
      "",
      "Append params",
      "/page-link?f.facet1=page&f.facet2=hammer"
    );
  });

  it("should replace all facets", async () => {
    setLocation(
      "https://www.example.com/page-link?f.facet1=book&f.facet2=hammer"
    );
    await store.dispatch(
      "params/appendParams",
      {
        params: [
          { name: "f.facet1", value: "page" },
          { name: "f.facet2", value: "hammer" },
        ],
      },
      { root: true }
    );
    expect(window.history.pushState).toHaveBeenCalledWith(
      "",
      "Append params",
      "/page-link?f.facet1=book&f.facet2=hammer"
    );
  });

  it("should remove all facet params", async () => {
    setLocation(
      "https://www.example.com/page-link?f.facet1=book&l=20&someOther=14&f.facet2=hammer&fr.price=1-2"
    );
    await store.dispatch("params/removeAllFilters", {}, { root: true });
    expect(window.history.pushState).toHaveBeenLastCalledWith(
      "",
      "Append params",
      "/page-link?l=20&someOther=14"
    );
  });

  it("should remove all given facet params", async () => {
    setLocation(
      "https://www.example.com/page-link?f.facet1=book&l=20&someOther=14&f.facet2=hammer&fr.price=1-2"
    );
    await store.dispatch(
      "params/removeParams",
      { paramsToRemove: ["l", "someOther", "fr.price"] },
      { root: true }
    );
    expect(window.history.pushState).toHaveBeenLastCalledWith(
      "",
      "Append params",
      "/page-link?f.facet1=book&f.facet2=hammer"
    );
  });
});
