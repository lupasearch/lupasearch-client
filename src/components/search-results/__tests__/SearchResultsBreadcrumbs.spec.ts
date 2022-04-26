import SearchResultModule from "@/store/modules/searchResult";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import Vuex from "vuex";
import SearchResultsBreadcrumbs from "../SearchResultsBreadcrumbs.vue";

jest.mock("@/store/modules/searchResult");

const SearchResultModuleMock = mocked(SearchResultModule, true);

const localVue = createLocalVue();

localVue.use(Vuex);

describe("SearchResultsBreadcrumbs", () => {
  let wrapper: Wrapper<SearchResultsBreadcrumbs, Element>;

  beforeEach(() => {
    const store = new Vuex.Store({
      modules: {
        searchResult: SearchResultModuleMock,
      },
    });

    wrapper = mount(SearchResultsBreadcrumbs, {
      propsData: {
        breadcrumbs: [
          { label: "Titulinis", link: "/" },
          { label: "Ieškoti rezultatų: {1}" },
        ],
      },
      store,
      localVue,
    });
  });

  it("should display correct breadcrumbs", () => {
    const link = wrapper.find(".lupa-search-results-breadcrumb-link");
    expect(link.text()).toEqual("Titulinis");
    expect(link.attributes().href).toBe("/");

    expect(wrapper.find(".lupa-search-results-breadcrumb-text").text()).toEqual(
      "Ieškoti rezultatų: 'undefined'"
    );
  });
});
