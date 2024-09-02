import { chat, productList, recommendations, searchBox, searchResults } from '@/mounting'
import {
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

let styleElement: HTMLStyleElement | null = null

export type ExtendedPluginElementsConfiguration = PluginElementsConfiguration & {
  baseStyleLink?: string
}

export type ExtendedPluginConfiguration = PluginConfiguration & {
  previewConfiguration: ExtendedPluginElementsConfiguration
  configuration: ExtendedPluginElementsConfiguration
}

const waitForElementToBeVisible = async (
  element: string | Element,
  retries = 0,
  maxRetries = 10,
  interval = 10
): Promise<boolean> => {
  if (retries > maxRetries) {
    return false
  }
  if (typeof element === 'string') {
    element = document.querySelector(element)
  }
  if (element) {
    return true
  } else {
    setTimeout(() => {
      waitForElementToBeVisible(element, retries + 1, maxRetries, interval + 10)
    }, interval)
  }
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
    saveToSessionStorage(PREVIEW_PARAMETER, false)
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
      await mount(configuration, false)
    }, 5000)
    return existingConfiguration
  }
  return loadAndSaveConfigurationFromServer(configurationKey, options)
}

const applyStyles = async (configuration: ExtendedPluginElementsConfiguration) => {
  const visible = await waitForElementToBeVisible(document.head)
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

const mountSearchBox = async (configuration: ExtendedPluginElementsConfiguration, fetch = true) => {
  if (!configuration.searchBox) {
    return;
  }
  const resolvedConfiguration: SearchBoxOptions = eval(`(${configuration.searchBox})`)
  const visible = await waitForElementToBeVisible(resolvedConfiguration.inputSelector)
  if (!visible) {
    console.error(
      `Failed to mount LupaSearch search box, input element ${resolvedConfiguration.inputSelector} not found`
    )
    return
  }
  searchBox(resolvedConfiguration, { fetch })
}

const mountSearchResults = async (
  configuration: ExtendedPluginElementsConfiguration,
  fetch = true
) => {
  if (!configuration.searchResults) {
    return
  }
  const resolvedConfiguration: SearchResultsOptions = eval(`(${configuration.searchResults})`)
  const visible = await waitForElementToBeVisible(resolvedConfiguration.containerSelector)
  if (!visible) {
    console.error(
      `Failed to mount LupaSearch search results, element ${resolvedConfiguration.containerSelector} not found`
    )
    return
  }
  searchResults(resolvedConfiguration, { fetch })
}

const mountProductList = async (
  configuration: ExtendedPluginElementsConfiguration,
  fetch = true
) => {
  if (!configuration.productList) {
    return
  }
  const resolvedSearchResultsConfiguration: SearchResultsOptions = eval(
    `(${configuration.searchResults})`
  )
  const resolvedConfiguration: ProductListOptions = eval(`(${configuration.productList})`)
  const visible = await waitForElementToBeVisible(resolvedConfiguration.containerSelector)
  if (!visible) {
    console.error(
      `Failed to mount LupaSearch product list, element ${resolvedConfiguration.containerSelector} not found`
    )
    return
  }
  productList({ ...resolvedSearchResultsConfiguration, ...resolvedConfiguration }, { fetch })
}

const mountRecommendations = async (
  configuration: ExtendedPluginElementsConfiguration,
  fetch = true
) => {
  if (!configuration.recommendations) {
    return
  }
  const resolvedSearchResultsConfiguration: SearchResultsOptions = eval(
    `(${configuration.searchResults})`
  )
  const resolvedConfiguration: ProductRecommendationOptions = eval(
    `(${configuration.recommendations})`
  )
  const visible = await waitForElementToBeVisible(resolvedConfiguration.containerSelector)
  if (!visible) {
    console.error(
      `Failed to mount LupaSearch recommendations, element ${resolvedConfiguration.containerSelector} not found`
    )
    return
  }
  recommendations({ ...resolvedSearchResultsConfiguration, ...resolvedConfiguration }, { fetch })
}

const mountChat = async (configuration: ExtendedPluginElementsConfiguration, fetch = true) => {
  if (!configuration.genAiChat) {
    return
  }
  const resolvedSearchResultsConfiguration: SearchResultsOptions = eval(
    `(${configuration.searchResults})`
  )
  const resolvedConfiguration = eval(`(${configuration.genAiChat})`)
  const visible = await waitForElementToBeVisible(resolvedConfiguration.containerSelector)
  if (!visible) {
    console.error(
      `Failed to mount LupaSearch chat, element ${resolvedConfiguration.containerSelector} not found`
    )
    return
  }
  chat({ ...resolvedSearchResultsConfiguration, ...resolvedConfiguration }, { fetch })
}

const mount = async (
  configuration: PluginElementsConfiguration & {
    baseStyleLink?: string
  },
  fetch = true
) => {
  await applyStyles(configuration)
  const mountPromises = [
    mountSearchBox(configuration, fetch),
    mountSearchResults(configuration, fetch),
    mountProductList(configuration, fetch),
    mountRecommendations(configuration, fetch),
    mountChat(configuration, fetch)
  ]
  await Promise.all(mountPromises)
}

const init = async (configurationKey: string, options?: SdkOptions) => {
  const isPreviewMode = checkIsPreviewMode()
  const plugin = await loadConfigurations(configurationKey, isPreviewMode, options)
  const configuration = isPreviewMode
    ? plugin.previewConfiguration ?? plugin.configuration
    : plugin.configuration
  await mount(configuration)
}

export default {
  init
}
