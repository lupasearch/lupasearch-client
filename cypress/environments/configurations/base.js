export const trackingOptions = {
  trackBase: true,
  trackSession: true,
  trackUser: true
}

export const searchBoxOptions = {
  options: {
    environment: 'staging'
  },
  inputSelector: '#searchBox',
  minInputLength: 2,
  showTotalCount: true,
  idKey: 'id',
  inputAttributes: {
    name: 'q'
  },
  labels: {
    placeholder: 'Search for products...',
    noResults: 'There are no results found.',
    moreResults: 'Show more results',
    currency: '€',
    defaultFacetLabel: 'Brand:'
  },
  links: {
    searchResults: ''
  },
  panels: [
    {
      type: 'suggestion',
      queryKey: 'suggestion',
      highlight: true,
      limit: 10
    },
    {
      type: 'document',
      queryKey: 'document',
      limit: 5,
      searchBySuggestion: true,
      links: {
        details: '{url}'
      },
      titleKey: 'name',
      idKey: 'id',
      elements: [
        {
          type: 'image',
          placeholder:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/638px-Placeholder_view_vector.svg.png'
        },
        {
          type: 'title',
          key: 'product_name'
        },
        {
          type: 'regularPrice',
          key: 'regular_price',
          display: (doc) => doc.discount_price < doc.regular_price
        },
        {
          type: 'price',
          key: 'discount_price'
        }
      ]
    }
  ],
  history: {
    labels: {
      clear: 'Clear History'
    }
  }
}

export const searchResultsOptions = {
  options: {
    environment: 'staging'
  },
  queryKey: 'results',
  containerSelector: '#searchResultsContainer',
  labels: {
    pageSize: 'Page size:',
    sortBy: 'Sort by:',
    itemCount: 'Items {1} of {2}',
    currency: '€',
    showMore: 'Show more',
    emptyResults: 'There are no results for the query:',
    mobileFilterButton: 'Filter',
    htmlTitleTemplate: "Search Query: '{1}'",
    noResultsSuggestion: 'No results found for this query: {1}',
    didYouMean: 'Did you mean to search: {1}',
    similarQuery: 'Search results for phrase {1}',
    similarQueries: 'Similar queries:'
  },
  grid: {
    columns: {
      xl: 3,
      l: 3,
      md: 3,
      sm: 3,
      xs: 2
    }
  },
  pagination: {
    sizeSelection: {
      position: {
        top: true,
        bottom: false
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
  },
  sort: [
    {
      key: 'relevance',
      label: 'Relevance',
      config: [{ _relevance: 'desc' }]
    },
    {
      key: 'nameDesc',
      label: 'Name (Descending)',
      config: [{ product_name: 'desc' }]
    },
    {
      key: 'nameAsc',
      label: 'Name (Ascending)',
      config: [{ product_name: 'asc' }]
    },
    {
      key: 'priceDesc',
      label: 'Price (High to Low)',
      config: [{ discount_price: 'desc' }]
    },
    {
      key: 'priceAsc',
      label: 'Price (Low to High)',
      config: [{ discount_price: 'asc' }]
    },
    {
      key: 'discountDesc',
      label: 'Biggest Discount',
      config: [{ discount: 'desc' }]
    }
  ],
  filters: {
    currentFilters: {
      visibility: {
        mobileSidebar: true,
        mobileToolbar: true
      },
      labels: {
        title: 'Current filters:',
        clearAll: 'Clear all'
      }
    },
    facets: {
      labels: {
        title: 'Filters:',
        showAll: 'Show more',
        facetFilter: 'Filter...'
      },
      hierarchy: {
        maxInitialLevel: 2,
        topLevelValueCountLimit: 0,
        filterable: true
      },
      filterable: {
        minValues: 5
      },
      facetValueCountLimit: 15,
      showDocumentCount: true
    }
  },
  isInStock: () => {
    return true
  },
  badges: {},
  links: {
    details: '{url}'
  },
  idKey: 'id',
  elements: [
    {
      type: 'image',
      placeholder:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/638px-Placeholder_view_vector.svg.png'
    },
    {
      type: 'title',
      key: 'product_name',
      isHtml: false,
      link: false,
      maxLines: 2
    },
    {
      type: 'custom',
      key: 'id',
      className: 'lupa-custom-id'
    },
    {
      type: 'custom',
      key: 'brand',
      className: 'lupa-custom-brand'
    },
    {
      type: 'customHtml',
      display: (doc) => doc.discount_price < doc.regular_price,
      html: (doc) => {
        const discountPrice = parseFloat(doc.discount_price)?.toFixed(2)
        const regularPrice = parseFloat(doc.regular_price)?.toFixed(2)
        const discount = `<span  data-cy="lupa-search-results-product-price" class="lupa-discount">${discountPrice} €</span>`
        const regular = `<span data-cy="lupa-search-results-product-original-price" class="lupa-regular">${regularPrice} €</span>`
        return discount + regular
      }
    },
    {
      type: 'customHtml',
      display: (doc) => doc.discount_price >= doc.regular_price,
      html: (doc) => {
        const price = parseFloat(doc.regular_price)?.toFixed(2)
        return `<span data-cy="lupa-search-results-product-regular-price" class="lupa-final">${price} €</span>`
      }
    },
    {
      type: 'addToCart',
      labels: {
        addToCart: 'Add to Cart'
      },
      action: () => {
        return new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }
  ],
  breadcrumbs: [{ label: 'Main', link: '/' }, { label: 'Search: {1}' }]
}
