export const PARENT_EVENT_NAME = "GetLupa";

export type AnalyticsEventType =
  | "search_query"
  | "search_form_submit"
  | "autocomplete_suggestion_click"
  | "autocomplete_product_click"
  | "search_product_click"
  | "search_zero_results"
  | "search_filters"
  | "search_add_to_cart"
  | "view_item_list"
  | "select_item";

export type AnalyticsOptions = {
  type: "ua" | "ga4" | "debug";
  enabled: boolean;
  parentEventName: string;
  ignoreEvents?: AnalyticsEventType[];
};
