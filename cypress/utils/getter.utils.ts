export const getAndClick = (
  selector: string,
  last = false
): Cypress.Chainable<JQuery<HTMLElement>> => {
  const obj = last ? cy.get(selector).last() : cy.get(selector).first();
  obj.trigger("click");
  return obj;
};

export const getTrimedText = (text: string): string => {
  return text
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x)
    .join(" ");
};
