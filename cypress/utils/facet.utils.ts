import {
  searchResultFacetContent,
  searchResultFacetDisplay,
  searchResultFacetTerm,
  searchResultsCurrentFilters
} from '../fields/Filters.fields.spec'
import { getAndClick } from './getter.utils'
import { filtersInterceptions } from './interceptions.utils'

export const openCurrentFilters = (): void => {
  filtersInterceptions({ filters: { brand: ['CORE / NEO'] } })

  getAndTriggerFacet()

  cy.get(searchResultsCurrentFilters).should('exist', true)
}

export const getAndTriggerFacet = (): Cypress.Chainable<JQuery<HTMLElement>> => {
  const filter = getAndClick(searchResultFacetDisplay)

  const term = filter.find(searchResultFacetContent).find(searchResultFacetTerm).first()
  term.trigger('click')
  return term
}
