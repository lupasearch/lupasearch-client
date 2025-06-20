# Overview

Page configuration usage, including default value for each property:

```js
import lupaSearch from '@getlupa/client'

const options = {
  containerSelector: '#searchResultsContainer',
  hideResultsOnReload: false,
  splitExpensiveRequests: false,
  labels: {
    pageSize: 'Page size:',
    sortBy: 'Sort by:',
    itemCount: 'Items {1} from {2}',
    currency: '€',
    priceSeparator: ',',
    currencyTemplate: '{1} €'
    showMore: 'Show more',
    searchResults: 'Search Query: ',
    emptyResults: 'There are no results for the query:',
    noItemsInPage: 'There are no results in this page',
    backToFirstPage: 'Go back to the first page',
    mobileFilterButton: 'Filter',
    mobileFilterButtonActive: 'Active filters',
    mobileFilterButtonOpen: 'Open filters',
    mobileFilterCloseButton: 'Close',
    htmlTitleTemplate: "Search Query: '{1}'",
    noResultsSuggestion: 'No results found for this query: {1}',
    didYouMean: 'Did you mean to search: {1}',
    similarQuery: 'Search results for phrase {1}',
    similarQueries: 'Similar queries:',
    filteredItemCount: 'Filtered items {1} from {2}',
    outOfStock: 'Out of stock',
    aiSuggestions: 'Other suggestions:',
    similarResultsLabel: 'Related to your query:'
  }
}

lupaSearch.searchResults(options)
```

- `inputSelector` - css selector to find your search input element;

- `labels.pageSize` - label for page size selector;

- `labels.sortBy` - label for sort selector;

- `labels.itemCount` - label for item count title. `{1}` is replaced by indices of currently visible items, and `{2}` is total number of search results;

- `labels.currency` - label for currency, where price is used;

- `labels.priceSeparator` - decimal separator for price value (19,85 €);

- `labels.currencyTemplate` - if set, it will be used to format the price. Value {1} will be replaced with the price value. For example: `€ {1}` will display `€ 19,85` for a price of 19.85 (formatted using your chosen priceSeparator);

- `labels.showMore` - pagination label to show more results and go to the next page;

- `labels.searchResults` - a label that is displayed at the top of search results, is appended with a current search query text;

- `labels.emptyResults` - a label to show when search yields no items, is appended with a current search query text;

- `labels.noItemsInPage` - a label to show when there are no items in the current page (this can happen if user manually navigates to the page, outside of the result range);

- `labels.backToFirstPage` - when there are no items in current page, this label will guide user to the first page of the results.

- `labels.mobileFilterButton` - a label of a button that is visible on mobile resolutions and toggles the mobile search result filter sidebar.

- `labels.mobileFilterButtonActive` - a label of a mobile filter button when the filter sidebar is open and has at least one active filter.

- `labels.mobileFilterButtonOpen` - a label for a mobile filter button when the filter sidebar is open.

- `labels.mobileFilterCloseButton` - a label of a button that is visible on all resolutions and closes the search result filter sidebar.

- `labels.htmlTitleTemplate` - dynamic web page tab title template. `{1}` is replaced by a current search query text;

- `labels.noResultsSuggestion` - a label to show when search yields no items, but has items for a suggested search query. `{1}` is replaced by a current search query text;

- `labels.didYouMean` - a label to suggest a search query. `{1}` is replaced by a suggested search query;

- `labels.similarQuery` - a label that is displayed on top of the items yielded by a similar to the used search text query. `{1}` is replaced by this similar search query;

- `labels.similarQueries` - a label that is displayed before all the items yielded by the similar queries;

- `labels.filteredItemCount` - special case for item count label, which is shown when at least one filter is active;

- `labels.outOfStock` - product out of stock overlay label;

- `labels.aiSuggestions` - label for similar query with AI suggestions;

- `labels.similarResultsLabel` - label to show when similar results functionality is enabled;

- `labels.refinersLoadingNotice` - label to show when refiner values are loading;

- `hideResultsOnReload` - results will be hidden, while new configuration is loading when plugin is reloaded with new options and `fetch: true`.

- `splitExpensiveRequests` - if set to true, facet and refiner requests will be issued separately, instead of being included in the main search query. This is useful for large datasets.

# Query parameters

Search result page retrieves and sets these query parameters from/to page url:

- `q` - user search query text;

- `p` - current page number;

