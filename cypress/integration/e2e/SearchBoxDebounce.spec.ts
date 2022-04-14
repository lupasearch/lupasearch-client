import {
  searchBoxInput,
  searchBoxMainPanel,
} from "cypress/fields/SearchBox.fields.spec";
import { searchBoxInterceptions } from "../../utils/interceptions.utils";

describe("SearchBoxDebounce", () => {
  it("should only issue one request for full typed input, if debounce is configured", () => {
    cy.visit("/cypress/environments/debounced.html");
    searchBoxInterceptions();

    cy.get(searchBoxInput).type(`shoes`);
    cy.waitTimes("@fetchDocument", 1);
    cy.wait("@fetchSuggestions");
    cy.hasBeenCalledTimes("@fetchDocument", 1);
    cy.hasBeenCalledTimes("@fetchSuggestions", 1);
    cy.get(searchBoxMainPanel).should("exist");
  });

  it("should issue request with each typed letter, if debounce is not configured", () => {
    cy.visit("/cypress/environments/index.html");
    searchBoxInterceptions();

    cy.get(searchBoxInput).type(`shoes`);
    cy.waitTimes("@fetchDocument", 4);
    cy.waitTimes("@fetchSuggestions", 4);
    cy.hasBeenCalledTimes("@fetchDocument", 4);
    cy.hasBeenCalledTimes("@fetchSuggestions", 4);
    cy.get(searchBoxMainPanel).should("exist");
  });
});
