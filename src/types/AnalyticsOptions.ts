export const PARENT_EVENT_NAME = "GetLupa";

export type AnalyticsEventType =
  | "search"
  | "search_form_submit"
  | "autocomplete_keyword_click"
  | "autocomplete_product_click"
  | "zero_results"
  | "filters"
  | "add_to_cart";

export type AnalyticsOptions = {
  type: "ua";
  enabled: boolean;
  parentEventName: string;
};