- `l` - item limit, equal to page size;

- `s` - sort key;

- `f.{key}` - filter by term facet value. There can be multiple facet keys;

- `fh.{key}` - filter by hierarchical facet value. There can be multiple facet keys;

- `fr.{key}` - filter by range (stats) facet value. The filter value is a range, with values separated by a colon: `fr.price=5:20`;

If you need to hide any of the sections from the search page, just omit it from option configuration.

# Configuration parameters

## Product Grid

```js
const options = {
  grid: {
    columns: {
      xl: 4,
      l: 3,
      md: 2,
      sm: 2,
      xs: 1
    }
  }
}
```

Configure product grid and number of columns per row on each resolution.

## Breadcrumbs

An list of custom breadcrumb segments, at the top of search page:

```js
const options = {
  breadcrumbs: [{ label: 'Home', link: '/', separator: '/' }, { label: 'Search Query: {1}' }]
}
```

The above configuration would be rendered like this: `Home / Search Query: Current Query Text`, with their respective links.

- `label` - a label for a breadcrumb segment. The last segment can have a parameter `{1}` that is replaced with a current search query text;

- `link` - an optional link the segment refers to.

- `separator` - a separator between breadcrumb segments. Defaults to `/`.

## Class map

Additional classes to add to specific elements. Can be used if custom css is not enough to describe the element appearance:

```js
const options = {
  classMap: {
    layoutSelectionGrid: 'grid',
    layoutSelectionGridActive: 'grid-active',
    layoutSelectionList: 'list',
    layoutSelectionListActive: 'list-active'
  }
}
```

## Products

```js
const options = {
  isInStock: (document) => {
    return true
  },
  badges: {
    anchor: 'tr',
    elements: [
      {
        type: 'discount',
        className: 'custom-discount',
        regularPriceKey: 'regularPrice',
        finalPriceKey: 'discountPrice',
        // discountKey: "discount",
        discountType: 'percentage',
        labels: {
          prefix: '- ',
          postfix: ' %'
        },
        display: (doc) => Boolean(doc.discountPrice < doc.regularPrice)
      },
      {
        type: 'text',
        key: 'text_labels',
        prefix: '- ',
        maxItems: 1
      },
      {
        type: 'image',
        key: 'image_labels',
        rootImageUrl: 'https://lupasearch.com/media/',
        maxItems: 1
      },
      {
        type: 'customHtml',
        className: 'new-product',
        html: (doc) => {
          return `<span>(N)</span>`
        },
        display: (doc) => Boolean(doc.isNewProduct)
      }
    ]
  },
  links: {
    details: '/{id}'
  },
  idKey: 'id',
  titleKey: 'name',
  isLink: false,
  customDocumentHtmlAttributes: (doc: any) => {
    return {
      'data-id': doc.id,
      'data-name': doc.name
    }
  },
  elements: [
    {
      type: 'image',
      key: 'image',
      placeholder: 'placeholder.png',
      customUrl: (document) => {
        return `${baseUrl}/${document.image}?quality=150`
      },
      alt: (document) => {
        return `This is alt text for item: ${document.name}`
      },
      hoverImages: {
        key: 'additionalImages',
        cycleInterval: 3000,
        maxImages: 3,
        display: (document) => document.myImages.map((i) => i.src)
      }
    },
    {
      type: 'title',
      key: 'name',
      link: false,
      maxLines: 2
    },
    {
      type: 'description',
      key: 'description',
      maxLines: 3
    },
    {
      type: 'custom',
      className: 'customClassName',
      key: 'author',
      action: (document) => {
        console.log('author was clicked', document)
      }
    },
    {
      type: 'rating',
      key: 'ratings',
      maxRating: 5,
      totalKey: 'ratingsCount',
      labels: {
        numberOfRatings: 'Total ratings: '
      },
      links: {
        ratingDetails: '/{id}#ratings'
      },
      display: (doc) => Boolean(doc.hasRating)
    },
    {
      type: 'price',
      key: 'discountPrice'
    },
    {
      type: 'regularPrice',
      key: 'regularPrice'
    },
    {
      type: 'addToCart',
      labels: {
        addToCart: 'Add to Cart'
      },
      emitEvent: 'addToCart',
      action: (document, amount) => {},
      group: 'cart'
    },
    {
      type: 'customHtml',
      className: 'best-offer',
      html: (doc) => {
        return `<div>This is the best offer: ${doc.price}!</div>`
      },
      display: (doc) => Boolean(doc.isBestOffer),
      action: (document) => {
        console.log('custom element was clicked', document)
      }
    }
  ]
}
```

