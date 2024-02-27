import { PreconfiguredSearchContainerOptions } from '@/types/PreconfiguredSearchContainerOptions'
import {
  addFieldIfKeyExists,
  displayDiscountedPriceSection,
  displayRegularPriceSection,
  escapeHtml,
  getAdditionalElements,
  toMaxDecimalPlaces
} from './configuratorUtils'
import {
  AnchorPosition,
  Environment,
  SearchBoxOptions,
  SearchBoxPanelType,
  SearchResultBadgeType,
  SearchResultsOptions
} from '@getlupa/vue'
import { SearchBoxPanel } from '@getlupa/vue/dist/src/types/search-box/SearchBoxPanel'
import {
  ProductGrid,
  SearchResultsFilterOptions
} from '@getlupa/vue/dist/src/types/search-results/SearchResultsOptions'

const getSearchBoxComponent = ({
  searchBoxOptions,
  labels,
  panelOptions,
  redirections,
  placeholderImage
}: PreconfiguredSearchContainerOptions): SearchBoxOptions => {
  const panels = [
    ...(panelOptions?.suggestionPanel
      ? [
          {
            type: SearchBoxPanelType.SUGGESTION,
            queryKey: searchBoxOptions.suggestionQueryKey,
            highlight: true,
            limit: 8,
            labels: {
              topResultsTitle: labels?.searchBox?.topSuggestionsTitle
            }
          }
        ]
      : []),
    ...(panelOptions?.docPanel
      ? [
          {
            type: SearchBoxPanelType.DOCUMENT,
            queryKey: searchBoxOptions.documentQueryKey,
            limit: 5,
            elements: [
              {
                type: 'image',
                placeholder: placeholderImage,
                key: searchBoxOptions.fields?.imageKey,
                baseUrl: searchBoxOptions.fields?.baseImageUrl
              },
              {
                type: 'title',
                key: searchBoxOptions.fields?.titleKey,
                maxLines: 2
              },
              {
                type: 'regularPrice',
                key: searchBoxOptions.fields?.regularPriceKey,
                display: (doc: Record<string, string>) =>
                  searchBoxOptions.fields?.regularPriceKey &&
                  searchBoxOptions.fields?.discountPriceKey &&
                  parseFloat(doc[searchBoxOptions.fields?.regularPriceKey]) >
                    parseFloat(doc[searchBoxOptions.fields?.discountPriceKey])
              },
              {
                type: 'price',
                key: searchBoxOptions.fields?.discountPriceKey
              }
            ]
          }
        ]
      : [])
  ] as SearchBoxPanel[]
  return {
    inputSelector: searchBoxOptions.inputSelector,
    options: {
      environment: (searchBoxOptions.environment as Environment) ?? ('production' as Environment),
      customUrl: searchBoxOptions.customUrl,
      customBaseUrl: searchBoxOptions.customBaseUrl,
      customPayload: searchBoxOptions.customPayload,
      customHeaders: searchBoxOptions.customHeaders
    },
    showTotalCount: true,
    expandOnSinglePanel: true,
    minInputLength: searchBoxOptions.fields?.minInputLength ?? 0,
    debounce: 250,
    labels: labels?.searchBox,
    links: {
      searchResults: ''
    },
    panels,
    redirections,
    history: {
      labels: {
        clear: labels?.searchBox?.clearHistory
      }
    }
  }
}

