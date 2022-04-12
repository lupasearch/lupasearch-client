/* eslint-disable @typescript-eslint/no-explicit-any */
import { shallowMount, Wrapper } from "@vue/test-utils";
import SearchBoxMainPanel from "@/components/search-box/SearchBoxMainPanel.vue";
import SearchBoxProductsWrapper from "@/components/search-box/products/SearchBoxProductsWrapper.vue";
import SearchBoxSuggestionsWrapper from "@/components/search-box/suggestions/SearchBoxSuggestionsWrapper.vue";
import { DEFAULT_SEARCH_BOX_OPTIONS } from "@/constants/searchBox.const";
import { pick } from "@/utils/picker.utils";
import {
  SearchBoxPanel,
  SearchBoxPanelType,
} from "@/types/search-box/SearchBoxPanel";

describe("SearchBoxMainPanel", () => {
  let mainPanel: Wrapper<SearchBoxMainPanel, Element>;
  let mainPanelVm: any;

  const getInput = () => {
    let input = "";
    for (let i = 0; i < mainPanelVm.options.minInputLength; i++) input += "a";
    return input;
  };

  beforeEach(() => {
    mainPanel = mountMainPanel();
    mainPanelVm = mainPanel.vm as any;
  });

  it("main panel should not be rendered", () => {
    const panelDiv = mainPanel
      .findAll("div")
      .filter((x) => x.classes("lupa-search-box-panel"));
    expect(panelDiv.exists()).toBe(false);
  });

  it("main panel should render when input.length >= minInputLength", async () => {
    mainPanel = mountMainPanel(getInput());
    const panelDiv = mainPanel.find("#lupa-search-box-panel");
    expect(panelDiv.exists()).toBe(true);
  });

  it("main panel should display child panels from options", async () => {
    mainPanel = mountMainPanel(getInput());
    for (const panel of mainPanel.props().options.panels as SearchBoxPanel[]) {
      switch (panel.type) {
        case SearchBoxPanelType.SUGGESTION:
          expect(
            mainPanel.findComponent(SearchBoxSuggestionsWrapper).exists()
          ).toBeTruthy();
          break;
        case SearchBoxPanelType.DOCUMENT:
          expect(
            mainPanel.findComponent(SearchBoxProductsWrapper).exists()
          ).toBeTruthy();
          break;
        default:
          break;
      }
    }
  });

  const mountMainPanel = (inputValue = "") => {
    return shallowMount(SearchBoxMainPanel, {
      propsData: {
        options: {
          ...pick(DEFAULT_SEARCH_BOX_OPTIONS, [
            "minInputLength",
            "panels",
            "history",
            "labels",
            "links",
            "options",
          ]),
          panels: [
            {
              type: "suggestion",
              queryKey: "suggestionKey",
              highlight: true,
              limit: 5,
            },
            {
              type: "document",
              queryKey: "docKey",
              limit: 5,
              searchBySuggestion: false,
              links: {
                details: "{url}",
              },
              titleKey: "name",
              elements: [],
            },
          ],
        },
        inputValue,
      },
    });
  };
});
