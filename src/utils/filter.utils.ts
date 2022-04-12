import { CURRENCY_KEY_INDICATOR } from "@/constants/global.const";
import { FACET_PARAMS_TYPE } from "@/constants/queryParams.const";
import { LabeledFilter, UnfoldedFilter } from "@/types/search-results/Filters";
import {
  FacetResult,
  FilterGroup,
  FilterGroupItem,
  FilterGroupItemTypeHierarchy,
  FilterGroupItemTypeRange,
  FilterGroupItemTypeTerms,
  HierarchyTree,
} from "@getlupa/client-sdk/Types";
import { formatPriceSummary } from "./price.utils";
import { capitalize, getNormalizedString } from "./string.utils";

export const formatRange = (filter: FilterGroupItemTypeRange): string => {
  const lt = filter.lt ?? filter.lte;
  const gt = filter.gt ?? filter.gte;
  if (gt !== undefined && lt !== undefined) {
    return `${gt} - ${lt}`;
  }
  if (lt !== undefined) {
    return `<${filter.lte !== undefined ? "=" : ""} ${lt}`;
  }
  return `>${filter.gte !== undefined ? "=" : ""} ${gt}`;
};

const unfoldTermFilter = (
  key: string,
  filter: FilterGroupItemTypeTerms
): UnfoldedFilter[] => {
  const seed: UnfoldedFilter[] = [];
  return filter.reduce(
    (a, c) => [...a, { key, value: c, type: "terms" }],
    seed
  );
};

const unfoldHierarchyFilter = (
  key: string,
  filter: FilterGroupItemTypeHierarchy
): UnfoldedFilter[] => {
  const seed: UnfoldedFilter[] = [];
  return filter.terms.reduce(
    (a, c) => [...a, { key, value: c, type: "hierarchy" }],
    seed
  );
};

const unfoldRangeFilter = (
  key: string,
  filter: FilterGroupItemTypeRange
): UnfoldedFilter[] => {
  if (key.includes(CURRENCY_KEY_INDICATOR)) {
    return [
      {
        key,
        value: formatPriceSummary([
          filter.gte || filter.gt,
          filter.lte || filter.lt,
        ]),
        type: "range",
      },
    ];
  }
  return [{ key, value: `${filter.gte} - ${filter.lte}`, type: "range" }];
};

const unfoldFilter = (
  key: string,
  filter: FilterGroupItem
): UnfoldedFilter[] => {
  if (Array.isArray(filter)) {
    return unfoldTermFilter(key, filter);
  }
  if ((filter as FilterGroupItemTypeRange).gte) {
    return unfoldRangeFilter(key, filter as FilterGroupItemTypeRange);
  }
  if ((filter as FilterGroupItemTypeHierarchy).terms) {
    return unfoldHierarchyFilter(key, filter as FilterGroupItemTypeHierarchy);
  }
  return [];
};

export const unfoldFilters = (filters?: FilterGroup): UnfoldedFilter[] => {
  if (!filters) {
    return [];
  }
  const seed: UnfoldedFilter[] = [];
  return Object.entries(filters).reduce(
    (a, c) => [...a, ...unfoldFilter(...c)],
    seed
  );
};

export const getLabeledFilters = (
  filters: UnfoldedFilter[],
  facets?: FacetResult[]
): LabeledFilter[] => {
  return filters.map((f) => ({
    ...f,
    label: facets?.find((ft) => ft.key === f.key)?.label ?? capitalize(f.key),
  }));
};

export const isFacetKey = (key: string): boolean =>
  key.startsWith(FACET_PARAMS_TYPE.RANGE) ||
  key.startsWith(FACET_PARAMS_TYPE.TERMS) ||
  key.startsWith(FACET_PARAMS_TYPE.HIERARCHY);

export const isArrayKey = (key: string): boolean =>
  key.startsWith(FACET_PARAMS_TYPE.TERMS) ||
  key.startsWith(FACET_PARAMS_TYPE.HIERARCHY);

export const getMostSpecificHierarchyTerms = (terms: string[]): string[] => {
  const specificTerms: string[] = [];
  for (const term of terms) {
    if (!terms.some((t) => t.startsWith(term) && t !== term)) {
      specificTerms.push(term);
    }
  }
  return Array.from(new Set(specificTerms));
};

export const recursiveFilter = (
  items: HierarchyTree[],
  query = ""
): HierarchyTree[] => {
  if (!query) {
    return items;
  }
  return items
    .map((i) => recursiveFilterItem(i, query))
    .filter(Boolean) as HierarchyTree[];
};

export const recursiveFilterItem = (
  item: HierarchyTree,
  query = ""
): HierarchyTree | undefined => {
  const filterable = getNormalizedString(item.title).includes(
    getNormalizedString(query)
  )
    ? item
    : undefined;
  if (!item.children) {
    return filterable;
  }
  const children = recursiveFilter(item.children, query).filter(Boolean);
  const include = children.length > 0 || filterable;
  return include
    ? {
        ...item,
        children,
      }
    : undefined;
};
