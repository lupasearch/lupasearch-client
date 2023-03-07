import { AnalyticsEventType } from "@/types/AnalyticsOptions";
import { TrackingOptions } from "@/types/General";
import { TrackableEventData } from "@/types/search-box/Common";
import { track } from "@/utils/tracking.utils";
import {
  Options,
  PublicQuery,
  SearchQueryResult,
} from "@getlupa/client-sdk/Types";
import { config, Module, Action, VuexModule } from "vuex-module-decorators";

// Set rawError to true by default on all @Action decorators
config.rawError = true;

const getSearchTrackingData = (
  searchText: string,
  type: AnalyticsEventType
): TrackableEventData => {
  return {
    searchQuery: searchText,
    analytics: {
      type: type,
      label: searchText,
    },
  };
};

@Module({ namespaced: true })
export default class TrackingModule extends VuexModule {
  @Action
  trackSearch({
    queryKey,
    query,
    type = "search_query",
  }: {
    queryKey: string;
    query: PublicQuery;
    type?: AnalyticsEventType;
  }): void {
    const options: Options =
      this.context.rootGetters["options/envOptions"] ?? {};
    const hasFilters = Object.keys(query.filters ?? {}).length > 0;
    if (hasFilters) {
      const data = getSearchTrackingData(query.searchText, "search_filters");
      track(queryKey, data, options);
      return;
    }
    const data = getSearchTrackingData(query.searchText, type);
    track(queryKey, data, options);
  }

  @Action
  trackResults({
    queryKey,
    results,
  }: {
    queryKey: string;
    results: SearchQueryResult;
  }): void {
    const options: Options =
      this.context.rootGetters["options/envOptions"] ?? {};
    if (results.total < 1) {
      const data = getSearchTrackingData(
        results.searchText,
        "search_zero_results"
      );
      track(queryKey, data, options);
    }
  }

  @Action
  track({
    queryKey,
    data,
  }: {
    queryKey: string;
    data: TrackableEventData;
  }): void {
    const options: Options =
      this.context.rootGetters["options/envOptions"] ?? {};
    const trackingOptions: TrackingOptions =
      this.context.rootState["options"].trackingOptions ?? {};
    const items = data.analytics?.items ?? [];
    const mappedItems = trackingOptions.analytics?.itemMap
      ? items.map(trackingOptions.analytics.itemMap)
      : items;
    track(
      queryKey,
      {
        ...data,
        analytics: data.analytics
          ? { ...data.analytics, items: mappedItems }
          : undefined,
      },
      options
    );
  }
}
