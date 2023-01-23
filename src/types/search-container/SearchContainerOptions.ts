import { SearchBoxOptions } from "../search-box/SearchBoxOptions";
import { SearchResultsOptions } from "../search-results/SearchResultsOptions";

export type SearchContainerOptions = {
  trigger: string;
  styleLink?: string;
  searchBox: SearchBoxOptions;
  searchResults: SearchResultsOptions;
};
