import {
  ProductListOptions,
  ProductRecommendationOptions,
  SearchBoxOptions,
  SearchResultsOptions
} from '@getlupa/vue'

export type ResolvedSearchBoxOptions = SearchBoxOptions & {
  allowedMountUrls?: string[]
  domPingIntervalMs?: number
}
export type ResolvedSearchResultOptions = SearchResultsOptions & { allowedMountUrls?: string[] }
export type ResolvedProductListOptions = ProductListOptions & { allowedMountUrls?: string[] }
export type ResolvedProductRecommendationOptions = ProductRecommendationOptions & {
  allowedMountUrls?: string[]
}
