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
  setupTracking,
  initPinia,
  ChatContainer
} from '@getlupa/vue'

import { createApp, type Component, type ComponentPublicInstance, reactive, h, App } from 'vue'

import SearchBoxEntry from '@/components/SearchBoxEntry.vue'
import SearchResultsEntry from '@/components/SearchResultsEntry.vue'
import ProductListEntry from '@/components/ProductListEntry.vue'
import SearchContainerEntry from '@/components/SearchContainerEntry.vue'
import RecommendationsEntry from '@/components/RecommendationsEntry.vue'
import { DEFAULT_CONTAINER_STYLE } from '@/constants/global.const'
import { attatchShadowDom, createShadowDom } from '@/utils/shadowDom.utils'
import {
  PreconfiguredSearchContainerOptions,
  SearchBoxDemoOptions,
  SearchDemoFields,
  SearchResultDemoOptions
} from './types/PreconfiguredSearchContainerOptions'
import SearchContainerConfigurationService from './modules/preconfiguredContainer/SearchContainerConfigurationService'
import { createVue } from './utils/mounting.utils'

type AppInstance = Record<
  string,
  {
    mountedApp: Partial<ComponentPublicInstance> | null
    props: Record<string, unknown>
    mountedComponent: any | null
    app: App<Element>
    mountElement: Element
  }
>

type AppInstances = Record<
  'box' | 'results' | 'productList' | 'searchContainer' | 'recommendations' | 'chat',
  AppInstance
>

type MountOptions = { fetch?: boolean; mountingBehavior?: 'replace' | 'append' | 'prepend' }

const app: AppInstances = {
  box: {},
  results: {},
  productList: {},
  searchContainer: {},
  recommendations: {},
  chat: {}
}

const tracking = (options: TrackingOptions): void => {
  setupTracking(options)
}

const applySearchBox = (options: SearchBoxOptions, mountOptions?: MountOptions): void => {
  const existingInstance = app.box[options.inputSelector] as any
  if (existingInstance) {
    existingInstance.props.searchBoxOptions = options
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.mountedComponent?.component?.exposed?.fetch?.()
      })
    }
    return
  }
  const instance = createVue(
    options.inputSelector,
    mountOptions?.mountingBehavior,
    SearchBoxEntry,
    { searchBoxOptions: options },
    true
  )
  if (!instance) {
    return
  }
  app.box[options.inputSelector] = instance
}

const searchBox = (options: SearchBoxOptions, mountOptions?: MountOptions): void => {
  // Support for multiple search box selectors separated by a comma
  // Quite often multiple search boxes are required, since mobile and desktop has different inputs in html layout
  const inputs = options.inputSelector?.split(',')
  for (const input of inputs) {
    applySearchBox({ ...options, inputSelector: input.trim() }, mountOptions)
  }
}

const searchResults = (options: SearchResultsOptions, mountOptions?: MountOptions): void => {
  const existingInstance = app.results[options.containerSelector] as any
  if (existingInstance) {
    existingInstance.props.searchResultsOptions = options
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.mountedComponent?.component?.exposed?.fetch?.()
      })
    }
    return
  }
  const instance = createVue(
    options.containerSelector,
    mountOptions?.mountingBehavior,
    SearchResultsEntry,
    {
      searchResultsOptions: options
    }
  )
  if (!instance) {
    return
  }
  app.results[options.containerSelector] = instance
}

const productList = (options: ProductListOptions, mountOptions?: MountOptions): void => {
  const existingInstance = app.productList[options.containerSelector] as any
  if (existingInstance) {
    existingInstance.props.productListOptions = options
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.mountedComponent?.component?.exposed?.fetch?.()
      })
    }
    return
  }
  const instance = createVue(
    options.containerSelector,
    mountOptions?.mountingBehavior,
    ProductListEntry,
    {
      productListOptions: options
    }
  )
  if (!instance) {
    return
  }
  app.productList[options.containerSelector] = instance
}

const searchContainer = (options: SearchContainerOptions, mountOptions?: MountOptions): void => {
  const existingInstance = app.searchContainer[options.trigger] as any
  if (existingInstance) {
    existingInstance.props.searchContainerOptions = options
    existingInstance.mountedComponent?.component?.exposed?.reloadOptions?.()
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.mountedComponent?.component?.exposed?.fetch?.()
      })
    }
    return
  }
  const id = 'lupa-search-container-manager'
  const shadowId = 'lupa-shadow-id'
  const { host, manager } = createShadowDom(shadowId, id)
  attatchShadowDom({
    host,
    manager,
    styleUrl: options.options?.styleLink ?? DEFAULT_CONTAINER_STYLE,
    options: options.options
  })
  document.body.appendChild(host)
  const instance = createVue(manager, mountOptions?.mountingBehavior, SearchContainerEntry, {
    searchContainerOptions: options
  })
  if (!instance) {
    return
  }
  app.searchContainer[options.trigger] = instance
}

