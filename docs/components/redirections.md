# Redirections

LupaSearch plugin allows automatic redirection to a custom url, when a special configured user input phrase is encountered.

# Redirection configurations

Configurations are managed via the LupaSearch console for the selected search index.

Configuration example:

```json
{
  "rules": [
    {
      "target": "/redirect-to-this-page",
      "sources": ["redirect", "other", "keyword"]
    }
  ]
}
```

The above configuration indicates that if a user inputs a keyword from `sources`, they will be redirected to the `target` URL upon navigating to the search results page.

# Options

To enable redirections, define the rules in the configuration console and activate the feature in Search Results or Search Box options:

```ts
const options = {
  // Other search box or search results options
  redirections: {
    enabled: true,
    queryKey: '',
    cacheSeconds: 3600,
    urlTransformer: (url: string) => {
      return `${url}`
    }
  }
}
```

For consistent behavior, ensure that the configurations for both Search Box and Search Results components match, as the plugin will use the settings from the first component it renders.

- `enabled`: enables the redirection feature when set to `true`.

- `qyeryKey`: choose a query key that will reference search index from which to load redirection configurations from. Usually, this is your main document search key.

- `cacheSeconds` - to reduce unnecessary API calls and enhance performance, redirection rules can be cached. A higher value is advisable if redirection rules change infrequently.

- `urlTransformer` - customize or append to the redirection URL as needed. Useful for language-specific routing or other URL modifications.
