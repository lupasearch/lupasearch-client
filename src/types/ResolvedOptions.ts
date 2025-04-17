import {
  ProductListOptions,
  ProductRecommendationOptions,
  SearchBoxOptions,
  SearchResultsOptions
} from '@getlupa/vue'

export type ResolvedSearchBoxOptions = SearchBoxOptions & {
  allowedMountUrls?: string[]
  domPing?: {
    intervalMs?: number
    count?: number
  }
}
export type ResolvedSearchResultOptions = SearchResultsOptions & {
  allowedMountUrls?: string[]
  domPing?: {
    intervalMs?: number
    count?: number
  }
}
export type ResolvedProductListOptions = ProductListOptions & { allowedMountUrls?: string[] }
export type ResolvedProductRecommendationOptions = ProductRecommendationOptions & {
  allowedMountUrls?: string[]
}
