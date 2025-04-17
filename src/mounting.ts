import type {
  ProductListOptions,
  ProductRecommendationOptions,
  SearchBoxOptions,
  SearchContainerOptions,
  SearchResultsOptions,
  ChatOptions
} from '@getlupa/vue'

import { ChatContainer } from '@getlupa/vue'

import { type ComponentPublicInstance, App } from 'vue'

import SearchBoxEntry from '@/components/SearchBoxEntry.vue'
import SearchResultsEntry from '@/components/SearchResultsEntry.vue'
import ProductListEntry from '@/components/ProductListEntry.vue'
import SearchContainerEntry from '@/components/SearchContainerEntry.vue'
import RecommendationsEntry from '@/components/RecommendationsEntry.vue'
import { DEFAULT_CONTAINER_STYLE } from '@/constants/global.const'
import { attatchShadowDom, createShadowDom } from '@/utils/shadowDom.utils'
import { PreconfiguredSearchContainerOptions } from './types/PreconfiguredSearchContainerOptions'
import SearchContainerConfigurationService from './modules/preconfiguredContainer/SearchContainerConfigurationService'
import { canMount, createVue, startDomPing } from './utils/mounting.utils'

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

type MountOptions = {
  fetch?: boolean
  mountingBehavior?: 'replace' | 'append' | 'prepend'
  allowedMountUrls?: string[]
  domPing?: {
    intervalMs?: number
    count?: number
  }
}

const app: AppInstances = {
  box: {},
  results: {},
  productList: {},
  searchContainer: {},
  recommendations: {},
  chat: {}
}

const addSearchBoxDomPingIfConfigured = (
  options: SearchBoxOptions,
  mountOptions?: MountOptions
): SearchBoxOptions => {
  if (!mountOptions.domPing?.count) {
    return options
  }
  const newOptions: SearchBoxOptions = {
    ...options,
    callbacks: {
      onMounted: () => {
        options.callbacks?.onMounted?.()
        startDomPing(mountOptions.domPing.intervalMs, mountOptions.domPing.count)
      },
      onBlurred: () => {
        options.callbacks?.onBlurred?.()
        startDomPing(mountOptions.domPing.intervalMs, mountOptions.domPing.count)
      },
      onFocused: () => {
        options.callbacks?.onFocused?.()
        startDomPing(mountOptions.domPing.intervalMs, mountOptions.domPing.count)
      },
      onSearchBoxInput: (...args) => {
        options.callbacks?.onSearchBoxInput?.(...args)
        startDomPing(mountOptions.domPing.intervalMs, mountOptions.domPing.count)
      }
    }
  }
  return newOptions
}

const addSearchResultsDomPingIfConfigured = (
  options: SearchResultsOptions,
  mountOptions?: MountOptions
): SearchResultsOptions => {
  if (!mountOptions.domPing?.count) {
    return options
  }
  const newOptions: SearchResultsOptions = {
    ...options,
    callbacks: {
      onMounted: () => {
        options.callbacks?.onMounted?.()
        startDomPing(mountOptions.domPing.intervalMs, mountOptions.domPing.count)
      },
      onUrlQueryChange: (...args) => {
        options.callbacks?.onUrlQueryChange?.(...args)
        startDomPing(mountOptions.domPing.intervalMs, mountOptions.domPing.count)
      }
    }
  }
  return newOptions
}

export const applySearchBox = (options: SearchBoxOptions, mountOptions?: MountOptions): void => {
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

export const searchBox = (options: SearchBoxOptions, mountOptions?: MountOptions): void => {
  if (!canMount(mountOptions?.allowedMountUrls)) {
    return
  }
  const transformedOptions = addSearchBoxDomPingIfConfigured(options, mountOptions)
  // Support for multiple search box selectors separated by a comma
  // Quite often multiple search boxes are required, since mobile and desktop has different inputs in html layout
  const inputs = options.inputSelector?.split(',')
  for (const input of inputs) {
    applySearchBox({ ...transformedOptions, inputSelector: input.trim() }, mountOptions)
  }
}

export const searchResults = (options: SearchResultsOptions, mountOptions?: MountOptions): void => {
  if (!canMount(mountOptions?.allowedMountUrls)) {
    return
  }
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
  const transformedOptions = addSearchResultsDomPingIfConfigured(options, mountOptions)
  const instance = createVue(
    options.containerSelector,
    mountOptions?.mountingBehavior,
    SearchResultsEntry,
    {
      searchResultsOptions: transformedOptions
    }
  )
  if (!instance) {
    return
  }
  app.results[options.containerSelector] = instance
}

export const productList = (options: ProductListOptions, mountOptions?: MountOptions): void => {
  if (!canMount(mountOptions?.allowedMountUrls)) {
    return
  }
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

export const searchContainer = (
  options: SearchContainerOptions,
  mountOptions?: MountOptions
): void => {
  if (!canMount(mountOptions?.allowedMountUrls)) {
    return
  }
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

export const preconfiguredSearchContainer = (
  preconfiguredSearchContainerOptions: PreconfiguredSearchContainerOptions,
  mountOptions?: MountOptions
) => {
  if (!canMount(mountOptions?.allowedMountUrls)) {
    return
  }
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

export const recommendations = (
  options: ProductRecommendationOptions,
  mountOptions?: MountOptions
): void => {
  if (!canMount(mountOptions?.allowedMountUrls)) {
    return
  }
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

export const chat = (options: ChatOptions, mountOptions?: MountOptions): void => {
  if (!canMount(mountOptions?.allowedMountUrls)) {
    return
  }
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

export const clearInstance = (element: Element, app: App<Element>) => {
  const content = element.innerHTML
  app?.unmount?.()
  element.innerHTML = content
}

export const clearSearchBox = (selector?: string): void => {
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

export const clearSearchResults = (selector?: string): void => {
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

export const clearProductList = (selector?: string): void => {
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

export const clearSearchContainer = (selector?: string): void => {
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

export const clearRecommendations = (selector?: string): void => {
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

export const clearChat = (selector?: string): void => {
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
