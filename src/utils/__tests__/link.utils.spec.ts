import { generateLink, generateResultLink } from "../link.utils";

describe("generateLink", () => {
  it("should return original link pattern if it has no replaceable properties", () => {
    expect(generateLink("/specific-url", {})).toEqual("/specific-url");
  });

  it("should replace link parts with object properties", () => {
    const document = { id: "123fwe9", slug: "test-product" };
    expect(generateLink("/products/{id}-{slug}.html", document)).toEqual(
      "/products/123fwe9-test-product.html"
    );
  });

  it("should replace properties with empty strings if prop does not exist in the document", () => {
    const document = { slug: "test-product" };
    expect(generateLink("/products/{id}-{slug}.html", document)).toEqual(
      "/products/-test-product.html"
    );
  });

  it("should not replace link for unbalanced brackets", () => {
    const document = { id: "123fwe9", slug: "test-product" };
    expect(generateLink("/products/{id-.html", document)).toEqual(
      "/products/{id-.html"
    );
  });

  it("should replace numeric properties", () => {
    const document = { id: "123fwe9", slug: "test-product", number: 6 };
    expect(generateLink("/{slug}?q={number}", document)).toEqual(
      "/test-product?q=6"
    );
  });

  it("should replace full urls", () => {
    const document = { id: "123fwe9", url: "https://lupasearch.com/product/1" };
    expect(generateLink("{url}", document)).toEqual(
      "https://lupasearch.com/product/1"
    );
  });
});

describe("generateResultLink", () => {
  it("should return just a link if no query is provided", () => {
    expect(generateResultLink("/just-a-link")).toBe("/just-a-link");
  });

  it("should return just a link if query text is empty", () => {
    expect(generateResultLink("/just-a-link", "")).toBe("/just-a-link");
  });

  it("should return link with search query as parameter", () => {
    expect(generateResultLink("/search", "books")).toBe("/search?q=books");
  });

  it("should keep lt characers not encoded", () => {
    expect(generateResultLink("/search", "ąčęą")).toBe("/search?q=ąčęą");
  });

  it("should keep space", () => {
    expect(generateResultLink("/search", "one two")).toBe("/search?q=one two");
  });

  it("should encode search parameter", () => {
    expect(generateResultLink("/search", "bo?o&ks")).toBe(
      "/search?q=bo%3Fo%26ks"
    );
  });
});
