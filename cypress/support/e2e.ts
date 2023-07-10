/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Type extensions for custom commands:

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Helper method to wait for multiple requests to occur.
       *
       * @func cy.waitTimes
       * @param alias - {string|number} the alias or seconds to wait for
       * @param count - {number} number of times to wait for
       */
      waitTimes(alias: string | number, count: number): Chainable<Element>
      hasBeenCalledTimes(alias: string, count: number): Chainable<Element>
    }
  }
}
