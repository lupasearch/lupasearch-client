import {
  Document,
  Suggestion,
  ReportableEventType,
} from "@getlupa/client-sdk/Types";
import { AnalyticsEventType } from "../AnalyticsOptions";
import { SearchBoxPanelType } from "./SearchBoxPanel";

export type FetchedData = {
  items: Document[] | Suggestion[];
  type: SearchBoxPanelType;
};

export type InputSuggestion = {
  item: Suggestion;
  queryKey: string;
  override: boolean;
  facet?: InputSuggestionFacet;
};

export type InputSuggestionFacet = {
  label?: string;
  count?: number;
  key: string;
  title: string;
};

export type DisplaySuggestion = {
  suggestion: Suggestion;
  display: string;
  displayHighlight: string;
  facet?: InputSuggestionFacet;
};

export type SelectedData = {
  item: Document | InputSuggestion;
  type: SearchBoxPanelType;
};

export type TrackableEventData = {
  type?: ReportableEventType;
  searchQuery?: string;
  itemId?: string;
  analytics?: {
    type: AnalyticsEventType;
    label: string;
    listLabel?: string;
    items?: Record<string, unknown>[];
    itemId?: string;
  };
  options?: {
    allowEmptySearchQuery: boolean;
  };
};

export type HighlightedDocInfo = {
  doc?: Document;
  link?: string;
  queryKey?: string;
  id?: unknown;
  title?: string;
};
