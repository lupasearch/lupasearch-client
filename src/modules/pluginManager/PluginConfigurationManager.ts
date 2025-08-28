import { chat, productList, recommendations, searchBox, searchResults } from '@/mounting'
import { OptionOverrides } from '@/types/OptionOverrides'
import {
  ResolvedProductListOptions,
  ResolvedProductRecommendationOptions,
  ResolvedSearchBoxOptions,
  ResolvedSearchResultOptions
} from '@/types/ResolvedOptions'
import { waitForElementToBeVisible } from '@/utils/document.utils'
import { merge } from '@/utils/merger.utils'
import {
  removeFromLocalStorage,
  removeFromSessionStorage,
  saveToLocalStorage,
  saveToSessionStorage,
  tryLoadFromLocalStorage,
  tryLoadFromSessionStorage
} from '@/utils/storage.utils'
import { getQueryParam } from '@/utils/url.utils'
import {
  PluginConfiguration,
  PluginElementsConfiguration,
  SdkOptions,
  SearchResultsOptions,
  TrackingOptions,
  fetchPluginConfiguration,
  setupTracking
} from '@getlupa/vue'
import PluginConfigurationMerger from './PluginConfigurationMerger'

const PREVIEW_PARAMETER = 'lupaSearchPreview'
const MAX_ELEMENT_MOUNT_RETRIES = 25

let styleElement: HTMLStyleElement | null = null

export type ExtendedPluginElementsConfiguration = PluginElementsConfiguration & {
  baseStyleLink?: string
}

export type ExtendedPluginConfiguration = PluginConfiguration & {
  previewConfiguration: ExtendedPluginElementsConfiguration
  configuration: ExtendedPluginElementsConfiguration
}

const loadAndSaveConfigurationFromServer = async (
  configurationKey: string,
  options: SdkOptions = { environment: 'production' }
) => {
  const configuration = (await fetchPluginConfiguration(
    options,
    configurationKey
  )) as ExtendedPluginConfiguration
  if (!configuration) {
    console.error(`Failed to fetch LupaSearch plugin configuration for key ${configurationKey}`)
    return null
  }
  saveToLocalStorage(configurationKey, configuration)
  return configuration
}

const checkIsPreviewMode = () => {
  const isPreviewModeSaved = tryLoadFromSessionStorage<boolean>(PREVIEW_PARAMETER)
  if (isPreviewModeSaved) {
    return isPreviewModeSaved
  }
  const isPreviewMode = getQueryParam(PREVIEW_PARAMETER) === 'true'
  if (isPreviewMode) {
    saveToSessionStorage(PREVIEW_PARAMETER, isPreviewMode)
  } else {
    removeFromSessionStorage(PREVIEW_PARAMETER)
  }
  return isPreviewMode
}

const loadConfigurations = async (
  configurationKey: string,
  isPreviewMode?: boolean,
  options?: SdkOptions,
  optionOverrides?: OptionOverrides
): Promise<ExtendedPluginConfiguration | null> => {
  if (isPreviewMode) {
    return loadAndSaveConfigurationFromServer(configurationKey, options)
  }
  const existingConfiguration =
    tryLoadFromLocalStorage<ExtendedPluginConfiguration>(configurationKey)
  if (existingConfiguration) {
    setTimeout(async () => {
      const newestConfiguration = await loadAndSaveConfigurationFromServer(
        configurationKey,
        options
      )
      if (existingConfiguration.updatedAt === newestConfiguration.updatedAt) {
        return
      }
      const isPreviewMode = checkIsPreviewMode()
      const configuration = isPreviewMode
        ? newestConfiguration.previewConfiguration ?? newestConfiguration.configuration
        : newestConfiguration.configuration
      if (configuration) {
        await mount(configuration, options, optionOverrides, false, true)
      } else {
        removeFromLocalStorage(configurationKey)
        window.location.reload()
      }
    })
    return existingConfiguration
  }
  return loadAndSaveConfigurationFromServer(configurationKey, options)
}