- `isInStock` - a function to determine whether given product is in stock. It receives a full original document from search results. If product is out of stock, it cannot be added to the cart;

- `idKey` - a key that references a unique document identifier. Used in analytics to track document clicks. Defaults to `id`. If your key is different than `id`, it must be set explicitly, as it might lead to unexpected behaviour othervise.

- `titleKey` - a key that references a document title (name). Used to report events to your tracker.

- `isLink` - set to `true` to make whole product card clickable, and redirect user to the product link, defined in `links.details` setting. Defaults to `false`.

- `customDocumentHtmlAttributes` - provide your own custom attributes that will be added to each document html element. Receives document object as a parameter.

Configure product card. Configuration consists of two main sections: `badges` and `card`. Badges are small items, describing the product, placed on the product card.

### Badges

- `anchor` - badge placement position on a product card. Available values: `tr`, `tl` (top-right, top-left).

You can add more than one badge to the configuration. Badges are placed according to the anchor, one after another.

Common badge keys:

- `display` - optional function to determine wether badge should be displayed. Receives a document entry and should return `true` or `false`.

Available badge types:

- `text` - text label. Displays a values from a provided text label array, defined with a `key`: `text_labels: ["15%", "New Product"]`;

  - `prefix` - a custom prefix to append to value of the badge;

  - `maxItems` - a maximum number of items to display for that specific key;

- `image` - image label. Displays an image a from a document field, defined with a `key`: `image_labels: ["discount.jpg", "special-item.png"]`;

  - `rootImageUrl` - a root url of an image;

  - `maxItems` - a maximum number of items to display for that specific key;

- `customHtml` - a badge, that is render as a custom html;

  - `className` - custom class name to add to the badge element;

  - `maxItems` - a maximum number of items to display for that specific key;

  - `html` a function that receives document object and should return an html string. Make sure to sanitize any document fields if any of the used document fields could be unsafe, or user-generated.

- `discount` - discount badge. Displays a discount value, calculated from `regularPrice` and `finalPrice` fields;

  - `regularPriceKey` - a key of a field in a document, that contains a regular price of a product;

  - `finalPriceKey` - a key of a field in a document, that contains a final price of a product;

  - `discountKey` - a key of a field in a document, that contains a discount value. If not provided, discount is calculated from `regularPriceKey` and `finalPriceKey`;

  - `discountType` - a type of a discount value. Available values: `percentage`, `absolute`;

  - `labels.prefix` - a custom prefix to append to value of the badge, defaults to `-`;

  - `labels.postfix` - a custom postfix to append to value of the badge, defaults to `%` for percentage discount.

### Elements

Define elements on the product card. Elements are placed in order, from top to bottom, in the product card. Each element is placed on a separate row.

- `links.details` - `links.details` - a constructable link that user is redirected to after clicking on a product card. Use document fields like `id` in curly brackets (`{id}`) to build desired link url.

Common element keys:

- `display` - optional function to determine wether document element should be displayed. Receives a document entry and should return `true` or `false`.

- `group` - optional key to group certain elements. Elements with group defined will be placed at the bottom of the card, with the same wrapper element for each unique group.

Available card element types:

- `image` - image of the product.

  - `key` - a key of field in a document;

  - `placeholder` - placeholder image to show if item does not have an image;

  - `customUrl` - Provide a function that returns image url from document. Overrides all other image options;

  - `alt` - Provide a function that returns an alt image text for a given document.

  - `hoverImages` - additional images that are shown on hover.

  - `hoverImages.key` - a key of field in a document to look for additional images. Field should be a list of absolute or relative image urls;

  - `hoverImages.cycleInterval` - time in ms to cycle through images. Defaults to `2000`;

  - `hoverImages.maxImages` - max number of images to display on hover. Defaults to `5`;

  - `hoverImages.display` - a function that receives a document object and should return a list of image urls to display on hover. Will take precedence over `key` option.

- `title` - title of the product.

  - `key` - a key of field in a document;

  - `link` - a flag to determine whether clicking on product title should redirect user to the product link, defined in `links.details` setting.

  - `maxLines` - max number of lines, before the text is clipped.

- `description` - description of the product.

  - `key` - a key of field in a document;

  - `maxLines` - max number of lines, before the text is clipped.

