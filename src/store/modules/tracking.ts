import { AnalyticsEventType } from "@/types/AnalyticsOptions";
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
  }: {
    queryKey: string;
    query: PublicQuery;
  }): void {
    const options: Options =
      this.context.rootGetters["options/envOptions"] ?? {};
    const hasFilters = Object.keys(query.filters ?? {}).length > 0;
    if (hasFilters) {
      const data = getSearchTrackingData(query.searchText, "filters");
      track(queryKey, data, options);
    }
    const data = getSearchTrackingData(query.searchText, "search");
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
      const data = getSearchTrackingData(results.searchText, "zero_results");
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
    track(queryKey, data, options);
  }
}
