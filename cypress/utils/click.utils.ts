export const clickEmptySpace = (): void => {
  cy.get("body").click(0, 0);
};