- `rating` - rating of a product. Displayed as number of starts out of 5. `ratingKey`, `totalRatingsKey`;

  - `key` - a key that determines a percentage of product rating.

  - `maxRating` - a maximum rating value. `key` value will be divided by this value to get a percentage.

  - `getRatingPercentage` - a function that receives a document item and should return a percentage (0 - 100) of a rating value. Should not be used together with `key`.

  - `totalKey` - a document key that determines a total number of ratings for that product.

  - `labels.numberOfRatings` - label for number of ratings;

  - `links.ratingDetails` - where should `numberOfRatings` label link to. Constructed using the same rules, as other product links.

- `singleStarRating` - similar to rating, but instead of rendering 5 stars, just shows 1 start with an ability to display wanted rating text. Retains ability to show total number of ratings with a custom link.

  - `displayRating` - a function to return a custom rating text which will be rendered as a string.

  - `labels.numberOfRatings` - label for number of ratings;

  - `links.ratingDetails` - where should `numberOfRatings` label link to. Constructed using the same rules, as other product links.

- `price` - final price of the product, after any discounts;

  - `key` - a key of field in a document;

- `regularPrice` - regular price of the product, before discount;

  - `key` - a key of field in a document;

- `addToCart` - add to cart button.

  - `action` - action to execute when user clicks the Add to Cart button. Described as a function, which receives `document` and `amount` parameters. Document parameter is an item, returned with the search results, and contains properties, defined in `selectFields` option. The function may optionally return a promise, so a loading indicator could be displayed while adding to cart is in progress;

  - `labels.addToCart` - a label for add to cart button.

  - `emitEvent` - an event name to emit when user clicks the Add to Cart button. This event can be caught: `document.addEventListener('addToCart', function(event) { const item = event.detail.item; });`, if `addToCart` is your `emitEvent` value;

- `custom` - a custom field that is rendered as a simple text;

  - `key` - property key in a document;

  - `className` - custom class name that will be applied to the element;

  - `action` - action to execute when user clicks on the custom html element. Receives `document` as a parameter.

- `customHtml` - an element, that is render as a custom html;

  - `className` - custom class name to add to the element;

  - `html` - a function that receives document object and should return an html string. Make sure to sanitize any document fields if any of the used document fields could be unsafe, or user-generated;

  - `action` - action to execute when user clicks on the custom html element. Receives `document` as a parameter.

## Filters

```js
const options = {
  filters: {
    visibility: true,
    currentFilters: {
      visibility: {
        mobileSidebar: true,
        mobileToolbar: true,
        desktopToolbar: false,
        desktopSidebar: true
      },
      labels: {
        title: 'Current filters:',
        clearAll: 'Clear all'
      },
      mobileSidebar: {
        showFilterCount: false,
        activeFiltersExpanded: false
      },
      desktopToolbar: {
        activeFiltersExpanded: false
      }
    },
    facets: {
      labels: {
        title: 'Filters:',
        showAll: 'Show more',
        showLess: 'Show less',
        facetFilter: 'Filter...'
      },
      disableMobileBodyScrollLock: false,
      hierarchy: {
        maxInitialLevel: 2,
        topLevelValueCountLimit: 5,
        behavior: 'replace',
        filterable: true
      },
      stats: {
        slider: true,
        inputs: false,
        interval: 0.01,
        pricePrecisionDigits: 2,
        labels: {
          from: 'From:',
          to: 'To:',
          ariaFrom: 'From',
          ariaTo: 'To',
          sliderDotAriaLabel: 'Slider dot'
        },
        units: {
          lenght: 'mm',
          height: 'cm'
        }
      },
      filterable: {
        minValues: 5
      },
      facetValueCountLimit: 20,
      showDocumentCount: true,
      style: {
        type: 'top-dropdown'
      },
      exclude: ['price', 'category'],
      excludeValues: {
        color: { Red: true, 'Navy Blue': true },
        size: { S: true }
      },
      expand: ['regular_price'],
      facetFilterQueries: {
        tag: { queryKey: '' }
      }
    }
  }
}
```

- `visibility` - show default filters section, defaults to `true`;

- `currentFilters` - show a summary of currently active filters;

- `currentFilters.labels.title` - title if any filters are active;

- `currentFilters.labels.clearAll` - text on a "Clear all Filters" button;