const applyStyles = async (configuration: ExtendedPluginElementsConfiguration) => {
  const visible = await waitForElementToBeVisible(document.head, 0, 20, 5)
  if (!visible) {
    console.error('Failed to apply custom LupaSearch styles, head element not found')
    return
  }
  const baseStyleLink = configuration.baseStyleLink
  if(!baseStyleLink && !configuration?.customStyles) {
    return
  }
  if (styleElement) {
    styleElement.remove()
  }
  styleElement = document.createElement('style')
  if (baseStyleLink) {
    styleElement.innerHTML = `
      @import url('${baseStyleLink}');
      @import url('https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css');
      ${configuration.customStyles ?? ''}
    `
  }
  document.head.appendChild(styleElement)
}

const mountSearchBox = async (
  configuration: ExtendedPluginElementsConfiguration,
  options?: SdkOptions,
  optionOverrides?: OptionOverrides,
  fetch = true,
  remount = false
) => {
  if (!configuration.searchBox) {
    return
  }
  const resolvedConfiguration: ResolvedSearchBoxOptions = JSON.parse(configuration.searchBox)
  const allowedMountUrls = resolvedConfiguration.allowedMountUrls
  const domPing = resolvedConfiguration.domPing
  const visible = await waitForElementToBeVisible(
    resolvedConfiguration.inputSelector,
    0,
    remount ? 0 : MAX_ELEMENT_MOUNT_RETRIES
  )
  if (!visible && !remount) {
    console.error(
      `Failed to mount LupaSearch search box, input element ${resolvedConfiguration.inputSelector} not found`
    )
    return
  }
  const mergedOptions = PluginConfigurationMerger.mergeSearchBoxConfiguration(
    resolvedConfiguration,
    optionOverrides?.searchBox ?? {}
  )
  searchBox({ ...mergedOptions, options }, { fetch, allowedMountUrls, domPing })
}

const mountSearchResults = async (
  configuration: ExtendedPluginElementsConfiguration,
  options?: SdkOptions,
  optionOverrides?: OptionOverrides,
  fetch = true,
  remount = false
) => {
  if (!configuration.searchResults) {
    return
  }
  const resolvedConfiguration: ResolvedSearchResultOptions = JSON.parse(configuration.searchResults)
  const allowedMountUrls = resolvedConfiguration.allowedMountUrls
  const domPing = resolvedConfiguration.domPing

  const visible = await waitForElementToBeVisible(
    resolvedConfiguration.containerSelector,
    0,
    remount ? 0 : MAX_ELEMENT_MOUNT_RETRIES
  )
  if (!visible && !remount) {
    console.error(
      `Failed to mount LupaSearch search results, element ${resolvedConfiguration.containerSelector} not found`
    )
    return
  }
  const mergedOptions = PluginConfigurationMerger.mergeSearchResultsConfiguration(
    resolvedConfiguration,
    optionOverrides?.searchResults ?? {}
  )
  searchResults({ ...mergedOptions, options }, { fetch, allowedMountUrls, domPing })
}

const mountProductList = async (
  configuration: ExtendedPluginElementsConfiguration,
  options?: SdkOptions,
  optionOverrides?: OptionOverrides,
  fetch = true,
  remount = false
) => {
  if (!configuration.productList) {
    return
  }
  const resolvedSearchResultsConfiguration: SearchResultsOptions = JSON.parse(
    configuration.searchResults
  )
  const resolvedConfiguration: ResolvedProductListOptions = JSON.parse(configuration.productList)
  const allowedMountUrls = resolvedConfiguration.allowedMountUrls

  const visible = await waitForElementToBeVisible(
    resolvedConfiguration.containerSelector,
    0,
    remount ? 0 : MAX_ELEMENT_MOUNT_RETRIES
  )
  if (!visible && !remount) {
    console.error(
      `Failed to mount LupaSearch product list, element ${resolvedConfiguration.containerSelector} not found`
    )
    return
  }
  const mergedOptions = merge(
    { ...resolvedSearchResultsConfiguration, ...resolvedConfiguration },
    optionOverrides?.productList ?? {}
  )
  productList({ ...mergedOptions, options }, { fetch, allowedMountUrls })
}