const getSearchResultsComponent = ({
  searchResultOptions,
  labels,
  redirections,
  placeholderImage,
  configuratorOverrides,
  callbacks,
  additionalFields
}: PreconfiguredSearchContainerOptions): SearchResultsOptions => {
  const filters: SearchResultsFilterOptions = searchResultOptions.showFacets
    ? {
        currentFilters: {
          visibility: {
            mobileSidebar: true,
            mobileToolbar: true
          },
          labels: {
            title: '',
            clearAll: labels?.facets?.clearAll
          }
        },
        facets: {
          labels: {
            title: labels?.facets?.facetTitle,
            showAll: labels?.facets?.showAll,
            facetFilter: labels?.facets?.facetFilter,
            facetClear: labels?.facets?.facetClear
          },
          filterable: {
            minValues: 5
          },
          hierarchy: {
            maxInitialLevel: 2,
            topLevelValueCountLimit: 5,
            filterable: true
          },
          stats: {
            slider: true,
            inputs: true,
            labels: {
              from: '',
              to: ''
            }
          },
          facetValueCountLimit: 8,
          showDocumentCount: true,
          style: {
            type: 'sidebar'
          }
        }
      }
    : {}
  const columns = searchResultOptions.gridConfiguration ?? {
    xl: searchResultOptions.maxColumns ?? 4,
    l: searchResultOptions.maxColumns ?? 3,
    md: searchResultOptions.maxColumns ?? 3,
    sm: searchResultOptions.maxColumns ?? 2,
    xs: searchResultOptions.maxColumns ?? 1
  }

  const badges = {
    badges: {
      anchor: 'tr' as AnchorPosition,
      elements: [
        ...(searchResultOptions.showRelevance && [
          {
            key: '',
            type: 'customHtml' as SearchResultBadgeType,
            className: 'relevance',
            html: (doc: Record<string, string>) =>
              `${toMaxDecimalPlaces(escapeHtml(doc._relevance), 3)}`,
            display: (doc: Record<string, string>) => Boolean(doc._relevance !== undefined)
          }
        ]),
        ...((searchResultOptions.boostedMarker?.enabled ?? false) && [
          {
            key: '',
            type: 'customHtml' as SearchResultBadgeType,
            className: 'boosted-marker',
            html: () => `${escapeHtml(searchResultOptions.boostedMarker?.label)}`,
            display: (doc: Record<string, unknown>) => doc._boosted === true
          }
        ])
      ]
    }
  }

  return {
    options: {
      environment:
        (searchResultOptions.environment as Environment) ?? ('production' as Environment),
      customUrl: searchResultOptions.customUrl,
      customBaseUrl: searchResultOptions.customBaseUrl,
      customPayload: searchResultOptions.customPayload,
      customHeaders: searchResultOptions.customHeaders,
      onError: searchResultOptions.errorHandler
    },
    queryKey: searchResultOptions.queryKey,
    containerSelector: searchResultOptions.containerSelector,
    searchTitlePosition: 'search-results-top',
    titleKey: searchResultOptions.fields?.titleKey,
    labels: labels?.searchResults,
    grid: {
      columns
    } as ProductGrid,
    pagination: {
      sizeSelection: {
        position: {
          top: true,
          bottom: false
        },
        sizes: [12, 24, 36, 48]
      },
      pageSelection: {
        position: {
          top: false,
          bottom: true
        },
        displayMobile: 3,
        display: 5
      }
    },
    filters,
    toolbar: {
      layoutSelector: false,
      itemSummary: true,
      clearFilters: false
    },
    isInStock: (): boolean => {
      return true
    },
    ...badges,
    links: {
      details: searchResultOptions.fields?.productUrl
        ? `{${searchResultOptions.fields?.productUrl}}`
        : undefined
    },
    callbacks,
    routingBehavior: callbacks ? 'event' : 'direct-link',
    idKey: 'id',
    elements: [
      {
        type: 'image',
        placeholder: placeholderImage,
        key: searchResultOptions.fields?.imageKey,
        baseUrl: searchResultOptions.fields?.baseImageUrl,
        display: () => searchResultOptions.fields?.imageKey
      },
      addFieldIfKeyExists('_emphasis', searchResultOptions.fields?.emphasizedField, {
        type: 'custom',
        className: 'lupa-custom-emphasis',
        key: searchResultOptions.fields?.emphasizedField,
        display: () => true
      }),
      {
        type: 'title',
        key: searchResultOptions.fields?.titleKey,
        maxLines: searchResultOptions.maxLines ?? 2,
        display: (doc: Record<string, string>) =>
          searchResultOptions.fields?.titleKey && Boolean(doc[searchResultOptions.fields?.titleKey])
      },
      ...getAdditionalElements(additionalFields),
      addFieldIfKeyExists('_discountPrice', searchResultOptions.fields?.discountPriceKey, {
        key: searchResultOptions.fields?.discountPriceKey,
        type: 'customHtml',
        className: 'lupa-price lupa-price-discounted',
        display: (doc: Record<string, string>) =>
          displayDiscountedPriceSection(doc, searchResultOptions),
        html: (doc: Record<string, string>) => {
          const currency = escapeHtml(searchResultOptions.fields?.currency || '€')
          const discountPrice = parseFloat(
            doc[searchResultOptions.fields?.discountPriceKey ?? '']
          )?.toFixed(2)
          const regularPrice = parseFloat(
            doc[searchResultOptions.fields?.regularPriceKey ?? '']
          )?.toFixed(2)
          const discount = `<span class="lupa-discount">${escapeHtml(
            discountPrice
          )} ${currency}</span>`
          const regular = `<span class="lupa-regular">${escapeHtml(
            regularPrice
          )} ${currency}</span>`
          return discount + regular
        }
      }),
      addFieldIfKeyExists('_regularPrice', searchResultOptions.fields?.regularPriceKey, {
        key: searchResultOptions.fields?.regularPriceKey,
        type: 'customHtml',
        className: 'lupa-price lupa-price-single',
        display: (doc: Record<string, string>) =>
          displayRegularPriceSection(doc, searchResultOptions),
        html: (doc: Record<string, string>) => {
          const currency = escapeHtml(searchResultOptions.fields?.currency || '€')
          const price = parseFloat(
            doc[searchResultOptions.fields?.regularPriceKey ?? ''] ??
              doc[searchResultOptions.fields?.discountPriceKey ?? '']
          )?.toFixed(2)
          return `<span class="lupa-final">${escapeHtml(price)} ${currency}</span>`
        }
      })
    ],
    breadcrumbs: [],
    sort: [],
    redirections,
    ...configuratorOverrides
  }
}

export default {
  getSearchBoxComponent,
  getSearchResultsComponent
}