- `currentFilters.labels.facetFilter` - a placeholder for term facet value filter;

- `currentFilters.visibility.mobileSidebar` - whether to display current filters section in expandable mobile sidebar;

- `currentFilters.visibility.mobileToolbar` - whether to display current filters on mobile resolution on page toolbar, at the top of the product list;

- `currentFilters.visibility.desktopToolbar` - whether to display current filters on desktop toolbar;

- `currentFilters.visibility.desktopSidebar` - whether to display current filters on desktop sidebar, defaults to `true`;

- `currentFilters.mobileSidebar.showFilterCount` - show filter count at the top of the mobile sidebar;

- `currentFilters.mobileSidebar.activeFiltersExpanded` - expand active filters section in the mobile sidebar by default;

- `currentFilters.desktopToolbar.activeFiltersExpanded` - expand active filters section in the desktop toolbar by default.

- `facets` - show a facet filter section;

- `facets.hierarchy` - hierarchy-specific facet settings;

  - `maxInitialLevel` - maximum initial depth of facet category tree;

  - `topLevelValueCountLimit` - an initial limit of visible top-level facet values;

  - `filterable` - determines whether client side hierarchy facet value filtering should be shown;

  - `behavior` - behavior of hierarchy facet values. Available options: `replace` - replace current filter value with a new one; `append` (default) - add a new option as an OR filter to existing values;

- `facets.stats` - range - stats facet specific settings;

  - `slider` - display range slider;

  - `inputs` - display numeric range slider inputs;

  - `interval` - default slider slider step interval. Defaults to `1`;

  - `pricePrecisionDigits` - number of digits after the decimal point for price range slider;

  - `labels.from` - input "from" label;

  - `labels.to` - input "to" label;

  - `labels.ariaFrom` - aria accessibility label for 'from' input field;

  - `labels.ariaTo` - aria accessibility label for 'to' input field;

  - `labels.sliderDotAriaLabel` - aria accessibility label for slider dot input. Is combined with facet label.
 
  - `units` - define other type of sliders values;

- `facets.labels.title` - a title of the facet section;

- `facets.labels.showAll` - a label of a button at the bottom of facet list, if facet count is greater than `facetValueCountLimit`;

- `facets.labels.showLess` - a label of a button at the bottom of facet list, to toggle the show more/show less state;

- `facets.facetValueCountLimit` - client side only limit of number of facet values, before "Show more" label is shown;

- `facets.filterable` - determines whether client side term facet value filtering should be shown;

- `facets.filterable.minValues` - min number of facet values when term facet filter input should be displayed;

If user changes any filter value, current page is reset to the first one.

- `facets.showDocumentCount` - defines whether to show a product count with each term or hierarchy facet value.

- `facets.style.type` - style of the facets. Two available options: `sidebar` - facets displayed at the left sidebar; `top-dropdown` - facets are displayed at the top of the product list, in separate dropdown panels.

- `facets.exclude` - exclude any returned facets from display by their key (field name).

- `facets.excludeValues` - exclude any returned facet values from display by parent facet key and value name.

- `facets.expand` - given facet panels are expanded by default;

- `facets.facetFilterQueries.[facetKey].key` - provide query key to load additional facet parameters. Query should contain the same query fields as the main query and should only contain aggregation for that facet key. Use case example: the main search query is configured to load up to 100 facet values. However, if user opens facet panel, this query key could be used to load remaining facet values;

- `facets.disableMobileBodyScrollLock` - disable body scroll lock on mobile resolution when sidebar filters are opened.

### Filter / facet translations

LupaSearch plugin supports translations (product feed filter attribute string replacements). This can be handy if you want to show different labels for the same filter value, depending on the language of the user, or simply to show a more user-friendly label.

Configuration example:

```js
const options = {
  filters: {
    // ... Other filter options
    translations: {
      keyTranslations: {
        color: 'Color',
        size: 'Size',
        attr_x18: 'Weight'
      },
      valueTranslations: {
        color: {
          color_red: 'Red',
          color_blue: 'Blue'
        },
        isInStock: {
          0: 'Out of stock',
          1: 'In stock'
        }
      }
    }
  }
}
```

`translations.keyTranslations` - a map of your facet filter keys to their translated labels.
`translations.valueTranslations` - a map of your facet filter keys to their translated labels. Each key in the map is a facet filter key, and the value is a map of the facet filter values to their translated labels.

## Sort

