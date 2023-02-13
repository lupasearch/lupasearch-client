import {
  trackingOptions,
  searchBoxOptions,
  searchResultsOptions,
} from "./base.js";

const lupaSearch = window.lupaSearch;

lupaSearch.tracking(trackingOptions);
lupaSearch.searchBox(searchBoxOptions);

lupaSearch.searchResults({
  ...searchResultsOptions,
  elements: [
    {
      type: "title",
      key: "product_name",
      isHtml: false,
      link: false,
      maxLines: 2,
    },
    {
      type: "custom",
      key: "id",
      className: "lupa-custom-id",
    },
    {
      type: "custom",
      key: "brand",
      className: "lupa-custom-brand",
    },
    {
      dynamic: true,
      type: "customHtml",
      key: "index",
      className: "dynamic-index-loader",
      html: (doc) => {
        return `<div data-cy="custom-dynamic-element">My index is ${
          doc.index ?? "loading"
        }</div>`;
      },
    },
    {
      dynamic: true,
      type: "regularPrice",
      key: "dynamicPrice",
      display: (doc) => doc.dynamicPrice,
    },
  ],
  dynamicData: {
    cache: true,
    handler: async (ids) => {
      return new Promise((resolve) =>
        setTimeout(() => {
          resolve(
            ids.map((id, index) => ({
              id,
              index: index + 1,
              dynamicPrice: (index + 1) * 10,
            }))
          );
        }, 500)
      );
    },
  },
});
