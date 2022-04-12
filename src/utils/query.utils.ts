import { QUERY_PARAMS_PARSED } from "@/constants/queryParams.const";
import { DEFAULT_OPTIONS_RESULTS } from "@/constants/searchResults.const";
import { QueryParams } from "@/types/search-results/QueryParams";
import { SearchResultsSortOptions } from "@/types/search-results/SearchResultsSort";
import { PublicQuery } from "@getlupa/client-sdk/Types";

export const createPublicQuery = (
  queryParams: QueryParams,
  sortOptions?: SearchResultsSortOptions[] // will be removed when vuex is implemented
): PublicQuery => {
  const publicQuery: PublicQuery = {} as PublicQuery;

  for (const param in queryParams) {
    const value = queryParams[param];
    if (!value) {
      continue;
    }
    switch (param) {
      case QUERY_PARAMS_PARSED.QUERY:
        publicQuery.searchText = Array.isArray(value) ? value[0] : value;
        break;
      case QUERY_PARAMS_PARSED.LIMIT:
        publicQuery.limit = Number(value);
        break;
      case QUERY_PARAMS_PARSED.PAGE:
        publicQuery.offset = getOffset(
          Number(value),
          Number(queryParams[QUERY_PARAMS_PARSED.LIMIT]) ||
            DEFAULT_OPTIONS_RESULTS.pagination.sizeSelection.sizes[0]
        );
        break;
      case QUERY_PARAMS_PARSED.SORT: {
        const config = sortOptions?.find(
          (x) => x.key === queryParams[QUERY_PARAMS_PARSED.SORT]
        )?.config;
        if (config) {
          publicQuery.sort = config;
        }
        break;
      }
      default:
        break;
    }
  }
  publicQuery.filters = queryParams.filters;
  return publicQuery;
};

const getOffset = (page: number, limit = 10): number => {
  if (!page || page === 1 || page < 0) return 0;
  return (page - 1) * limit;
};
