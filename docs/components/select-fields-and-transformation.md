# Select fields and transformation

Both search box and search results allow passing a list of fields to be used for displaying results. It can allow you to reduce the payload size and select additional fields that are not part of the default response (for example, specific customer prices).

In search box or search results, you can pass a list of fields you want to select. Make sure they are part of the `selectFields` configuration in LupaSearch query settings or are configured as `selectableFields`.

Note that your `selectFields` will override ones configured in LupaSearch query settings.

## Select fields in search results

In search results, you can pass a list of fields to be selected when displaying products as a root configuration option:

```js
const searchResultOptions = {
  // other options
  selectFields: ['name', 'price', 'customPriceField', 'custom.nested.field']
}
```

## Select fields in search box

In search box, you can also pass a list of fields to be selected when displaying products inside a search box panel. Only supported in documents panel type.

```js
const searchBoxOptions = {
  // other options
  panels: [
    {
      type: 'document',
      selectFields: ['name', 'price', 'customPriceField', 'custom.nested.field']
    }
  ]
}
```

## Field transformation

Both search box and search results support field transformation. It allows you to transform the selected field value before displaying it. Since transformation is performed in LupaSearch SDK, you can pass this option inside sdk option:

```js
const searchResultOptions = {
  // other options
  options: {
    environment: 'production',
    transform: {
      fieldNames: {
        name: 'title',
        'prices.priceScopeCodeX.finalPrice': 'finalPrice'
      }
    }
  }
}
```

In the example above, the `name` field will be transformed to `title`, and the nested field `prices.priceScopeCodeX.finalPrice` will be transformed to a root field`finalPrice`. You can then use these transformed field names in your search box or search result elements.
