import { searchBoxInput } from 'cypress/fields/SearchBox.fields.spec'
import {
  searchResultsAllFilters,
  searchResultsCurrentFilters,
  searchResultsFilterLabel,
  searchResultsFilterValue
} from 'cypress/fields/Filters.fields.spec'
import { filtersInterceptions } from 'cypress/utils/interceptions.utils'
import data from '../../fixtures/data.json'
import { openCurrentFilters } from '../../utils/facet.utils'
import { facetFilterCommonTestSteps } from '../../common/CommonFilters'

describe('Filters', () => {
  beforeEach(() => {
    cy.visit('/cypress/environments/index.html')
    filtersInterceptions()
    cy.get(searchBoxInput).type(`${data.input}{enter}`)
    cy.wait('@fetchResults')
  })

  facetFilterCommonTestSteps()

  it("should display 'Current filters' panel", () => {
    openCurrentFilters()
    cy.get(searchResultsFilterValue).should('contain', 'CORE / NEO')
  })

  it("should remove 'Current filters' panel", () => {
    openCurrentFilters()
    filtersInterceptions()
    cy.get(searchResultsAllFilters).trigger('click')
    cy.get(searchResultsCurrentFilters).should('exist', false)
  })
})
