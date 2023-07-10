import { searchBoxInput } from 'cypress/fields/SearchBox.fields.spec'
import { filtersInterceptions } from 'cypress/utils/interceptions.utils'
import { searchResultsFacetLabel } from '../../fields/Filters.fields.spec'
import data from '../../fixtures/data.json'

describe('DropdownFacets', () => {
  beforeEach(() => {
    cy.visit('/cypress/environments/excludeFacets.html')
    filtersInterceptions()
    cy.get(searchBoxInput).type(`${data.input}{enter}`)
    cy.wait('@fetchResults')
  })

  it('should not display excluded brand facet', () => {
    cy.get(searchResultsFacetLabel).each((label) => expect(label.text()).to.not.include('Brand'))
  })

  it('should display remaining facets', () => {
    cy.get(searchResultsFacetLabel).should('have.length', 1)
  })
})
