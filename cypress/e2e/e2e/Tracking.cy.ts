import { EventData } from '@getlupa/client-sdk/Types'
import {
  searchBoxInput,
  searchBoxProduct,
  searchBoxSuggestion
} from 'cypress/fields/SearchBox.fields.spec'
import { searchResultsAddToCart } from 'cypress/fields/SearchResults.fields.spec'
import { getAndClick } from 'cypress/utils/getter.utils'
import { tracingInterceptions } from 'cypress/utils/interceptions.utils'
import data from '../../fixtures/data.json'

describe('Tracking', () => {
  beforeEach(() => {
    cy.visit('/cypress/environments/index.html')
    tracingInterceptions()

    cy.get(searchBoxInput).type(data.input)

    cy.waitTimes('@fetchSuggestions', 2)
    cy.waitTimes('@fetchDocument', 2)
  })

  it('should send the correct suggestion tracking data', () => {
    getAndClick(searchBoxSuggestion)

    cy.wait('@trackEvent').then((req) => {
      const body = req.request.body as EventData
      expect(body.itemId).to.equal(data.suggestions[0].suggestion)
      expect(body.name).to.equal('suggestionClick')
      expect(body.searchQuery).to.equal(data.input)
    })
  })

  it('should send the correct document tracking data', () => {
    getAndClick(searchBoxProduct, true)

    cy.wait('@trackEvent').then((req) => {
      const body = req.request.body as EventData
      expect(body.itemId).to.equal(data.document.items[4].id)
      expect(body.name).to.equal('itemClick')
      expect(body.searchQuery).to.equal(data.fullInput)
    })
  })

  it('should send the correct addToCard tracking data', () => {
    getAndClick(searchBoxSuggestion)

    cy.wait('@trackEvent')
    cy.wait('@fetchResults')

    getAndClick(searchResultsAddToCart)

    cy.wait('@trackEvent').then((req) => {
      const body = req.request.body as EventData
      expect(body.itemId).to.equal(data.document.items[0].id)
      expect(body.name).to.equal('addToCart')
      expect(body.searchQuery).to.equal(data.suggestions[0].suggestion)
    })
  })
})
