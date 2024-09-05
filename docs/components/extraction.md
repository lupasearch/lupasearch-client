# Extraction

Extraction functionality allows plugin to automatically determine dynamic options, like item id for recommendations, category id for category filters, etc. from the page context.

## Extract from url

```js
const options = {
  itemId: {
    extractFrom: 'url',
    regex: '/(\\d+)/?$',
    default: '1'
  }
}
```

The above example will extract item id from the url. The regex is used to extract the value from the url. The default value is used if the value is not found in the url.

For example, if the url is `https://example.com/product/123`, the extracted item id will be `123`.

## Extract from local or session storage

```js
const options = {
  itemId: {
    extractFrom: 'localStorage', // or 'sessionStorage'
    key: 'item_id',
    default: '1'
  }
}
```

The above example will extract item id from the local storage. The key is used to extract the value from the local storage. The default value is used if the value is not found in the local storage.

For example, if local storage has `item_id` key with value `123`, the extracted item id will be `123`.

It is also possible to use nested keys for extracting properties from serialized objects in storage:

```js
const options = {
  itemId: {
    extractFrom: 'localStorage',
    key: 'item.id',
    default: '1'
  }
}
```

If the local storage has `item` key with value `{ id: 123 }`, the extracted item id will be `123`.

## Extracting from HTML element text

```js
const options = {
  initialFilters: {
    categoryId: {
      extractFrom: 'htmlElementText',
      querySelector: '.category-id',
      default: '1'
    },
    scope: ['channel-1']
  }
}
```

If the page has the following HTML:

```html
<div class="category-id">123</div>
```

The extracted attribute value will be `123`.
