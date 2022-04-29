import { Environment } from "@getlupa/client-sdk/Types";
import { AnalyticsOptions } from "./AnalyticsOptions";

export type SdkOptions = {
  environment: Environment;
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
