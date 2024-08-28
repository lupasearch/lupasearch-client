import type {
  Environment,
  SdkOptions,
  SortDirection,
  TrackingOptions,
  DocumentElement,
  ImageDocumentElement,
  TitleDocumentElement,
  DescriptionDocumentElement,
  CustomDocumentElement,
  PriceElement,
  RegularPriceDocumentElement,
  RatingElement,
  AddToCartElement,
  CustomHtmlElement,
  SingleStarRatingElement,
  ProductListOptions,
  CategoryFilterOptions,
  ProductRecommendationOptions,
  RecommendationABTestingOptions,
  SearchBoxOptions,
  SearchContainerOptions,
  SearchContainerConfigOptions,
  SearchResultBadgeElement,
  BadgeGenerateSeed,
  BadgeGenerateOptions,
  BadgeOptions,
  RoutingBehavior,
  SearchResultsOptions,
  FacetStyle,
  SearchResultEventCallbacks,
  CallbackContext,
  SortCallbackContext,
  FacetFilterQuery,
  SearchResultsFilterOptions,
  ResultFacetOptions,
  DynamicData,
  AnchorPosition,
  SortOptions,
  SearchResultsSortOptions,
  ChatOptions,
  RedirectionOptions
} from '@getlupa/vue'

import {
  DocumentElementType,
  SearchBoxPanelType,
  BadgeType,
  SearchResultBadgeType,
  setupTracking
} from '@getlupa/vue'

import {
  PreconfiguredSearchContainerOptions,
  SearchBoxDemoOptions,
  SearchDemoFields,
  SearchResultDemoOptions
} from './types/PreconfiguredSearchContainerOptions'
import SearchContainerConfigurationService from './modules/preconfiguredContainer/SearchContainerConfigurationService'
import {
  searchBox,
  searchResults,
  productList,
  searchContainer,
  recommendations,
  clearSearchBox,
  clearSearchResults,
  clearProductList,
  clearSearchContainer,
  clearRecommendations,
  chat,
  clearChat,
  preconfiguredSearchContainer
} from './mounting'
import PluginConfigurationManager from './modules/pluginManager/PluginConfigurationManager'

type MountOptions = { fetch?: boolean; mountingBehavior?: 'replace' | 'append' | 'prepend' }

const tracking = (options: TrackingOptions): void => {
  setupTracking(options)
}

const init = (configurationKey: string, options?: SdkOptions) => {
  return PluginConfigurationManager.init(configurationKey, options)
}

const lupaSearch = {
  init,
  searchBox,
  searchResults,
  tracking,
  productList,
  searchContainer,
  recommendations,
  clearSearchBox,
  clearSearchResults,
  clearProductList,
  clearSearchContainer,
  clearRecommendations,
  chat,
  clearChat,
  preconfiguredSearchContainer,
  getSearchBoxComponent: SearchContainerConfigurationService.getSearchBoxComponent,
  getSearchResultsComponent: SearchContainerConfigurationService.getSearchResultsComponent
}

export { DocumentElementType, SearchBoxPanelType, BadgeType }

export type {
  TrackingOptions,
  SearchBoxOptions,
  SearchResultsOptions,
  ProductListOptions,
  SdkOptions,
  FacetStyle,
  Environment,
  RoutingBehavior,
  AnchorPosition,
  SortDirection,
  DocumentElement,
  ImageDocumentElement,
  TitleDocumentElement,
  DescriptionDocumentElement,
  CustomDocumentElement,
  PriceElement,
  RegularPriceDocumentElement,
  RatingElement,
  AddToCartElement,
  CustomHtmlElement,
  SortOptions,
  SearchResultsSortOptions,
  SearchResultEventCallbacks,
  CallbackContext,
  SortCallbackContext,
  FacetFilterQuery,
  CategoryFilterOptions,
  SearchResultsFilterOptions,
  SearchResultBadgeType,
  SearchResultBadgeElement,
  ResultFacetOptions,
  BadgeGenerateSeed,
  BadgeGenerateOptions,
  BadgeOptions,
  MountOptions,
  SearchContainerOptions,
  SearchContainerConfigOptions,
  SingleStarRatingElement,
  DynamicData,
  ProductRecommendationOptions,
  RecommendationABTestingOptions,
  ChatOptions,
  RedirectionOptions,
  PreconfiguredSearchContainerOptions,
  SearchBoxDemoOptions,
  SearchResultDemoOptions,
  SearchDemoFields
}

declare global {
  interface Window {
    getLupa: {
      searchBox: (options: SearchBoxOptions) => void
      searchResults: (options: SearchResultsOptions) => void
      tracking: (options: TrackingOptions) => void
      productList: (options: ProductListOptions) => void
      chat: (options: ChatOptions) => void
      clearSearchBox: () => void
      clearSearchResults: () => void
      clearProductList: () => void
      clearChat: () => void
      preconfiguredSearchContainer: (
        preconfiguredSearchContainerOptions: PreconfiguredSearchContainerOptions
      ) => void
      getSearchBoxComponent: (options: PreconfiguredSearchContainerOptions) => SearchBoxOptions
      getSearchResultsComponent: (
        options: PreconfiguredSearchContainerOptions
      ) => SearchResultsOptions
    }
    lupaSearch: {
      searchBox: (options: SearchBoxOptions) => void
      searchResults: (options: SearchResultsOptions) => void
      tracking: (options: TrackingOptions) => void
      productList: (options: ProductListOptions) => void
      chat: (options: ChatOptions) => void
      clearSearchBox: () => void
      clearSearchResults: () => void
      clearProductList: () => void
      clearChat: () => void
      preconfiguredSearchContainer: (
        preconfiguredSearchContainerOptions: PreconfiguredSearchContainerOptions
      ) => void
      getSearchBoxComponent: (options: PreconfiguredSearchContainerOptions) => SearchBoxOptions
      getSearchResultsComponent: (
        options: PreconfiguredSearchContainerOptions
      ) => SearchResultsOptions
    }
  }
}

if (typeof window !== 'undefined') {
  window.getLupa = lupaSearch
  window.lupaSearch = lupaSearch
}

export default lupaSearch
