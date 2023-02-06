import { SearchBoxOptions } from "../search-box/SearchBoxOptions";
import { SearchResultsOptions } from "../search-results/SearchResultsOptions";

export type SearchContainerConfigOptions = {
  isOpenInitially?: boolean;
  styleLink?: string;
  layout?: {
    marginLeft?: number;
  };
};

export type SearchContainerOptions = {
  trigger: string;
  searchBox: SearchBoxOptions;
  searchResults: SearchResultsOptions;
  options?: SearchContainerConfigOptions;
};
