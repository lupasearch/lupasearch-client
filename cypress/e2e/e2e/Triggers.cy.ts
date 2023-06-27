import { searchBoxInput, searchBoxMainPanel } from 'cypress/fields/SearchBox.fields.spec'
import {
  triggerTestButton1,
  triggerTestButton2,
  triggerTestButtonInvalid
} from '../../fields/Helper.fields.spec'
import { searchResultsPageTitle } from '../../fields/SearchResults.fields.spec'
import { searchResultsInterceptions } from '../../utils/interceptions.utils'
import data from '../../fixtures/data.json'

describe('Triggers', () => {
  beforeEach(() => {
    cy.visit('/cypress/environments/triggers.html')
    searchResultsInterceptions()
  })

  it('should not navigate to result page if search input is too short', () => {
    cy.get(searchBoxInput).type(data.input.slice(0, 1))
    cy.get(triggerTestButton1).click()
    cy.get(searchResultsPageTitle).should('not.exist')
  })

  it('should not navigate to result page if search input is shorter than configured min length', () => {
    cy.get(searchBoxInput).type(data.input.slice(0, 2))
    cy.get(triggerTestButton1).click()
    cy.get(searchResultsPageTitle).should('not.exist')
  })

  it('should navigate to result page if search input is longer than configured min length', () => {
    cy.get(searchBoxInput).type(data.input.slice(0, 3))
    cy.get(triggerTestButton1).click()
    cy.wait('@fetchResults')
    cy.get(searchResultsPageTitle).should('exist')
  })

  it('should trigger search with either configured button', () => {
    cy.get(searchBoxInput).type(data.input.slice(0, 3))
    cy.get(triggerTestButton2).click()
    cy.wait('@fetchResults')
    cy.get(searchResultsPageTitle).should('exist')
  })

  it('should not trigger search with button that is not configured as search trigger', () => {
    cy.get(searchBoxInput).type(data.input.slice(0, 3))
    cy.get(triggerTestButtonInvalid).click()
    cy.get(searchResultsPageTitle).should('not.exist')
  })

  it('should close search panel after trigger is clicked', () => {
    cy.get(searchBoxInput).type(data.input.slice(0, 3))
    cy.get(triggerTestButton1).click()
    cy.wait('@fetchResults')
    cy.get(searchBoxMainPanel).should('not.exist')
  })
})
