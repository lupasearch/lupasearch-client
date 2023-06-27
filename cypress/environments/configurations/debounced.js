import { trackingOptions, searchBoxOptions, searchResultsOptions } from './base.js'

const lupaSearch = window.lupaSearch

lupaSearch.tracking(trackingOptions)
lupaSearch.searchBox({ ...searchBoxOptions, debounce: 750 })
lupaSearch.searchResults(searchResultsOptions)
