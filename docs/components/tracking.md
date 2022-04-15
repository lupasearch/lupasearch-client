# Tracking

GetLupa plugin can track significant user behavior events, like clicking on documents, suggestions or adding to cart.

For a list of all event types see Statistics section for Search Box and Search Results documentation.

## Base configuration

To enable tracking, add this block of code, above all other `getLupa` configuration:

```js
import lupaSearch from "@getlupa/client";

lupaSearch.tracking({
  trackBase: true,
});
```

## Configuring user-specific events

For each user or session, the plugin can generate a random unique string, that could be used to improve search experience or provide personalized results:

```js
lupaSearch.tracking({
  trackBase: true,
  trackSession: true,
  trackUser: true,
});
```

## Emit events directly to your Google Analytics

Plugin supports emitting various search-related events directly to your analytics account, if it is available in the front-end, i.e. if `window.ga` function exists.

To setup google analytics, add extra parameters to the tracking object:

```js
lupaSearch.tracking({
  trackBase: true,
  analytics: {
    type: "ua",
    enabled: true,
    parentEventName: "GetLupa",
  },
});
```

- `analytics.type` - type of external analytics provider. At the moment only `ua` (Universal Analytics) is supported;

- `analytics.enabled` - whether analytics tracking is enabled;

- `analytics.parentEventName` - name of the event category, that will appear in your analytics dashboard.
