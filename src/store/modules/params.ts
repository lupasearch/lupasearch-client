import { DEFAULT_PAGE_SIZE } from "@/constants/global.const";
import {
  QUERY_PARAMS,
  QUERY_PARAMS_PARSED,
} from "@/constants/queryParams.const";
import { InputSuggestionFacet } from "@/types/search-box/Common";
import { QueryParams } from "@/types/search-results/QueryParams";
import { getFacetParam } from "@/utils/filter.toggle.utils";
import { generateResultLink, getPathName } from "@/utils/link.utils";
import {
  appendParam,
  getRemovableParams,
  parseParams,
  removeParams,
} from "@/utils/params.utils";
import { FilterGroup } from "@getlupa/client-sdk/Types";
import {
  Action,
  config,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import { isFacetKey } from "../../utils/filter.utils";

// Set rawError to true by default on all @Action decorators
config.rawError = true;

@Module({ namespaced: true })
export default class ParamsModule extends VuexModule {
  params: QueryParams = {};
  defaultLimit = DEFAULT_PAGE_SIZE;
  searchResultsLink = "";
  searchString = "";

  get query(): string {
    return this.params[QUERY_PARAMS_PARSED.QUERY] as string;
  }

  get page(): number {
    const page = Number(this.params[QUERY_PARAMS_PARSED.PAGE]) || 1;
    return page <= 0 ? 1 : page;
  }

  get limit(): number {
    return Number(this.params[QUERY_PARAMS_PARSED.LIMIT]) || this.defaultLimit;
  }

  get sort(): string | string[] {
    return this.params[QUERY_PARAMS_PARSED.SORT] as string;
  }

  get filters(): FilterGroup {
    return this.params.filters ?? {};
  }

  @Mutation
  save({
    params,
    defaultLimit,
    searchResultsLink,
    searchString,
  }: {
    params?: QueryParams;
    defaultLimit?: number;
    searchResultsLink?: string;
    searchString?: string;
  }): void {
    this.params = params || this.params;
    this.defaultLimit = defaultLimit || this.defaultLimit;
    this.searchResultsLink = searchResultsLink || this.searchResultsLink;
    this.searchString = searchString || this.searchString;
  }

  @Action({ commit: "save" })
  add(params: QueryParams): { params: QueryParams } {
    if (!params) {
      return { params: this.params };
    }
    return { params };
  }

  @Action({ commit: "save" })
  removeAllFilters(): { params: QueryParams; searchString: string } {
    const url = new URL(
      window.location.origin +
        getPathName(this.searchResultsLink) +
        window.location.search
    );
    const paramsToRemove = Array.from(url.searchParams.keys()).filter(
      isFacetKey
    );
    removeParams(url, paramsToRemove);
    window.history.pushState("", "Append params", url.pathname + url.search);
    return { params: parseParams(url.searchParams), searchString: url.search };
  }

  @Action({ commit: "save" })
  removeParams({
    paramsToRemove,
    save = true,
  }: {
    paramsToRemove?: "all" | string[];
    save: boolean;
  }): {
    params?: QueryParams;
    searchString?: string;
  } {
    const url = new URL(
      window.location.origin +
        getPathName(this.searchResultsLink) +
        window.location.search
    );
    paramsToRemove = getRemovableParams(url, paramsToRemove);
    removeParams(url, paramsToRemove);
    window.history.pushState("", "Append params", url.pathname + url.search);
    return save
      ? {
          params: parseParams(url.searchParams),
          searchString: url.search,
        }
      : {};
  }

  @Action({})
  goToResults({
    searchText,
    facet,
  }: {
    searchText: string;
    facet?: InputSuggestionFacet;
  }): void {
    if (
      !this.searchResultsLink ||
      this.searchResultsLink === window.location.pathname
    ) {
      const facetParam = facet ? [getFacetParam(facet.key, [facet.title])] : [];
      this.context.dispatch("appendParams", {
        params: [
          { name: QUERY_PARAMS.QUERY, value: searchText },
          ...facetParam,
        ],
        paramsToRemove: "all",
      });
    } else {
      window.location.assign(
        generateResultLink(this.searchResultsLink, searchText, facet)
      );
    }
    this.context.dispatch(
      "tracking/track",
      {
        data: {
          analytics: { type: "search_form_submit", label: searchText },
        },
      },
      { root: true }
    );
  }

  @Action({ commit: "save" })
  appendParams({
    params,
    paramsToRemove,
    encode = true,
    save = true,
  }: {
    params: { name: string; value: string }[];
    paramsToRemove?: "all" | string[];
    encode?: boolean;
    save?: boolean;
  }): { params?: QueryParams; searchString?: string } {
    if (!params?.length) {
      return { params: this.params };
    }
    const url = new URL(
      window.location.origin +
        getPathName(this.searchResultsLink) +
        window.location.search
    );

    paramsToRemove = getRemovableParams(url, paramsToRemove);
    removeParams(url, paramsToRemove);
    params.forEach((p) => appendParam(url, p, encode));
    window.history.pushState("", "Append params", url.pathname + url.search);
    return save
      ? {
          params: parseParams(url.searchParams),
          searchString: url.search,
        }
      : {};
  }

  @Action({ commit: "save" })
  setDefaultLimit(defaultLimit: number): { defaultLimit: number } {
    if (!defaultLimit) {
      return { defaultLimit: this.defaultLimit };
    }
    return { defaultLimit };
  }

  @Action({ commit: "save" })
  setSearchResultsLink(searchResultsLink: string): {
    searchResultsLink: string;
  } {
    if (!searchResultsLink) {
      return { searchResultsLink: this.searchResultsLink };
    }
    return { searchResultsLink };
  }
}
