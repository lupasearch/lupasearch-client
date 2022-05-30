import { AnalyticsOptions } from "./AnalyticsOptions";
import { Environment as SdkEnvironment } from "@getlupa/client-sdk/Types";

export type SdkOptions = {
  environment: SdkEnvironment;
  customUrl?: string;
  customPayload?: Record<string, unknown>;
  customHeaders?: Record<string, string>;
  onError?: (err: unknown) => unknown;
};

export type TrackingOptions = {
  trackBase?: boolean;
  trackSession?: boolean;
  trackUser?: boolean;
  userKey?: string;
  analytics?: AnalyticsOptions;
};

export type Environment = SdkEnvironment;
export type SortDirection = "asc" | "desc";
