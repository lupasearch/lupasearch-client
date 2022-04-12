import { SearchBoxOptions } from "@/types/search-box/SearchBoxOptions";
import { QueryParams } from "@/types/search-results/QueryParams";
import { SearchBoxPanelOptions } from "@/types/search-box/SearchBoxOptions";
import { SearchQueryResult, Suggestion } from "@getlupa/client-sdk/Types";
import { SearchResultsOptions } from "@/types/search-results/SearchResultsOptions";
import { ResultsLayout } from "@/types/search-results/ResultsLayout";

export type HistoryState = {
  items: string[];
};

export type SearchResultState = {
  searchResult: SearchQueryResult;
  columnCount: number;
  addToCartAmount: number;
  layout: ResultsLayout;
  loading: boolean;
};

export type ParamsState = {
  params: QueryParams;
  defaultLimit: number;
};

export type SearchBoxState = {
  docResults: Record<string, SearchQueryResult>;
  suggestionResults: Record<string, Suggestion[]>;
  options: SearchBoxPanelOptions;
  highlightedIndex: number;
  inputValue: string;
};

export type OptionsState = {
  searchBoxOptions: SearchBoxOptions;
  searchResultOptions: SearchResultsOptions;
};

export type RootState = {
  history: HistoryState;
  searchResult: SearchResultState;
  params: ParamsState;
  searchBox: SearchBoxState;
  options: OptionsState;
};
