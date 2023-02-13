import { searchBoxInput } from "cypress/fields/SearchBox.fields.spec";
import {
  customDynamicElement,
  searchResultsPageSelect,
  searchResultsRegularPrice,
  searchResultsShowMore,
} from "cypress/fields/SearchResults.fields.spec";
import { searchResultsInterceptions } from "cypress/utils/interceptions.utils";
import data from "../../fixtures/data.json";

describe("DynamicData", () => {
  beforeEach(() => {
    cy.visit("/cypress/environments/dynamicData.html");
    searchResultsInterceptions();
    cy.get(searchBoxInput).type(`${data.input}{enter}`);
    cy.wait("@fetchResults");
  });

  it("should display dynamic data html and a special class while the data is loading", () => {
    cy.get(customDynamicElement)
      .should("have.length", 5)
      .should("have.class", "lupa-loading-dynamic-data")
      .first()
      .should("have.text", "My index is loading");

    // Wait to finish loading dynamic data

    cy.get(customDynamicElement)
      .should("not.have.class", "lupa-loading-dynamic-data")
      .first()
      .should("have.text", "My index is 1");
  });

  it("should display regular price element once it is loaded", () => {
    cy.get(searchResultsRegularPrice)
      .should("exist")
      .last()
      .should("contain.text", "50,00 €");
  });

  it("should render dynamic data after a page change", () => {
    searchResultsInterceptions(false, true, 3);

    cy.get(searchResultsPageSelect)
      .find(searchResultsShowMore)
      .trigger("click");

    cy.get(customDynamicElement)
      .should("have.length", 3)
      .should("have.class", "lupa-loading-dynamic-data")
      .first()
      .should("have.text", "My index is loading");

    cy.get(customDynamicElement)
      .should("not.have.class", "lupa-loading-dynamic-data")
      .last()
      .should("have.text", "My index is 3");

    cy.get(searchResultsRegularPrice)
      .should("exist")
      .last()
      .should("contain.text", "30,00 €");
  });
});
