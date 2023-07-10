import { FilterGroup, Document } from '@getlupa/client-sdk/Types'
import data from '../fixtures/data.json'

export type InterceptionFilterInfo = {
  filters?: FilterGroup
  slice?: number
}

export const tracingInterceptions = (): void => {
  searchBoxInterceptions()
  fetchAdditionalPanelsInterception()
  fetchResultsInterception()
}

export const searchBoxInterceptions = (): void => {
  fetchSuggestionsInterception()
  fetchDocumentInterception()
  trackEventInterception()
  fetchFacetSuggestionsInterception()
}

export const searchResultsInterceptions = (
  sort?: boolean,
  more?: boolean,
  limit?: number,
  total?: number
): void => {
  fetchAdditionalPanelsInterception()

  let items = data.document.items
  if (more) {
    for (let i = 0; i < 5; i++) {
      items = items.concat(data.document.items)
    }
  }
  if (sort) {
    items = items.sort((a, b) =>
      Number(a.final_cardholder_price) > Number(b.final_cardholder_price) ? 1 : -1
    )
  }
  fetchResultsInterception(items, limit, total)
}

export const filtersInterceptions = (filterInfo?: InterceptionFilterInfo): void => {
  if (filterInfo) {
    fetchResultsWithFilterInterception(filterInfo)
  } else {
    fetchResultsInterception()
  }
}

export const fetchSimilarQueriesResultsInterception = (): void => {
  cy.intercept(
    {
      method: 'POST',
      url: '*/query/results'
    },
    data.similarQueriesDocument
  ).as('fetchResults')
}

const fetchAdditionalPanelsInterception = (): void => {
  cy.intercept(
    {
      method: 'POST',
      url: '*/query/additionalPanels'
    },
    data.document
  ).as('fetchAdditionalPanels')
}
const fetchResultsInterception = (
  items: Document[] = data.document.items,
  limit = 5,
  total = 2000
): void => {
  cy.intercept(
    {
      method: 'POST',
      url: '*/query/results'
    },
    {
      ...data.document,
      items: items.slice(0, limit),
      limit,
      total
    }
  ).as('fetchResults')
}
const fetchResultsWithFilterInterception = (filterInfo: InterceptionFilterInfo): void => {
  cy.intercept(
    {
      method: 'POST',
      url: '*/query/results'
    },
    {
      ...data.document,
      filters: filterInfo.filters || {},
      items: data.document.items.slice(filterInfo.slice || 0)
    }
  ).as('fetchResults')
}
const fetchSuggestionsInterception = (): void => {
  cy.intercept(
    {
      method: 'POST',
      url: '**/query/suggestion'
    },
    data.suggestions
  ).as('fetchSuggestions')
}

const fetchFacetSuggestionsInterception = (): void => {
  cy.intercept(
    {
      method: 'POST',
      url: '**/query/facet-suggestion'
    },
    data.facetSuggestions
  ).as('fetchFacetSuggestions')
}

const fetchDocumentInterception = (): void => {
  cy.intercept(
    {
      method: 'POST',
      url: '**/query/document'
    },
    data.document
  ).as('fetchDocument')
}
const trackEventInterception = (): void => {
  cy.intercept(
    {
      method: 'POST',
      url: '*/events'
    },
    data.eventResponse
  ).as('trackEvent')
}
