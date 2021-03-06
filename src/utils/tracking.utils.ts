import {
  TRACKING_ANALYTICS_KEY,
  TRACKING_KEY_LENGTH,
  TRACKING_STORAGE_KEY,
  TRACKING_STORAGE_KEY_BASE,
} from "@/constants/global.const";
import { AnalyticsOptions } from "@/types/AnalyticsOptions";
import { TrackingOptions } from "@/types/General";
import { TrackableEventData } from "@/types/search-box/Common";
import lupaSearchSdk from "@getlupa/client-sdk";
import { EventData, Options } from "@getlupa/client-sdk/Types";
import { getRandomString } from "./string.utils";

const initAnalyticsTracking = (analyticsOptions?: AnalyticsOptions) => {
  try {
    if (analyticsOptions?.enabled && analyticsOptions.type === "ua") {
      window.sessionStorage.setItem(
        TRACKING_ANALYTICS_KEY,
        JSON.stringify(analyticsOptions)
      );
    } else {
      window.sessionStorage.removeItem(TRACKING_ANALYTICS_KEY);
    }
  } catch {
    // Do nothing
  }
};

const initBaseTracking = (enabled: boolean) => {
  try {
    if (enabled) {
      window.sessionStorage.setItem(TRACKING_STORAGE_KEY_BASE, "1");
    } else {
      window.sessionStorage.removeItem(TRACKING_STORAGE_KEY_BASE);
      clearSessionTracking();
      clearUserTracking();
    }
  } catch {
    // Do nothing
  }
};

const clearSessionTracking = () => {
  try {
    window.sessionStorage.removeItem(TRACKING_STORAGE_KEY);
  } catch {
    // Do nothing
  }
};

const initSessionTracking = () => {
  try {
    if (getSessionKey()) {
      return;
    }
    const key = getRandomString(TRACKING_KEY_LENGTH);
    window.sessionStorage.setItem(TRACKING_STORAGE_KEY, key);
  } catch {
    // Do nothing
  }
};

const initUserTracking = (userKey?: string) => {
  try {
    if (getUserKey()) {
      return;
    }
    const key = userKey || getRandomString(TRACKING_KEY_LENGTH);
    window.localStorage.setItem(TRACKING_STORAGE_KEY, key);
  } catch {
    // Do nothing
  }
};

const clearUserTracking = () => {
  try {
    window.localStorage.removeItem(TRACKING_STORAGE_KEY);
  } catch {
    // Do nothing
  }
};

const isTrackingEnabled = (): boolean => {
  try {
    return Boolean(window.sessionStorage.getItem(TRACKING_STORAGE_KEY_BASE));
  } catch {
    return false;
  }
};

const getSessionKey = (): string | undefined => {
  try {
    return window.sessionStorage.getItem(TRACKING_STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

const getUserKey = (): string | undefined => {
  try {
    return window.localStorage.getItem(TRACKING_STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

export const initTracking = (options: TrackingOptions): void => {
  initBaseTracking(Boolean(options.trackBase));
  if (options.trackSession) {
    initSessionTracking();
  } else {
    clearSessionTracking();
  }
  if (options.trackUser) {
    initUserTracking(options.userKey);
  } else {
    clearUserTracking();
  }
  if (options.analytics) {
    initAnalyticsTracking(options.analytics);
  }
};

export const getLupaTrackingContext = (): {
  userId?: string;
  sessionId?: string;
} => {
  if (!isTrackingEnabled()) {
    return {};
  }
  return {
    userId: getUserKey(),
    sessionId: getSessionKey(),
  };
};

const trackLupaEvent = (
  queryKey?: string,
  data: TrackableEventData = {},
  options?: Options
) => {
  if (!queryKey || !data.type) {
    return;
  }
  const eventData: EventData = {
    searchQuery: data.searchQuery ?? "",
    itemId: data.itemId ?? "",
    name: data.type,
    userId: getUserKey(),
    sessionId: getSessionKey(),
  };
  lupaSearchSdk.track(queryKey, eventData, options);
};

const sendGa = (name: string, ...args: string[]) => {
  window.ga(() => {
    const trackers = window.ga.getAll();
    const firstTracker = trackers[0];
    if (!firstTracker) {
      console.error("GA tracker not found");
    }
    const trackerName = firstTracker.get("name");
    window.ga(`${trackerName}.${name}`, ...args);
  });
};

const trackAnalyticsEvent = (data: TrackableEventData) => {
  try {
    const options: AnalyticsOptions = JSON.parse(
      window.sessionStorage.getItem(TRACKING_ANALYTICS_KEY) ?? "{}"
    );
    if (!data.analytics || !options.enabled) {
      return;
    }
    const ga = window.ga;
    if (!ga) {
      console.error("Google Analytics object not found");
      return;
    }
    sendGa(
      "send",
      "event",
      options.parentEventName,
      data.analytics.type,
      data.analytics.label
    );
  } catch {
    console.error("Unable to send an event to google analytics");
  }
};

export const track = (
  queryKey?: string,
  data: TrackableEventData = {},
  options?: Options
): void => {
  if (!isTrackingEnabled()) {
    return;
  }
  trackLupaEvent(queryKey, data, options);
  trackAnalyticsEvent(data);
};
