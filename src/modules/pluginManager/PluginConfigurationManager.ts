import { chat, productList, recommendations, searchBox, searchResults } from '@/mounting'
import { waitForElementToBeVisible } from '@/utils/document.utils'
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
  ProductListOptions,
  ProductRecommendationOptions,
  SdkOptions,
  SearchBoxOptions,
  SearchResultsOptions,
  fetchPluginConfiguration
} from '@getlupa/vue'

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
  options?: SdkOptions
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
  options?: SdkOptions
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
        await mount(configuration, options, false, true)
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
  if (styleElement) {
    styleElement.remove()
  }
  styleElement = document.createElement('style')
  if (baseStyleLink) {
    styleElement.innerHTML = `
      @import url('${baseStyleLink}');
      @import url('https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css') 
      ${configuration.customStyles ?? ''}
    `
  }
  document.head.appendChild(styleElement)
}

const mountSearchBox = async (
  configuration: ExtendedPluginElementsConfiguration,
  options?: SdkOptions,
  fetch = true,
  remount = false
) => {
  if (!configuration.searchBox) {
    return
  }
  const resolvedConfiguration: SearchBoxOptions = JSON.parse(configuration.searchBox)
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
  searchBox({ ...resolvedConfiguration, options }, { fetch })
}

const mountSearchResults = async (
  configuration: ExtendedPluginElementsConfiguration,
  options?: SdkOptions,
  fetch = true,
  remount = false
) => {
  if (!configuration.searchResults) {
    return
  }
  const resolvedConfiguration: SearchResultsOptions = JSON.parse(configuration.searchResults)
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
  searchResults({ ...resolvedConfiguration, options }, { fetch })
}

const mountProductList = async (
  configuration: ExtendedPluginElementsConfiguration,
  options?: SdkOptions,
  fetch = true,
  remount = false
) => {
  if (!configuration.productList) {
    return
  }
  const resolvedSearchResultsConfiguration: SearchResultsOptions = JSON.parse(
    configuration.searchResults
  )
  const resolvedConfiguration: ProductListOptions = JSON.parse(configuration.productList)
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
  productList(
    { ...resolvedSearchResultsConfiguration, ...resolvedConfiguration, options },
    { fetch }
  )
}

const mountRecommendations = async (
  configuration: ExtendedPluginElementsConfiguration,
  options?: SdkOptions,
  fetch = true,
  remount = false
) => {
  if (!configuration.recommendations) {
    return
  }
  const resolvedSearchResultsConfiguration: SearchResultsOptions = JSON.parse(
    configuration.searchResults
  )
  const resolvedConfiguration: ProductRecommendationOptions = JSON.parse(
    configuration.recommendations
  )
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
  recommendations(
    { ...resolvedSearchResultsConfiguration, ...resolvedConfiguration, options },
    { fetch }
  )
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
  chat({ ...resolvedSearchResultsConfiguration, ...resolvedConfiguration, options }, { fetch })
}

const mount = async (
  configuration: PluginElementsConfiguration & {
    baseStyleLink?: string
  },
  options?: SdkOptions,
  fetch = true,
  remount = false
) => {
  await applyStyles(configuration)
  const mountPromises = [
    mountSearchBox(configuration, options, fetch, remount),
    mountSearchResults(configuration, options, fetch, remount),
    mountProductList(configuration, options, fetch, remount),
    mountRecommendations(configuration, options, fetch, remount),
    mountChat(configuration, options, fetch, remount)
  ]
  await Promise.all(mountPromises)
}

const init = async (configurationKey: string, options?: SdkOptions) => {
  const isPreviewMode = checkIsPreviewMode()
  const plugin = await loadConfigurations(configurationKey, isPreviewMode, options)
  const configuration = isPreviewMode
    ? plugin.previewConfiguration ?? plugin.configuration
    : plugin.configuration

  if (configuration) {
    await mount(configuration, options)
  }
}

export default {
  init
}
