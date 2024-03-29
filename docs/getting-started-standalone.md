# Getting started

This documentation will help you with integrating the Lupa search plugin to your website;

## Installation

Import the latest Lupa script into the `head` section of your website:

```html
<html>
  <head>
    <!-- Stylesheets, metadata, and main scripts -->
    <script src="https://cdn.lupasearch.com/client/lupasearch-latest.min.js"></script>
    <!-- Other scripts -->
  </head>
</html>
```

## Configuration

Once the script is imported, you can start configuring it.

The configuration below would bind Lupa search box to the element of your page that has an id `searchBox`. This element can be an existing input element in your page. The `inputSelector` element should already existing at the time of configuration.

```js
const lupaSearch = window.lupaSearch;

const options = {
  inputSelector: "#searchBox",
  minInputLength: 2,
  // ... Other options
};

lupaSearch.searchBox(options);
```

Similarly, to bind search results component, select an element in your page that all of the Lupa search page will appear in:

```js
const lupaSearch = window.lupaSearch;

const options = {
  containerSelector: "#searchResultsContainer",
  // Other options
};

lupaSearch.searchResults(options);
```

If you want to configure automatic event tracking (for Lupa and google analytic), add tracking binding at the top of other plugin configurations:

```js
const lupaSearch = window.lupaSearch;

lupaSearch.tracking({
  trackBase: true,
});
```

For a list of full options and examples, see individual component documentation.

## Styling

You can apply your own styles to existing Lupa component classes, or you can use a very basic default styling as a base:

```html
<html>
  <head>
    <!-- Stylesheets, metadata, and main scripts -->
    <link rel="stylesheet" href="https://cdn.lupasearch.com/client/lupa/style-1.4.2.css" />
    <script src="https://cdn.lupasearch.com/client/lupasearch-latest.min.js"></script>
    <!-- Other scripts -->
  </head>
</html>
```

## Unmounting plugin

If for any reason you need to remove content and event listeners generated by the plugin (or to reload the plugin with new settings), use these commands to remove plugin from your page:

```js
const lupaSearch = window.lupaSearch;

lupaSearch.clearSearchBox(); // unmount search box

lupaSearch.clearSearchResults(); // unmount search results
```
