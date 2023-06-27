import { searchBoxInput } from 'cypress/fields/SearchBox.fields.spec'
import {
  searchResultsDidYouMeanTextLabel,
  searchResultsDidYouMeanTextValue,
  searchResultsListSelection,
  searchResultsPageNumber,
  searchResultsPageSelect,
  searchResultsPageSize,
  searchResultsPageTitle,
  searchResultsProductCard,
  searchResultsProductListCard,
  searchResultsProducts,
  searchResultsSelectDropdown,
  searchResultsShowMore,
  searchResultsSuggestedSearchTextLabel
} from 'cypress/fields/SearchResults.fields.spec'
import { getAndClick } from 'cypress/utils/getter.utils'
import { searchResultsInterceptions } from 'cypress/utils/interceptions.utils'
import data from '../../fixtures/data.json'

describe('SearchResults', () => {
  beforeEach(() => {
    cy.visit('/cypress/environments/index.html')
    searchResultsInterceptions()
    cy.get(searchBoxInput).type(`${data.input}{enter}`)
    cy.wait('@fetchResults')
  })

  it('should correctly display noResultsSuggestion', () => {
    cy.get(searchResultsSuggestedSearchTextLabel)
      .should('exist')
      .contains('No results found for this query: shoes ')
    cy.get(searchResultsPageTitle).contains("Search Query: 'shoes suggested'")
  })

  it('should correctly display didYouMean', () => {
    cy.wait(100)
    cy.get(searchResultsDidYouMeanTextLabel)
      .should('exist')
      .contains('Did you mean to search: shoes meant ')
  })

  it('should change query to didYouMean value', () => {
    cy.wait(100)
    cy.get(searchResultsDidYouMeanTextValue).trigger('click')
    cy.wait('@fetchResults')
    cy.get(searchBoxInput).should('have.value', 'shoes meant')
  })

  it('should have correct styling when layout is changed', () => {
    cy.get(searchResultsProductListCard).then(($el) => {
      expect($el[0].style.width).to.equal('33.3333%')
    })

    getAndClick(searchResultsListSelection, true)

    cy.wait(500)

    cy.get(searchResultsProductListCard).then(($el) => {
      expect($el[0].style.width).to.equal('100%')
    })
  })

  const checkParentChildrenCount = (parent: string, children: string, count: number) => {
    cy.get(parent).find(children).should('have.length', count)
  }

  it('should show correct number of products when changing page size', () => {
    cy.visit('/cypress/environments/index.html')
    searchResultsInterceptions(false, true, 10)

    cy.get(searchBoxInput).type(`${data.input}{enter}`)

    cy.wait('@fetchResults')

    checkParentChildrenCount(searchResultsProducts, searchResultsProductCard, 10)

    searchResultsInterceptions(false, true, 24)

    cy.get(searchResultsPageSize).find(searchResultsSelectDropdown).last().select('24')

    cy.wait(data.waitTimeMs)

    checkParentChildrenCount(searchResultsProducts, searchResultsProductCard, 24)
  })

  it('should correctly change page', () => {
    searchResultsInterceptions(false, true, 3)

    cy.get(searchResultsPageSelect)
      .find(searchResultsPageNumber)
      .first()
      .should('have.class', 'lupa-page-number-selected')

    cy.get(searchResultsPageSelect).find(searchResultsShowMore).trigger('click')

    cy.get(searchResultsPageSelect)
      .find(searchResultsPageNumber)
      .eq(1)
      .should('have.class', 'lupa-page-number-selected')

    cy.wait(data.waitTimeMs)

    cy.get(searchResultsProducts).find(searchResultsProductCard).should('have.length', 3)
  })
})
