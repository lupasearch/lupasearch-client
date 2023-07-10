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

    cy.get(similarQueryCorssed).each((el, index) => {
      const text = getTrimedText(el.text())
      switch (index + 1) {
        case 1:
          expect(text).to.be.equal('unsupported')
          break
        case 2:
          expect(text).to.be.equal('shoes')
          break
        default:
          break
      }
    })
  })

  it('should change search query when similar query is clicked', () => {
    cy.get(simiarQueryValue).first().trigger('click')
    cy.wait('@fetchResults')

    cy.get(searchBoxInput).should('have.value', 'shoes')
  })
})
