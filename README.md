# search-plugin

## Getting started for development

Copy example configuration files files to enable live reloading of configuration during development

- `src/constants/development/searchBoxDev.example.const.ts`

- `src/constants/development/searchResultsDev.example.const.ts`

To

- `src/constants/development/searchBoxDev.const.ts`

- `src/constants/development/searchResultsDev.const.ts`.

If files are not copied, development build will not work.

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Bundles the plugin

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Runs tests

```
yarn build
yarn test:unit
yarn test:e2e
```

### Interactive Test with Cypress

```
yarn build

yarn cypress open
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Documentation

If you are integrating **standalone** version of the plugin (as a **cdn** link):

- See [Getting Started - Standalone](/docs/getting-started-standalone.md) for more information about plugin integration.

For integration as an **npm package**:

- See [Getting Started - npm](/docs/getting-started-npm.md) for more information about plugin integration.

For more information about individual components and all available options:

- [Search Box](/docs/components/search-box.md)

- [Search Results](/docs/components/search-results.md)

- [Recommendations](/docs/components/recommendations.md)

- [Tracing and Analytics](/docs/components/tracking.md)