```js
const options = {
  sort: [
    {
      key: 'priceDesc',
      label: 'Price (Descending)',
      default: true,
      config: [{ price: 'desc' }]
    },
    {
      key: 'priceAsc',
      label: 'Price (Ascending)',
      config: [{ in_stock: 'desc' }, { price: 'asc' }]
    },
    {
      key: 'relevance',
      label: 'Relevance',
      config: [{ in_stock: 'desc' }, { _relevance: 'desc' }]
    }
  ]
}
```

Define any additional options for search result page.

- `pageSizes` - a list of page sizes that user can select from. Default page size comes from a setting in your Search Query;

- `sort` - custom sort options. Custom sort options are appended to the default option, which sorts search results by relevance. Sort options consist of unique sort key (which is used as a query parameter), and sort configuration, with the same syntax as in Search Query configuration. You can define multiple sort properties for one key. `default` option defines which sort value should be selected when no sort query parameters are defined.

## Pagination

```js
const options = {
  sizeSelection: {
    position: {
      top: true,
      bottom: true
    },
    sizes: [12, 24, 36, 72]
  },
  pageSelection: {
    position: {
      top: false,
      bottom: true
    },
    display: 5
  }
}
```

- `sizeSelection` - page size/item limit selection configuration;

  - `sizes` - a list of page sizes that user can select from. Default page size comes from a setting in your Search Query;

  - `position` - where size selection should be displayed: `top`, `bottom` of the results, or both.

- `pageSelection` - pagination display settings;

  - `position` - where page selection should be displayed: `top`, `bottom` of the results, or both.

  - `display` - maximum number of pages to display in pagination;

## Dynamic page sizes

It is possible to configure different page size selection options for different resolutions (If you have a different number of grid columns for `xs`, `md` or `xl` sizes, or just want to have smaller pages for lower resolutions):

```js
const options = {
  sizeSelection: {
    sizes: {
      xs: [12, 24, 36],
      sm: [15, 30, 45, 60],
      md: [15, 30, 45, 60],
      l: [12, 24, 36, 60],
      xl: [15, 30, 45, 60]
    }
  }
}
```

## Toolbar

Control which elements are visible in the toolbar.

```js
const options = {
  toolbar: {
    layoutSelector: true,
    itemSummary: true,
    clearFilters: false,
    totalCount: false,
    filtersCloseButton: false
  }
}
```

- `layoutSelector` - show layout (regular or full page width product cards) selector buttons;

- `itemSummary` - show a short text that displays the number of total items, controlled by label `labels.itemCount`;

- `clearFilters` - show clear all filters button in the toolbar;

- `totalCount` - display total result count value in the search title summary;

- `filtersCloseButton` - show a close button in the toolbar that closes filters sidebar.

## Search title position

Control search title position:

```js
const options = {
  searchTitlePosition: 'page-top'
}
```

Available options:

- `search-results-top` - search results title (along with did you mean query) will be displayed at the top of the search results, side by side to the filters sidebar;

- `page-top` - search results title will be displayed at the top of the page, above filters and just below the breadcrumbs. Default option.

## Additional panels

Search results has an ability to display a number of additional product panels, with different query keys and settings, at the top or at the bottom of the main product list. Additional panels can be used to display blog news, recommended products or other items that are related to the main search results. Additional panel items do not have filters or facets and have only simplified pagination settings.

```js
const options = {
  additionalPanels: [
    {
      location: 'top',
      queryKey: '',
      initialCountLimit: 2,
      totalCountLimit: 12,
      labels: {
        showMore: 'Show more ({1})',
        showLess: 'Show less'
      },
      links: {
        details: '/{id}'
      },
      elements: [
        {
          type: 'title',
          key: 'name',
          maxLines: 2
        },
        {
          type: 'description',
          key: 'simplifiedDescription',
          maxLines: 3
        }
      ]
    }
  ]
}
```

- `location` - location of the panel. Available values: `top` and `bottom`;

- `queryKey` - query key for the panel;

- `initialCountLimit` - a max number of items to display initially;

- `totalCountLimit` - a max number of items to display when panel is expanded;

- `labels.showMore` - label to expand a panel. `{1}` is replaced with a total number of items, no larger than `totalCountLimit`;

- `labels.showLess` - label to undo expansion of a panel;

- `links.details` - `links.details` - a constructable link that user is redirected to after clicking on an item Use document fields like `id` in curly brackets (`{id}`) to build desired link url.

