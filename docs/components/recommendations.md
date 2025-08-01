# Recommendations

## Product recommendations

This is a component that allows to display similar product recommendations for given product id (`itemId`).

Basic usage:

```js
import lupaSearch from '@getlupa/client'

const options = {
  // ... Pass all other options from search results component configuration
  ...SEARCH_RESULTS_OPTIONS,
  containerSelector: '#container-to-render-recommender',
  queryKey: 'main-query-key',
  itemId: '1',
  lazyLoad: false,
  carousel: {
    pageSizes: [
      [768, 3],
      [1024, 4]
    ],
    nextLabel: '<i> ▶ </i>',
    prevLabel: '<i> ▶ </i>',
    scrollPerPage: false
  }
}

lupaSearch.recommendations(options)
```

- `containerSelector` - container selector to render recommendation carousel in;

- `queryKey` - query key to use recommendations from. For most cases, you should use your main search query key;

- `itemId` - item (product) id to retrieve recommendations for;

- `carousel` - additional options for product carousel;

- `lazyLoad` - defaults to `false`. If set to `true`, recommendations will be lazy loaded when it comes into the viewport.

**Recommendations for multiple products**

To display recommendations for multiple products (for example, in the cart or before the checkout), it is possible to pass multiple `itemId` values:

```js
import lupaSearch from '@getlupa/client'

const options = {
  // ... All other options
  itemId: ['1', '2', '3']
}

lupaSearch.recommendations(options)
```

**Carousel options**

Product recommendation requires all options from the search result component (to display correct product card elements in recommendations).

```js
import lupaSearch from '@getlupa/client'

const options = {
  // ... Other options
  carousel: {
    pageSizes: [
      [768, 3],
      [1024, 4]
    ],
    nextLabel: '<i> ▶ </i>',
    prevLabel: '<i> ▶ </i>',
    scrollPerPage: false
  }
}

lupaSearch.recommendations(options)
```

- `pageSizes` - pass array of **screen width** and **item count** pair. Products carousel will use different number of max displayed items in a single carousel page;

- `nextLabel` - custom label for next page navigation button. Can be any html;

- `prevLabel` - custom label for previous page navigation button. Can be any html;

- `scrollPerPage` - defaults to `false`. If set to `true` carousel will scroll for a whole page. `false` value scrolls items one by one.

## Clear recommendations

Use `clearRecommendations` to cleanup the component after your page is destroyed (important on single-page applications):

```js
import lupaSearch from '@getlupa/client'

lupaSearch.clearRecommendations('#my-recommendations-container')
```

## Extracting itemId (s) from your page

You can also use extraction to get `itemId` values from your page:

```js
const options = {
  // ... All other options
  itemId: {
    extractFrom: 'localStorage',
    key: '_itemIdForLupaSearchRecommender',
    default: '1'
  }
}
```

For full extraction options, see [Extraction](/docs/components/extraction.md).

## Analytics and AB testing

AB testing allows to compare your old recommender and LupaSaerch recommender converion rate by sending recommender click events to analytics aggregator, configured using [Tracking](/docs/components/recommendations.md).

```js
import lupaSearch from '@getlupa/client'

{
  const options = {
    // ... Other recommendation options
    abTesting: {
      enabled: true,
      originalIds: ['2', '4', '8'],
      oldRecommenderDisplayRatio: 0.5
    }
  }
}
```

- `enabled` - if set to true, AB testing is enabled;

- `oldRecommenderDisplayRatio` - a chance from 0-1 that the recommender with provided original old recommender ids will be shown. `0.5` should work for most cases;

- `originalIds` - list of product ids that would have been recommended by your old recommendation engine.

Using the configuration above, there is a 50% chance that recommender will display products with ids `2`, `4`, `8` instead of LupaSearch recommender to compare which recommender produces better results.

Make sure to enable [tracking](/docs/components/recommendations.md) for analytics AB testing to work.

## Callbacks

Recommendation options support some additional callbacks to be executed on certain events:

```js
import lupaSearch from '@getlupa/client'

{
  const options = {
    // ... Other recommendation options
    recommendationCallbacks: {
      onMounted: () => {
        console.log('Recommendations mounted')
      },
      onRecommenderResults: (results: Document[]) => {
        console.log('Recommendations results', results)
      }
    }
  }
}
```

- `onMounted` - callback that is executed when recommender is mounted;
- `onRecommenderResults` - callback that is executed when recommender results are received. It receives an array of recommended products as a parameter.
