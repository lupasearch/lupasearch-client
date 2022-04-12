import { Environment } from "@getlupa/client-sdk/Types";
import { AnalyticsOptions } from "./AnalyticsOptions";

export type SdkOptions = {
  environment: Environment;
};

export type TrackingOptions = {
  trackBase?: boolean;
  trackSession?: boolean;
  trackUser?: boolean;
  userKey?: string;
  analytics?: AnalyticsOptions;
};
