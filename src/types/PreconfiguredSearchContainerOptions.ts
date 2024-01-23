import {
  RedirectionOptions,
  SearchContainerConfigOptions,
  SearchResultEventCallbacks
} from '@getlupa/vue'

export type SearchDemoFields = {
  imageKey?: string
  baseImageUrl?: string
  titleKey?: string
  regularPriceKey?: string
  discountPriceKey?: string
  productUrl?: string
  currency?: string
  minInputLength?: number
  emphasizedField?: string
  [key: string]: string | number | undefined
}

export type SearchBoxDemoOptions = {
  inputSelector: string
  fields: SearchDemoFields
  suggestionQueryKey: string
  documentQueryKey?: string
  environment?: string
  customUrl?: string
  customBaseUrl?: string
  customPayload?: Record<string, unknown>
  customHeaders?: Record<string, string>
  errorHandler?: (errorResponse: any) => unknown
}

export type SearchResultDemoOptions = {
  containerSelector: string
  fields: SearchDemoFields
  queryKey: string
  showFacets?: boolean
  maxColumns?: number
  maxLines?: number
  environment?: string
  customUrl?: string
  customBaseUrl?: string
  customPayload?: Record<string, unknown>
  customHeaders?: Record<string, string>
  gridConfiguration?: Record<string, number>
  showRelevance?: boolean
  errorHandler?: (errorResponse: any) => unknown
}

export type PreconfiguredSearchContainerOptions = {
  trigger: string
  searchBoxOptions?: SearchBoxDemoOptions
  searchResultOptions?: SearchResultDemoOptions
  labels: Record<string, any>
  redirections?: RedirectionOptions
  panelOptions?: { suggestionPanel: boolean; docPanel: boolean }
  configuratorOverrides?: Record<string, unknown>
  callbacks?: SearchResultEventCallbacks
  placeholderImage?: string
  configuration?: SearchContainerConfigOptions
  additionalFields?: string[]
}
