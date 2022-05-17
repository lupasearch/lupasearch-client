import { searchBoxInput } from "cypress/fields/SearchBox.fields.spec";
import { searchResultsInterceptions } from "cypress/utils/interceptions.utils";
import { searchResultsNoResults } from "../../fields/SearchResults.fields.spec";
import data from "../../fixtures/data.json";

describe("No Results Flag", () => {
  it("should display no results string", () => {
    cy.visit("/cypress/environments/index.html");
    searchResultsInterceptions(false, false, 0, 0);
    cy.get(searchBoxInput).type(`${data.input}{enter}`);
    cy.wait("@fetchResults");
    cy.get(searchResultsNoResults).should(
      "include.text",
      "There are no results for the query: shoes"
    );
  });

  it("should not include no results query parameter if flag is not configured", () => {
    cy.visit("/cypress/environments/index.html");
    searchResultsInterceptions(false, false, 0, 0);
    cy.get(searchBoxInput).type(`${data.input}{enter}`);
    cy.wait("@fetchResults");
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?q=${data.input}`);
    });
  });

  it("should include no results query parameter if flag is configured", () => {
    cy.visit("/cypress/environments/noResultsFlag.html");
    searchResultsInterceptions(false, false, 0, 0);
    cy.get(searchBoxInput).type(`${data.input}{enter}`);
    cy.wait("@fetchResults");
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?q=${data.input}&noResults=true`);
    });
  });

  it("should clear no results flag if results are obtain afterwards", () => {
    cy.visit("/cypress/environments/noResultsFlag.html");
    searchResultsInterceptions(false, false, 0, 0);
    cy.get(searchBoxInput).type(`${data.input}{enter}`);
    cy.wait("@fetchResults");
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?q=${data.input}&noResults=true`);
    });
    searchResultsInterceptions(false, false, 5, 200);
    cy.get(searchBoxInput).clear().type(`${data.input}{enter}`);
    cy.wait("@fetchResults");
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?q=${data.input}`);
    });
  });
});
