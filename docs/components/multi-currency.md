# Multi-Currency Support

If your environement needs to you can configure the search search box or search results component to support multiple currencies. This is useful for e-commerce sites that operate in different regions or countries with different currencies.

## Configuration Options

In your search box or search results configuration (search results configuration will have a priority over search box configuration), you can specify the currencies you want to support. Here is an example of how to set it up:

```js
const options = {
  selectedCurrency: 'eur',
  currencies: [
    { key: 'eur', symbol: '€', template: '{1} €', separator: ',', multiplier: 1 },
    { key: 'usd', symbol: '$', template: '$ {1}', separator: '.', multiplier: 1.12 },
    { key: 'gbp', symbol: '£', template: '£ {1}', separator: '.', multiplier: 0.85 }
  ]
}
```

In this example, we define three currencies: Euro (EUR), US Dollar (USD), and British Pound (GBP). Each currency has a key, symbol, template for formatting, separator for decimal places, and a multiplier for conversion.

Prices with currency multipliers will be calculated automatically and displayed in :

- `price` and `regularPrice` elements in search box and search results;
- price facets;
- price current filters.

Note: multicurrency will not be applied in your `customHtml` components, even if you are using price variables there. You will need to handle currency conversion manually in those cases.