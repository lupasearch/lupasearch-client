import {
  searchBoxDocumentPanel,
  searchBoxInput,
  searchBoxMainPanel,
  searchBoxMoreResults,
  searchBoxProduct,
  searchBoxSuggestion,
  searchBoxSuggestions
} from 'cypress/fields/SearchBox.fields.spec'
import { getAndClick } from 'cypress/utils/getter.utils'
import { searchBoxInterceptions } from 'cypress/utils/interceptions.utils'
import data from '../../fixtures/data.json'
import { clickEmptySpace } from '../../utils/click.utils'

describe('SearchBox', () => {
  beforeEach(() => {
    cy.visit('/cypress/environments/index.html')
    searchBoxInterceptions()

    cy.get(searchBoxInput).type(data.input)

    cy.waitTimes('@fetchSuggestions', 2)
    cy.waitTimes('@fetchDocument', 2)
  })

  it('close main panel when user clicks outside', () => {
    cy.get(searchBoxMainPanel)

    clickEmptySpace()

    cy.get(searchBoxMainPanel).should('not.exist')
  })

  it('when TAB is clicked, input should be filled with suggestion', () => {
    cy.get(searchBoxMainPanel).trigger('keydown', { key: 'Tab' })

    cy.get('input').should('have.value', data.suggestions[0].suggestion)
  })

  it('main panel should disappear when suggestion is selected', () => {
    cy.get(searchBoxSuggestion).should('have.lengthOf', data.suggestions.length)

    getAndClick(searchBoxSuggestion)

    cy.get(searchBoxMainPanel).should('not.exist')
  })

  it('should highlight suggestions/products/blogs when navigating with arrow keys', () => {
    cy.get(searchBoxInput).trigger('click').trigger('keydown', {
      key: 'ArrowDown'
    })

    cy.get(searchBoxSuggestions)
      .find(searchBoxSuggestion)
      .first()
      .should('have.class', 'lupa-suggestion-highlighted')

    data.suggestions.forEach(() => {
      cy.get(searchBoxInput).trigger('keydown', {
        key: 'ArrowDown'
      })
    })

    cy.get(searchBoxDocumentPanel)
      .first()
      .find(searchBoxProduct)
      .first()
      .should('have.class', 'lupa-search-box-product-highlighted')

    data.document.items.forEach(() => {
      cy.get(searchBoxInput).trigger('keydown', {
        key: 'ArrowDown'
      })
    })
  })

  it('should show correct item count in the show more label', () => {
    cy.get(searchBoxMoreResults).should('contain.text', `${data.document.total}`)
  })
})
