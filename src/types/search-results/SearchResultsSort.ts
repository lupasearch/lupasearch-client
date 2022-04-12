import { SortDirection } from "@getlupa/client-sdk/Types";

export type SearchResultsSortOptions = {
  key: string;
  label: string;
  config: Record<string, SortDirection>[];
  default?: boolean;
};

export type SortOptions = {
  label: string;
  options: SearchResultsSortOptions[];
};