- `elements` - a list of available elements. Available items and configuration is the same as in the main search result list.

## Disallow empty query

By default, search result pages queries all documents if there is no query string defined. You can disable this functionality with the following option:

```js
const options = {
  disallowEmptyQuery: true
}
```

## Dynamic data

Sometimes it is not possible to store all of the required data in LupaSearch indices. You can use Dynamic Data functionality to load additional product data from your own API or other sources.

More details can be found here:

- [Dynamic data Box](./dynamic-data.md)

## Event callbacks

Lupa can emit callbacks on certain events:

```ts
const options = {
  // other configuration
  callbacks: {
    onMounted: () => {},
    onSearchResults: (context: ResultCallbackContext) => {},
    onAdditionalPanelResults: (context: CallbackContext) => {},
    onCategoryFilterResults: (context: CallbackContext) => {},
    onUrlQueryChange: (context: CallbackContext) => {},
    onProductClick: (context: CallbackContext) => {},
    onSortChange: (context: SortCallbackContext) => {}
  }
}
```

- `onSearchResults` - all products loaded;

- `onAdditionalPanelResults` - additional panels loaded;

- `onCategoryFilterResults` - category filter loaded;

- `onUrlQueryChange` - LupaSearch url query changes (page, sort, filter parameters are changed).

- `onSortChange` - fires when user changes current sort option.

Where `CallbackContext` is:

```ts
type CallbackContext = {
  queryKey: string
  hasResults?: boolean
  urlQueryString?: string
  productId?: string
}
```

`ResultCallbackContext` additionally has current parameters value:

```ts
type ResultCallbackContext = CallbackContext & {
  params: Record<string, any>,
  results:  Record<string, any>,
}
```

Example:

```json
{
  "hasResults": true,
  "queryKey": "",
  "params": {
    "query": "",
    "sort": "nameDesc",
    "filters": {
      "color": ["Yellow"]
    }
  },
  "results": {
    "total": 100,
    "items": [
      {
        "id": "123",
        "name": "Product 1"
      },
      {
        "id": "456",
        "name": "Product 2"
      }
    ]
  }
}
```

`SortCallbackContext` contains the following parameters:

```ts
type SortCallbackContext = {
  selectedSortKey: string
  previousSortKey?: string
}
```

## Routing behavior

```js
const options = {
  routingBehavior: 'event'
}
```

Search results supports two ways of product card routing `routingBehavior` settings:

- `direct-link` - elements are direct links to the urls, defined in the document object;

- `event` - when user clicks on the product (title or image), a special event `lupaRedirect` is emitted on the window object. The event can then be handled by the plugin user:

```js
window.addEventListener('lupaRedirect', (data) => {
  // data.detail - redirect url
})
```

## Scroll to results after page/filter change

LupaSearch supports automatic scrolling to the top of the search results page, when user is navigating through pages or facet filter value is changed.

You can control this behavior with the following options:

```js
const options = {
  scrollToResults: {
    enabled: true,
    timeout: 500,
    scrollToContainerSelector: '#app'
  }
}
```

- `enabled` - whether scroll functionality is enabled. Defaults to `true`;

- `timeout` - how many ms to wait after user action before initiating scroll. Defaults to `500`;

- `scrollToContainerSelector` - override container element, which indicates the top of the search results window. Defaults to `#lupa-search-results`.

## Dynamic display

In some environments (like plugin configurator) it is not possible to use custom functions.

Each option that supports dynamic display option, allows to use dynamic display condition configuration.

Examples:

The following configuration will display the element only if the document has a `price` field:

```js
const options = {
  elements: [
    {
      type: 'price',
      key: 'price',
      display: {
        condition: 'exists',
        fields: ['price']
      }
    }
  ]
}
```

In a similar way, you can use `lessThan` condition to set document stock status if the `stock` field is less than 1:

```js
const options = {
  isInStock: {
    condition: 'lessThan',
    fields: ['stock', 1]
  }
}
```

Full list of available conditions: `exists`, `notExists`, `equals`, `notEquals`, `greaterThan`, `lessThan`, `greaterThanOrEquals`, `lessThanOrEquals`.

It is also possible to use nested keys in the condition configuration:

```js
const options = {
  elements: [
    {
      type: 'customHtml',
      html: '<div class="my-class">This is the best offer: {{price.value}} {{price.currency}}</div>',
      display: {
        condition: 'exists',
        fields: ['price.value']
      }
    }
  ]
}
```

