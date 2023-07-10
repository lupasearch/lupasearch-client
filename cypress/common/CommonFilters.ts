import {
  searchResultFacetContent,
  searchResultFacetDisplay,
  searchResultFacetTerm,
  searchResultsCurrentFiltersMobileToolbar,
  searchResultsFacetTermValues,
  searchResultsTermFilter
} from 'cypress/fields/Filters.fields.spec'
import { getAndClick } from 'cypress/utils/getter.utils'
import { filtersInterceptions } from 'cypress/utils/interceptions.utils'
import data from '../fixtures/data.json'
import {
  searchResultsProductCard,
  searchResultsProducts
} from 'cypress/fields/SearchResults.fields.spec'
import { getAndTriggerFacet } from '../utils/facet.utils'
import { clickEmptySpace } from 'cypress/utils/click.utils'

export const facetFilterCommonTestSteps = (): void => {
  it('should expand clicked filter', () => {
    const filter = getAndClick(searchResultFacetDisplay)

    filter.find(searchResultFacetContent).should('exist', true)
  })

  it('should change class when checkbox is clicked', () => {
    const term = getAndTriggerFacet()

    term.find('span').should('have.class', 'checked')
  })

  it('should display filtered products', () => {
    filtersInterceptions({ filters: { brand: ['CORE / NEO'] }, slice: 2 })

    getAndTriggerFacet()

    cy.get(searchResultsProducts).find(searchResultsProductCard).should('have.length', 3)

    filtersInterceptions({ slice: 3 })

    clickEmptySpace()

    const priceFacet = cy.get(searchResultFacetDisplay).last()
    priceFacet.trigger('click')

    priceFacet.find('div.vue-slider-dot').first().type('{rightarrow}')

    cy.get(searchResultsProducts).find(searchResultsProductCard).should('have.length', 2)
  })

  it('should filter facets', () => {
    getAndClick(searchResultFacetDisplay)

    cy.get(searchResultsTermFilter).type(`performance`)

    cy.get(searchResultsFacetTermValues).find(searchResultFacetTerm).should('have.length', 4)
  })

  it('should display current filter section on mobile page', () => {
    filtersInterceptions({ filters: { brand: ['CORE / NEO'] }, slice: 2 })

    getAndTriggerFacet()
    const [x, y] = data.mobileResolution
    cy.viewport(x, y)
    cy.wait('@fetchResults')

    cy.get(searchResultsCurrentFiltersMobileToolbar).should('exist', true)
    cy.get(searchResultsCurrentFiltersMobileToolbar).should('include.text', '(1)')
  })
}
