# Deep search

Deep search turns the shopper's search text into filters and sort. For example, `cheapest samsung fridge` can become category _Fridges_ + brand _Samsung_, sorted by price. Deep search runs on the server, so it must be enabled for the search query in the LupaSearch console first.

The search results component supports deep search in three modes:

- `regular` - deep search runs inside the main search results request. Its filters and sort are applied to the results, and a panel above the results shows an explanation and a button to show all results instead.

- `bestProducts` - the main results are regular search results. A separate deep search request loads a few best matching products, which are shown in a panel above the results, together with the suggested filters and sort.

- `clickToTrigger` - same as `bestProducts`, but the deep search request runs only when the shopper clicks the panel.

Deep search works only with the search results and search container components.

# Options

Deep search configuration, including the default value for each property:

```ts
const options = {
  // Other search results options
  deepSearch: {
    enabled: false,
    mode: 'regular',
    regular: {
      precheck: false,
      loader: 'dialog',
      showExplanation: true,
      labels: {
        loading: 'Running deep search',
        explanationFallback: 'Results refined by deep search',
        clear: 'Show all results'
      }
    },
    bestProducts: {
      queryKey: '',
      limit: 3,
      showProducts: true,
      showExplanation: true,
      showSuggestedFilters: true,
      productCard: {},
      labels: {
        title: 'Best matches from deep search',
        loading: 'Finding best matches with deep search',
        trigger: 'Find best matches with deep search',
        explanationFallback: '',
        suggestedFiltersTitle: 'Filters suggested by deep search',
        applyFilters: 'Apply suggested filters',
        expandProducts: 'Show products',
        collapseProducts: 'Hide products'
      }
    }
  },
  labels: {
    // Other labels
    suggestedSort: 'Suggested sort'
  }
}
```

- `deepSearch.enabled` - enables deep search in the search results component. When disabled, search requests do not ask for deep search;

- `deepSearch.mode` - `regular`, `bestProducts` or `clickToTrigger`. See the mode descriptions above;

- `labels.suggestedSort` - label shown in the sort dropdown when the selected sort was suggested by deep search and does not match any of the configured `sort` options.

## Regular mode

```ts
const options = {
  // Other search results options
  deepSearch: {
    enabled: true,
    mode: 'regular',
    regular: {
      precheck: true,
      loader: 'panel',
      showExplanation: true,
      labels: {
        loading: 'Running deep search',
        explanationFallback: 'Results refined by deep search',
        clear: 'Show all results'
      }
    }
  }
}
```

- `regular.precheck` - sends a parallel precheck request together with each new search. If the precheck says that the search will use deep search, which can take a few seconds longer, a deep search loader is shown instead of the regular loading state. Without precheck, the regular loading state is shown;

- `regular.loader` - how the deep search loader is shown: `dialog` shows a modal dialog over the page, `panel` shows a panel above the search results;

- `regular.showExplanation` - shows the explanation returned by deep search in the panel above the results. When disabled, or when there is no explanation, `labels.explanationFallback` is shown instead;

- `regular.labels.loading` - deep search loader text;

- `regular.labels.explanationFallback` - panel text when there is no explanation to show. Leave empty to show only the button;

- `regular.labels.clear` - button that removes all filters and sort, and shows regular search results for the same search text. Leave empty to hide the button.

When deep search is applied to a search, its filters and sort are added to the page URL as regular filters and sort. The shopper can then remove or change them as usual, and refresh, back/forward navigation and shared links show the same results without running deep search again. Deep search runs again when the shopper searches for a new text.

## Best products modes

`bestProducts` options are used by both `bestProducts` and `clickToTrigger` modes:

```ts
const options = {
  // Other search results options
  deepSearch: {
    enabled: true,
    mode: 'clickToTrigger',
    bestProducts: {
      queryKey: '',
      limit: 4,
      showProducts: true,
      showExplanation: true,
      showSuggestedFilters: true,
      productCard: {
        elements: [
          {
            type: 'image',
            key: 'image',
            placeholder: 'https://www.example.com/placeholder.png'
          },
          {
            type: 'title',
            key: 'name',
            maxLines: 2
          }
        ]
      },
      labels: {
        title: 'Best matches from deep search',
        trigger: 'Find best matches with deep search'
      }
    }
  }
}
```

- `bestProducts.queryKey` - query key for the deep search request. Defaults to the search results `queryKey`;

- `bestProducts.limit` - number of best products to load;

- `bestProducts.showProducts` - shows product cards in the panel. Set to `false` to show only the explanation and the suggested filters;

- `bestProducts.showExplanation` - shows the explanation returned by deep search. When disabled, or when there is no explanation, `labels.explanationFallback` is shown, if it is set;

- `bestProducts.showSuggestedFilters` - shows the filters and sort suggested by deep search, with a button that applies them to the search results;

- `bestProducts.productCard` - product card options for best products, e.g. `elements`, `badges` or `links`. Any option that is not set uses the search results product card configuration;

- `bestProducts.labels.title` - panel title;

- `bestProducts.labels.loading` - text shown while best products are loading;

- `bestProducts.labels.trigger` - panel button text before the shopper starts deep search. Used only in `clickToTrigger` mode;

- `bestProducts.labels.explanationFallback` - text shown when there is no explanation. Empty by default, so nothing is shown;

- `bestProducts.labels.suggestedFiltersTitle` - title before the suggested filters;

- `bestProducts.labels.applyFilters` - button that applies the suggested filters and sort to the search results. Also changes the search text to the one deep search ran with. Leave empty to hide the button;

- `bestProducts.labels.expandProducts` - button that shows best products again after they were hidden;

- `bestProducts.labels.collapseProducts` - button that hides best products. Best products are hidden automatically when the shopper applies the suggested filters, so that the updated results are visible.

Best products are loaded once per search text. Changing filters, sort or page of the main results does not reload them.

# Query parameters

Deep search adds these query parameters to the search results page URL:

- `adj` - search text that deep search ran with. It is often empty (`adj=`), which is a valid value and is not the same as no `adj` parameter. While it is in the URL, the shown results are kept without running deep search again;

- `s` - when the sort suggested by deep search matches one of the configured `sort` options, its key is used. Otherwise, the sort is stored as `field:direction` pairs, e.g. `s=in_stock:desc,price:asc`.

Filters suggested by deep search use the same `f.`, `fr.` and `fh.` parameters as regular filters.

The `adj` parameter name can be changed with the search box `queryParameterNames` option, the same way as other query parameters:

```ts
const options = {
  // Other search box options
  queryParameterNames: {
    q: 'text',
    adj: 'adjusted'
  }
}
```

# Tracking

Clicks on products from deep search results are tracked with `deepSearch: true` in the event metadata. This applies to products in the best products panel and to search results with applied deep search filters in `regular` mode.

# Styling

All deep search elements use `lupa-deep-search-` class names, for example:

- `lupa-deep-search-panel` - explanation panel in `regular` mode;

- `lupa-deep-search-loading-dialog`, `lupa-deep-search-loading-panel` - deep search loaders;

- `lupa-deep-search-best-products` - best products panel, with `lupa-deep-search-best-products-header`, `-explanation`, `-suggestions`, `-apply` and `-items` inside it;

- `lupa-deep-search-best-products-trigger` - button shown in `clickToTrigger` mode before deep search starts.
