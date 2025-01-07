import {
  ProductListOptions,
  ProductRecommendationOptions,
  SearchBoxOptions,
  SearchResultsOptions
} from '@getlupa/vue'

export type OptionOverrides = {
  searchBox?: Partial<SearchBoxOptions>
  searchResults?: Partial<SearchResultsOptions>
  productList?: Partial<ProductListOptions>
  recommendations?: Partial<ProductRecommendationOptions>
}
