import { Pinia, createPinia } from 'pinia'
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
  SearchBoxPanelType,
  SearchContainerOptions,
  SearchContainerConfigOptions,
  BadgeType,
  SearchResultBadgeType,
  SearchResultBadgeElement,
  BadgeGenerateSeed,
  BadgeGenerateOptions,
  BadgeOptions,
  RoutingBehavior,
  SearchResultsOptions,
  FacetStyle,
  SearchResultEventCallbacks,
  CallbackContext,
  FacetFilterQuery,
  SearchResultsFilterOptions,
  ResultFacetOptions,
  DynamicData,
  AnchorPosition,
  SortOptions,
  SearchResultsSortOptions
} from '@getlupa/vue'

import { DocumentElementType, setupTracking } from '@getlupa/vue'

import { createApp, type Component, type ComponentPublicInstance, reactive } from 'vue'

import SearchBoxEntry from '@/components/SearchBoxEntry.vue'
import SearchResultsEntry from '@/components/SearchResultsEntry.vue'
import ProductListEntry from '@/components/ProductListEntry.vue'
import SearchContainerEntry from '@/components/SearchContainerEntry.vue'
import RecommendationsEntry from '@/components/RecommendationsEntry.vue'
import { DEFAULT_CONTAINER_STYLE } from '@/constants/global.const'
import { attatchShadowDom, createShadowDom } from '@/utils/shadowDom.utils'

type AppInstance = Record<string, Partial<ComponentPublicInstance> | null>

type AppInstances = Record<
  'box' | 'results' | 'productList' | 'searchContainer' | 'recommendations',
  AppInstance
>

type MountOptions = { fetch: boolean }

const app: AppInstances = {
  box: {},
  results: {},
  productList: {},
  searchContainer: {},
  recommendations: {}
}

let piniaInstance: Pinia | null = null

const initPinia = () => {
  if (piniaInstance) {
    return piniaInstance
  }
  const pinia = createPinia()
  piniaInstance = pinia
  return pinia
}

const tracking = (options: TrackingOptions): void => {
  setupTracking(options)
}

const createVue = (
  selector: string | Element,
  rootComponent: Component,
  options: Record<string, unknown>,
  mountToParent = false
) => {
  const pinia = initPinia()
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector

  const parent = element?.parentElement

  const mountElement = mountToParent ? parent : element

  if (!mountElement) {
    console.error(`Cannot mount LupaSearch componbent. Element "${selector}" not found`)
    return
  }

  const props = reactive({ ...options })
  const app = createApp(rootComponent, props)

  app.use(pinia)
  const mountedApp = app.mount(mountElement)

  if (mountToParent) {
    element?.remove()
  }

  return mountedApp
}

const applySearchBox = (options: SearchBoxOptions, mountOptions?: MountOptions): void => {
  const existingInstance = app.box[options.inputSelector] as any
  if (existingInstance) {
    existingInstance.searchBoxOptions = options
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.fetch?.()
      })
    }
    return
  }
  const instance = createVue(
    options.inputSelector,
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
    existingInstance.searchResultsOptions = options
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.fetch?.()
      })
    }
    return
  }
  const instance = createVue(options.containerSelector, SearchResultsEntry, {
    searchResultsOptions: options
  })
  if (!instance) {
    return
  }
  app.results[options.containerSelector] = instance
}

const productList = (options: ProductListOptions, mountOptions?: MountOptions): void => {
  const existingInstance = app.productList[options.containerSelector] as any
  if (existingInstance) {
    existingInstance.productListOptions = options
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.fetch?.()
      })
    }
    return
  }
  const instance = createVue(options.containerSelector, ProductListEntry, {
    productsListOptions: options
  })
  if (!instance) {
    return
  }
  app.productList[options.containerSelector] = instance
}

const searchContainer = (options: SearchContainerOptions, mountOptions?: MountOptions): void => {
  const existingInstance = app.searchContainer[options.trigger] as any
  if (existingInstance) {
    existingInstance.searchContainerOptions.value = options
    existingInstance.reloadOptions()
    console.log(existingInstance)
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.fetch?.()
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
  const instance = createVue(manager, SearchContainerEntry, {
    searchContainerOptions: options
  })
  if (!instance) {
    return
  }
  app.searchContainer[options.trigger] = instance
}

const recommendations = (
  options: ProductRecommendationOptions,
  mountOptions?: MountOptions
): void => {
  const existingInstance = app.recommendations[options.containerSelector] as any
  if (existingInstance) {
    existingInstance.recommendationOptions = options
    if (mountOptions?.fetch) {
      setTimeout(() => {
        existingInstance.fetch?.()
      })
    }
    return
  }

  const instance = createVue(options.containerSelector, RecommendationsEntry, {
    recommendationOptions: options
  })
  if (!instance) {
    return
  }

  app.recommendations[options.containerSelector] = instance
}

const clearInstance = (selector: string) => {
  const element = document.querySelector(selector)
  if (!element) {
    return
  }
  document.body.removeChild(element)
}

const clearSearchBox = (selector?: string): void => {
  try {
    if (selector) {
      app.box[selector] = null
      clearInstance(selector)
    }
    for (const key in app.box) {
      clearInstance(key)
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
      clearInstance(selector)
    }
    for (const key in app.results) {
      clearInstance(key)
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
      clearInstance(selector)
    }
    for (const key in app.productList) {
      clearInstance(key)
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
      clearInstance(selector)
    }
    for (const key in app.searchContainer) {
      clearInstance(key)
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
      clearInstance(selector)
    }
    for (const key in app.recommendations) {
      clearInstance(key)
    }
    app.recommendations = {}
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
  clearRecommendations
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
  RecommendationABTestingOptions
}

declare global {
  interface Window {
    getLupa: {
      searchBox: (options: SearchBoxOptions) => void
      searchResults: (options: SearchResultsOptions) => void
      tracking: (options: TrackingOptions) => void
      productList: (options: ProductListOptions) => void
      clearSearchBox: () => void
      clearSearchResults: () => void
      clearProductList: () => void
    }
    lupaSearch: {
      searchBox: (options: SearchBoxOptions) => void
      searchResults: (options: SearchResultsOptions) => void
      tracking: (options: TrackingOptions) => void
      productList: (options: ProductListOptions) => void
      clearSearchBox: () => void
      clearSearchResults: () => void
      clearProductList: () => void
    }
  }
}

if (window) {
  window.getLupa = lupaSearch
  window.lupaSearch = lupaSearch
}

export default lupaSearch
