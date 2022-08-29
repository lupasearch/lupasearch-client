import { searchBoxInput } from "cypress/fields/SearchBox.fields.spec";
import { searchResultsInterceptions } from "../../utils/interceptions.utils";
import data from "../../fixtures/data.json";

describe("SearchBoxNavigation", () => {
  beforeEach(() => {
    cy.visit("/cypress/environments/index.html");
    searchResultsInterceptions();
    cy.get(searchBoxInput).type(`${data.input}{enter}`);
    cy.wait("@fetchResults");
  });

  it("should keep search query text in input box after navigation to results page", () => {
    cy.get(searchBoxInput).should("have.value", data.input);
  });

  it("should load search query text value from query param", () => {
    cy.visit("/cypress/environments/index.html?q=query");
    cy.wait("@fetchResults");
    cy.get(searchBoxInput).should("have.value", "query");
  });
});