const mountRecommendations = async (
  resolvedSearchResultsConfiguration: SearchResultsOptions,
  resolvedConfiguration: ResolvedProductRecommendationOptions,
  options?: SdkOptions,
  optionOverrides?: OptionOverrides,
  fetch = true,
  remount = false
) => {
  const allowedMountUrls = resolvedConfiguration.allowedMountUrls

  const visible = await waitForElementToBeVisible(
    resolvedConfiguration.containerSelector,
    0,
    remount ? 0 : MAX_ELEMENT_MOUNT_RETRIES
  )
  if (!visible && !remount) {
    console.error(
      `Failed to mount LupaSearch recommendations, element ${resolvedConfiguration.containerSelector} not found`
    )
    return
  }
  const mergedOptions = merge(
    { ...resolvedSearchResultsConfiguration, ...resolvedConfiguration },
    optionOverrides?.recommendations ?? {}
  )
  recommendations({ ...mergedOptions, options }, { fetch, allowedMountUrls })
}

const mountAllRecommendations = async (
  configuration: ExtendedPluginElementsConfiguration,
  options?: SdkOptions,
  optionOverrides?: OptionOverrides,
  fetch = true,
  remount = false
) => {
  if (!configuration.recommendations) {
    return
  }
  const resolvedSearchResultsConfiguration: SearchResultsOptions = JSON.parse(
    configuration.searchResults
  )
  const resolvedConfiguration:
    | ResolvedProductRecommendationOptions
    | ResolvedProductRecommendationOptions[] = JSON.parse(configuration.recommendations)
  if (Array.isArray(resolvedConfiguration)) {
    const mountPromises = resolvedConfiguration.map((recommendation) =>
      mountRecommendations(
        resolvedSearchResultsConfiguration,
        recommendation,
        options,
        optionOverrides,
        fetch,
        remount
      )
    )
    await Promise.all(mountPromises)
  } else {
    await mountRecommendations(
      resolvedSearchResultsConfiguration,
      resolvedConfiguration,
      options,
      optionOverrides,
      fetch,
      remount
    )
  }
}

const mountChat = async (
  configuration: ExtendedPluginElementsConfiguration,
  options?: SdkOptions,
  fetch = true,
  remount = false
) => {
  if (!configuration.genAiChat) {
    return
  }
  const resolvedSearchResultsConfiguration: SearchResultsOptions = JSON.parse(
    configuration.searchResults
  )
  const resolvedConfiguration = JSON.parse(configuration.genAiChat)
  const allowedMountUrls = resolvedConfiguration.allowedMountUrls

  const visible = await waitForElementToBeVisible(
    resolvedConfiguration.containerSelector,
    0,
    remount ? 0 : MAX_ELEMENT_MOUNT_RETRIES
  )
  if (!visible && !remount) {
    console.error(
      `Failed to mount LupaSearch chat, element ${resolvedConfiguration.containerSelector} not found`
    )
    return
  }
  chat(
    { ...resolvedSearchResultsConfiguration, ...resolvedConfiguration, options },
    { fetch, allowedMountUrls }
  )
}

const initTracking = async (configuration: ExtendedPluginElementsConfiguration) => {
  let trackingOptions: TrackingOptions = { trackBase: false }
  if (configuration.tracking) {
    const resolvedConfiguration: TrackingOptions = JSON.parse(configuration.tracking)
    if (resolvedConfiguration.trackBase) {
      trackingOptions = resolvedConfiguration
    }
  }
  setupTracking(trackingOptions)
}

const mount = async (
  configuration: PluginElementsConfiguration & {
    baseStyleLink?: string
  },
  options: SdkOptions = { environment: 'production' },
  optionOverrides: OptionOverrides = {},
  fetch = true,
  remount = false
) => {
  await applyStyles(configuration)
  const mountPromises = [
    mountSearchBox(configuration, options, optionOverrides, fetch, remount),
    mountSearchResults(configuration, options, optionOverrides, fetch, remount),
    mountProductList(configuration, options, optionOverrides, fetch, remount),
    mountAllRecommendations(configuration, options, optionOverrides, fetch, remount),
    mountChat(configuration, options, fetch, remount)
  ]
  await Promise.all(mountPromises)
  initTracking(configuration)
}

const init = async (
  configurationKey: string,
  options: SdkOptions = { environment: 'production' },
  optionOverrides: OptionOverrides = {}
) => {
  const isPreviewMode = checkIsPreviewMode()
  const plugin = await loadConfigurations(configurationKey, isPreviewMode, options, optionOverrides)
  const configuration = isPreviewMode
    ? plugin.previewConfiguration ?? plugin.configuration
    : plugin.configuration

  if (configuration) {
    await mount(configuration, options, optionOverrides)
  }
}

export default {
  init
}
