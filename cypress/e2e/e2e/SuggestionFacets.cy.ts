import {
  searchResultsFilterLabel,
  searchResultsFilterValue
} from 'cypress/fields/Filters.fields.spec'
import {
  searchBoxInput,
  searchBoxSuggestion,
  searchBoxSuggestionFacet,
  searchBoxSuggestionFacetLabel,
  searchBoxSuggestionFacetValue,
  searchBoxSuggestionValue
} from 'cypress/fields/SearchBox.fields.spec'
import { filtersInterceptions, searchBoxInterceptions } from 'cypress/utils/interceptions.utils'
import data from '../../fixtures/data.json'

describe('SuggestionFacets', () => {
  beforeEach(() => {
    cy.visit('/cypress/environments/suggestionFacets.html')
    searchBoxInterceptions()
    cy.get(searchBoxInput).type(data.input)
    cy.waitTimes('@fetchFacetSuggestions', 2)
  })

  it('should render all suggestion values', () => {
    cy.get(searchBoxSuggestion).its('length').should('eq', 6)
  })

  it('should render all suggestion titles', () => {
    const elements = cy.get(searchBoxSuggestionValue)
    elements
      .then(($els) => Cypress._.map(Cypress.$.makeArray($els), 'innerText'))
      .should('deep.equal', [
        ...Array(4).fill(data.facetSuggestions[0].suggestion),
        data.facetSuggestions[1].suggestion,
        data.facetSuggestions[2].suggestion
      ])
  })

  it('should render all facet values', () => {
    const elements = cy.get(searchBoxSuggestionFacet)
    elements.its('length').should('eq', 3)

    const labels = cy.get(searchBoxSuggestionFacetLabel)
    labels
      .then(($els) => Cypress._.map(Cypress.$.makeArray($els), 'innerText'))
      .should('deep.equal', [...Array(3).fill('Brand:')])

    const values = cy.get(searchBoxSuggestionFacetValue)
    values
      .then(($els) => Cypress._.map(Cypress.$.makeArray($els), 'innerText'))
      .should('deep.equal', ['Footwear', 'CORE / NEO', 'ORIGINALS'])
  })

  it('should apply category facet to filters', () => {
    filtersInterceptions({ filters: { category: ['Footwear'] }, slice: 2 })
    cy.get(searchBoxSuggestionFacet).first().parent().trigger('click')
    cy.wait('@fetchResults')
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?q=shoes&f.category=Footwear`)
    })
    cy.get(searchResultsFilterLabel).first().should('include.text', 'Category:')
    cy.get(searchResultsFilterValue).first().should('include.text', 'Footwear')
  })
})