This would work with the following document fields:

```json
{
  "id": "123",
  "price": {
    "value": 100,
    "currency": "EUR"
  }
}
```

## Custom Html element template

In some cases, you might need to use a custom HTML template for some elements without using custom functions. You can use the following configuration:

```js
const options = {
  elements: [
    {
      type: 'customHtml',
      html: '<div class="my-class">This is the best offer: {{price}} EUR</div>'
    }
  ]
}
```

For example, if document has the following fields:

```json
{
  "id": "123",
  "price": 100
}
```

The above configuration will render the following HTML:

```html
<div class="my-class">This is the best offer: 100 EUR</div>
```

You can also use nested fields in the template:

```js
const options = {
  elements: [
    {
      type: 'customHtml',
      html: '<div class="my-class">This is the best offer: {{price.value}} {{price.currency}}</div>'
    }
  ]
}
```

For example, if document has the following fields:

```json
{
  "id": "123",
  "price": {
    "value": 100,
    "currency": "EUR"
  }
}
```

The above configuration will render the following HTML:

```html
<div class="my-class">This is the best offer: 100 EUR</div>
```

You can use html templates in all plugin options where custom html elements are supported, like `badges`, `elements`, `additionalPanels`, etc. by replacing `html` function with string template value.

Both templates and document values are sanitized before rendering, which means that certain HTML tags, like `img` are removed from the rendered HTML.

## Dynamic attributes

Search box and search result elements support adding dynamic attributes to the HTML elements. Using templates. You can use the `dynamicAttributes` configuration with any type of element:

```js
const options = {
  elements: [
    {
      type: 'addToCart',
      key: 'id',
      dynamicAttributes: [
        {
          key: 'data-id',
          value: '{{id}}'
        },
        {
          key: 'data-method',
          value: 'ajax-post'
        },
        {
          key: 'data-name-en',
          value: 'Name: {{name.en}}'
        }
      ]
    }
  ]
}
```

Important: only attribute keys that start with `data-` are allowed.

## Related queries

Search results page can display related queries, based on the current search query. Related queries are displayed at the top of the search results page.

```js
const options = {
  relatedQueries: {
    queryKey: '',
    source: {
      type: 'facets',
      key: 'category',
      count: 4,
      mode: 'query'
    },
    labels: {
      title: 'Related queries:'
    },
    image: {
      type: 'image',
      key: 'image',
      placeholder: 'placeholder.png'
    },
    showCount: true
  }
}
```

- `source` - source of related queries. Available options: `facets`. If `facets` is selected, you need to provide a `key` of the facet to use as a source (will take the first `count` values from facet result);

- `queryKey` - defines which query key to use to load the first element for each related query. If not provided, the main query key is used;

- `labels.title` - a title of the related queries section;

- `image` - an image element options for related query. If not provided, default image element from `elements` will be used;

- `showCount` - show a count of items for each related query;

- `source.mode`- mode of related queries. Available options: `query` - clicking on related query will issue a new search query with that query text; `filter` - clicking on related query will filter the current search results by that query text with.

## Redirection suggestions

Search results page can display redirection suggestions if certain characters or words are found in a current search text. This could be useful to suggest a search in a different language.

```js
const options = {
  redirectionSuggestions: [
    {
      matchCharacters: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя',
      label: ' Вы хотели искать на русском языке? {1}',
      link: '/ru/search'
    }
  ]
}
```

- `matchCharacters` - a list of characters to match in the search query text;
- `label` - a label to display as a suggestion. `{1}` is replaced by the current search text;
- `link` - a search results link to redirect user to, if the suggestion is clicked.

```js
const options = {
  redirectionSuggestions: [
    {
      matchWords: ['special', 'product'],
      label: 'We sell these products in a specialized website here.',
      link: 'https://our-specialized-website.com/search'
    }
  ]
}
```

- `matchWords` - a list of words to match in the search query text.

## Initial filters

You can set initial filters for the search results page. Initial filters are applied for all of the search result queries, user can't remove them and they are not shown in the filters panel.

```js
const options = {
  initialFilters: {
    categoryId: ['123']
  }
}
```

# Statistics

By using tracking API, the plugin should be able to track these events in the search results page:

- User clicks on any product in main or additional item section and goes to the detail page;

- Product is added to the cart;
