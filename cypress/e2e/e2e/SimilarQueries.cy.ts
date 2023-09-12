import { searchBoxInput } from 'cypress/fields/SearchBox.fields.spec'
import { searchResultsProducts } from 'cypress/fields/SearchResults.fields.spec'
import {
  simiarQueryValue,
  similarQueries,
  similarQueryCorssed,
  similarQueryLabel
} from 'cypress/fields/SimilarQueries.fields.spec'
import { getTrimedText } from 'cypress/utils/getter.utils'
import { fetchSimilarQueriesResultsInterception } from 'cypress/utils/interceptions.utils'
import data from '../../fixtures/data.json'

describe('SimilarQueries.spec', () => {
  beforeEach(() => {
    cy.visit('/cypress/environments/index.html')
    fetchSimilarQueriesResultsInterception()
    cy.get(searchBoxInput).type(`${data.similarQueriesInput}{enter}`)
    cy.wait('@fetchResults')
  })

  it('should correctly display similar query results', () => {
    cy.get(similarQueries).should('exist')
    cy.get(searchResultsProducts).should(
      'have.length',
      data.similarQueriesDocument.similarQueries.length
    )
  })

  it('should correctly display similar query labels', () => {
    cy.get(similarQueryLabel).each((el, index) => {
      // nbsp character
      const text = el.text().replace(/\u00a0/g, ' ')
      expect(text).contains(
        `Search results for phrase shoes unsupported (${data.similarQueriesDocument.similarQueries[index].count})`
      )
    })
  })

  it('should change search query when similar query is clicked', () => {
    cy.get(simiarQueryValue).first().trigger('click')
    cy.wait('@fetchResults')

    cy.get(searchBoxInput).should('have.value', 'shoes')
  })
})
