import { searchBoxInput } from 'cypress/fields/SearchBox.fields.spec'
import {
  searchResultsPageSelect,
  searchResultsPrice,
  searchResultsProductCard,
  searchResultsProducts,
  searchResultsRegularPrice,
  searchResultsShowMore,
  searchResultsSortDropdown
} from 'cypress/fields/SearchResults.fields.spec'
import { searchResultsInterceptions } from 'cypress/utils/interceptions.utils'

import data from '../../fixtures/data.json'

const sortedItems = data.document.items.sort((a, b) =>
  Number(a.discount_price) > Number(b.discount_price) ? 1 : -1
)

const sortValueAscending = 'Price (Low to High)'

const ascendingKey = 'priceAsc'
const relevanceKey = 'relevance'

describe('SearchResultsSorting', () => {
  beforeEach(() => {
    cy.visit('/cypress/environments/index.html')
    searchResultsInterceptions(true)
    cy.get(searchBoxInput).type(`${data.input}{enter}`)
    cy.wait('@fetchResults')

    cy.get(searchResultsSortDropdown).filter(':visible').select(sortValueAscending)
    cy.wait('@fetchResults')
  })

  it('should sort products', () => {
    const prices = cy
      .get(searchResultsProducts)
      .find(searchResultsProductCard)
      .find(`${searchResultsRegularPrice}, ${searchResultsPrice}`)

    prices.each((price, index) => {
      const expectedPrice = sortedItems[index].discount_price
      expect(price.text()).to.contain(expectedPrice + ' €')
    })
  })

  it('should add selected sort to query parameters', () => {
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?q=${data.input}&s=${ascendingKey}`)
    })
  })

  it('should clear sort params if a new query is issued', () => {
    cy.get(searchBoxInput).clear().type(`${data.input}{enter}`)
    cy.wait('@fetchResults')

    cy.get(searchResultsSortDropdown).filter(':visible').should('have.value', relevanceKey)

    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?q=${data.input}`)
    })
  })

  it('should keep sort parameters if a new page is loaded', () => {
    cy.get(searchResultsPageSelect).find(searchResultsShowMore).trigger('click')

    cy.get(searchResultsSortDropdown).filter(':visible').should('have.value', ascendingKey)

    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?q=${data.input}&s=${ascendingKey}&p=2`)
    })
  })
})
