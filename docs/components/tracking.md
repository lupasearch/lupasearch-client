# Tracking

LupaSearch plugin can track significant user behavior events, like clicking on documents, suggestions or adding to cart.

For a list of all event types see Statistics section for Search Box and Search Results documentation.

## Base configuration

To enable tracking, add this block of code, above all other `lupaSaerch` configuration:

```js
import lupaSearch from '@getlupa/client'

lupaSearch.tracking({
  trackBase: true
})
```

## Configuring user-specific events

For each user or session, the plugin can generate a random unique string, that could be used to improve search experience or provide personalized results:

```js
lupaSearch.tracking({
  trackBase: true,
  trackSession: true,
  trackUser: true
})
```

## Delayed click tracking

Set `delayedClickTracking` to `true`, to emit click events after navigation to the clicked document. This might help to avoid canceled requests, if the user navigates to another page before the request is completed.

```js
lupaSearch.tracking({
  trackBase: true,
  trackSession: true,
  trackUser: true,
  delayedClickTracking: true
})
```

## Emit events directly to your Google Analytics

Plugin supports emitting various search-related events directly to your analytics account, if it is available in the front-end, i.e. if `window.ga` or `window.dataLayer` function exists.

To setup google analytics, add extra parameters to the tracking object:

```js
lupaSearch.tracking({
  trackBase: true,
  analytics: {
    type: "ua",
    enabled: true,
    parentEventName: "GetLupa",
    ignoreEvents: ["search_query"],
    itemMap: (item: Record<string, unknown>) => {
      return {
        id: item.id
        name: item.name,
        price: item.price,
      };
    },
  },
});
```

- `analytics.type` - type of external analytics provider. Possible values:

  - `ua` - Google Universal Analytics. Sends events to existing `window.ga` object;

  - `ga4` - Google Analytics 4. Sends events to existing `window.dataLayer` object;

  - `debug` - Perform no action, just log event details to the console using `console.debug`.

- `analytics.enabled` - whether analytics tracking is enabled;

- `analytics.parentEventName` - name of the event category, that will appear in your analytics dashboard.

- `analytics.ignoreEvents` - array of ignored events (that will not be sent to google analytics) by name.

- `itemMap` - define a function that transforms your document item before sending it to external analytics service, as ecommerce object.

- `analytics.searchDimensions` - push A/B test and deep search values to the data layer, see [A/B test and deep search dimensions](#ab-test-and-deep-search-dimensions).

## A/B test and deep search dimensions

With `ga4` analytics, the plugin can push two values from each search results response to `window.dataLayer`, so they can be used as GA4 custom dimensions:

- whether the search entered an A/B test, and which variant it was assigned to;

- whether deep search changed the results the shopper sees.

This is disabled by default. Configuration, including the default value for each property:

```js
lupaSearch.tracking({
  trackBase: true,
  trackSession: true,
  trackUser: true,
  analytics: {
    type: "ga4",
    enabled: true,
    parentEventName: "GetLupa",
    searchDimensions: {
      enabled: false,
      eventName: "lupa_search",
      attachToEvents: true,
      keys: {
        abTestTriggered: "lupa_ab_test_triggered",
        abTestVariant: "lupa_ab_test_variant",
        deepSearch: "lupa_deep_search",
      },
    },
  },
});
```

After every search results response, the plugin pushes an event like this:

```js
{
  event: "lupa_search",
  search_text: "cheapest samsung phone",
  lupa_ab_test_triggered: "true",
  lupa_ab_test_variant: "<query key>",
  lupa_deep_search: "true"
}
```

- `searchDimensions.enabled` - enables the dimensions;

- `searchDimensions.eventName` - name of the data layer event pushed after each search results response;

- `searchDimensions.attachToEvents` - also add the values of the last search to the GA4 events that follow it: `view_item_list`, `search_zero_results`, `search_product_click` (also with `delayedClickTracking`) and `search_add_to_cart`. Events sent before the response arrives, like `search_query`, `search_form_submit` and `search_filters`, never include them;

- `searchDimensions.keys` - data layer keys for each value. Set a key to `false` to leave that value out.

Values are always strings:

- `lupa_ab_test_triggered` - `"true"` when the search entered an A/B test, otherwise `"false"`;

- `lupa_ab_test_variant` - query key of the A/B test variant the search ran on, or `""` when the A/B test was not triggered;

- `lupa_deep_search` - `"true"` when deep search changed the results. It stays `"true"` while the shopper changes filters or sort of a deep search result, and becomes `"false"` after all filters are cleared, e.g. with "Show all results".

Things to know:

- The A/B test is triggered only when search requests include a user or session id, so enable `trackSession` and/or `trackUser` together with `trackBase`;

- Values are pushed only for `ga4` analytics. With `debug`, the event is logged to the console instead;

- Values come from the main search results request of the search results and product list components. Search box and recommendations do not set them. Deep search in `bestProducts` and `clickToTrigger` modes runs in a separate request, so `lupa_deep_search` is always `"false"` in these modes;

- The plugin creates `window.dataLayer` if it does not exist yet for the `lupa_search` event. Other GA4 events are sent only when `window.dataLayer` already exists, so load your Google Tag Manager snippet before the plugin;

- In Google Tag Manager, create a Data Layer Variable for each key and send them as event parameters on your GA4 event tags. In GA4, register `lupa_ab_test_triggered`, `lupa_ab_test_variant` and `lupa_deep_search` as event-scoped custom dimensions.
