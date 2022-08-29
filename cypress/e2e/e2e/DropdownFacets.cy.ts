import { searchBoxInput } from "cypress/fields/SearchBox.fields.spec";
import { filtersInterceptions } from "cypress/utils/interceptions.utils";
import { facetFilterCommonTestSteps } from "../../common/CommonFilters";
import {
  searchResultsFacetLabel,
  searchResultsFacetsSummaryClear,
  searchResultsSingleFacetClear,
} from "../../fields/Filters.fields.spec";
import {
  searchResultsProductCard,
  searchResultsProducts,
} from "../../fields/SearchResults.fields.spec";
import data from "../../fixtures/data.json";
import { clickEmptySpace } from "../../utils/click.utils";
import { getAndTriggerFacet } from "../../utils/facet.utils";

describe("DropdownFacets", () => {
  beforeEach(() => {
    cy.visit("/cypress/environments/dropdownFacets.html");
    filtersInterceptions();

    cy.get(searchBoxInput).type(`${data.input}{enter}`);

    cy.wait("@fetchResults");
  });

  facetFilterCommonTestSteps();

  it("should clear single facet category", () => {
    filtersInterceptions({ filters: { brand: ["ORIGINALS"] }, slice: 2 });
    getAndTriggerFacet();
    cy.get(searchResultsProducts)
      .find(searchResultsProductCard)
      .should("have.length", 3);

    cy.get(searchResultsFacetLabel)
      .first()
      .should("have.class", "lupa-has-filter");

    filtersInterceptions();
    cy.get(searchResultsSingleFacetClear).click();
    cy.wait("@fetchResults");

    cy.get(searchResultsFacetLabel)
      .first()
      .should("not.have.class", "lupa-has-filter");
  });

  it("should clear all facets with summary label", () => {
    filtersInterceptions({ filters: { categories: ["Knygos"] }, slice: 2 });
    getAndTriggerFacet();
    cy.wait("@fetchResults");
    clickEmptySpace();
    filtersInterceptions();
    cy.get(searchResultsFacetsSummaryClear).filter(":visible").click();
    cy.wait("@fetchResults");
    cy.get(searchResultsFacetsSummaryClear).should("not.exist");
  });
});