const preconfiguredSearchContainer = (
  preconfiguredSearchContainerOptions: PreconfiguredSearchContainerOptions,
  mountOptions?: MountOptions
) => {
  const searchBox = SearchContainerConfigurationService.getSearchBoxComponent(
    preconfiguredSearchContainerOptions
  )
  const searchResults = SearchContainerConfigurationService.getSearchResultsComponent(
    preconfiguredSearchContainerOptions
  )
  searchContainer(
    {
      trigger: preconfiguredSearchContainerOptions.trigger,
      searchBox,
      searchResults,
      options: preconfiguredSearchContainerOptions.configuration
    },
    mountOptions
  )
}

const recommendations = (
  options: ProductRecommendationOptions,
  mountOptions?: MountOptions
): void => {
  const existingInstance = app.recommendations[options.containerSelector] as any
  if (existingInstance) {
    existingInstance.props.recommendationOptions = options
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.mountedComponent?.component?.exposed?.fetch?.()
      })
    }
    return
  }

  const instance = createVue(
    options.containerSelector,
    mountOptions?.mountingBehavior,
    RecommendationsEntry,
    {
      recommendationOptions: options
    }
  )
  if (!instance) {
    return
  }

  app.recommendations[options.containerSelector] = instance
}

const chat = (options: ChatOptions, mountOptions?: MountOptions): void => {
  const existingInstance = app.chat[options.displayOptions.containerSelector] as any
  if (existingInstance) {
    existingInstance.props.options = options
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.mountedComponent?.component?.exposed?.fetch?.()
      })
    }
    return
  }

  const instance = createVue(
    options.displayOptions.containerSelector,
    mountOptions?.mountingBehavior,
    ChatContainer,
    {
      options: options
    }
  )
  if (!instance) {
    return
  }
  app.chat[options.displayOptions.containerSelector] = instance
}

const clearInstance = (element: Element, app: App<Element>) => {
  const content = element.innerHTML
  app?.unmount?.()
  element.innerHTML = content
}

const clearSearchBox = (selector?: string): void => {
  try {
    if (selector) {
      app.box[selector] = null
      clearInstance(app.box[selector].mountElement, app.box[selector].app)
    }
    for (const key in app.box) {
      clearInstance(app.box[key].mountElement, app.box[key].app)
    }
    app.box = {}
  } catch {
    // do nothing, already destroyed;
  }
}

const clearSearchResults = (selector?: string): void => {
  try {
    if (selector) {
      app.results[selector] = null
      clearInstance(app.results[selector].mountElement, app.results[selector].app)
    }
    for (const key in app.results) {
      clearInstance(app.results[key].mountElement, app.results[key].app)
    }
    app.results = {}
  } catch {
    // do nothing, already destroyed;
  }
}

const clearProductList = (selector?: string): void => {
  try {
    if (selector) {
      app.productList[selector] = null
      clearInstance(app.productList[selector].mountElement, app.productList[selector].app)
    }
    for (const key in app.productList) {
      clearInstance(app.productList[key].mountElement, app.productList[key].app)
    }
    app.productList = {}
  } catch {
    // do nothing, already destroyed;
  }
}

const clearSearchContainer = (selector?: string): void => {
  try {
    if (selector) {
      app.searchContainer[selector] = null
      clearInstance(app.searchContainer[selector].mountElement, app.searchContainer[selector].app)
    }
    for (const key in app.searchContainer) {
      clearInstance(app.searchContainer[key].mountElement, app.searchContainer[key].app)
    }
    app.searchContainer = {}
  } catch {
    // do nothing, already destroyed;
  }
}

const clearRecommendations = (selector?: string): void => {
  try {
    if (selector) {
      app.recommendations[selector] = null
      clearInstance(app.recommendations[selector].mountElement, app.recommendations[selector].app)
    }
    for (const key in app.recommendations) {
      clearInstance(app.recommendations[key].mountElement, app.recommendations[key].app)
    }
    app.recommendations = {}
  } catch {
    // do nothing, already destroyed;
  }
}

const clearChat = (selector?: string): void => {
  try {
    if (selector) {
      app.chat[selector] = null
      clearInstance(app.chat[selector].mountElement, app.chat[selector].app)
    }
    for (const key in app.chat) {
      clearInstance(app.chat[key].mountElement, app.chat[key].app)
    }
    app.chat = {}
  } catch {
    // do nothing, already destroyed;
  }
}

const lupaSearch = {
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
