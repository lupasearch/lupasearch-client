import {
  ProductListOptions,
  ProductRecommendationOptions,
  SearchBoxOptions,
  SearchResultsOptions
} from '@getlupa/vue'

type MountingBehavior = 'replace' | 'append' | 'prepend'

export type ResolvedSearchBoxOptions = SearchBoxOptions & {
  allowedMountUrls?: string[]
  domPing?: {
    intervalMs?: number
    count?: number
  }
  mountingBehavior?: MountingBehavior
}
export type ResolvedSearchResultOptions = SearchResultsOptions & {
  allowedMountUrls?: string[]
  mountingBehavior?: MountingBehavior
  domPing?: {
    intervalMs?: number
    count?: number
  }
}
export type ResolvedProductListOptions = ProductListOptions & {
  allowedMountUrls?: string[]
  mountingBehavior?: MountingBehavior
}
export type ResolvedProductRecommendationOptions = ProductRecommendationOptions & {
  mountingBehavior?: MountingBehavior
  allowedMountUrls?: string[]
}
