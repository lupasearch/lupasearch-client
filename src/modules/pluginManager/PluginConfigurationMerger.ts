import { ResolvedSearchBoxOptions, ResolvedSearchResultOptions } from '@/types/ResolvedOptions'
import { merge } from '@/utils/merger.utils'
import {
  DocumentElement,
  SearchBoxOptions,
  SearchBoxPanelType,
  SearchResultsOptions
} from '@getlupa/vue'

const mergeSearchBoxConfiguration = (
  options: ResolvedSearchBoxOptions,
  overrides: Partial<SearchBoxOptions>
) => {
  for (const panel of options.panels ?? []) {
    if (panel.type !== SearchBoxPanelType.DOCUMENT) {
      continue
    }
    const overridePanel = overrides.panels?.find((p) => p.queryKey === panel.queryKey)
    if (!overridePanel || overridePanel.type !== SearchBoxPanelType.DOCUMENT || !overridePanel) {
      continue
    }
    panel.elements = panel.elements?.map((element) => {
      const overrideElement = overridePanel?.elements?.find((e) => e.key === element.key)
      if (!overrideElement) {
        return element
      }
      return {
        ...element,
        ...overrideElement
      }
    }) as DocumentElement[]
  }
  const { panels, ...overridesWithoutPanels } = overrides
  return merge(options, overridesWithoutPanels)
}

const mergeSearchResultsConfiguration = (
  options: ResolvedSearchResultOptions,
  overrides: Partial<SearchResultsOptions>
) => {
  if (!overrides.elements) {
    return merge(options, overrides)
  }
  const elements = options.elements?.map((element) => {
    const overrideElement = overrides.elements?.find((e) => e.key === element.key)
    if (!overrideElement) {
      return element
    }
    return {
      ...element,
      ...overrideElement
    }
  })
  options.elements = elements as DocumentElement[]
  const { elements: _, ...overridesWithoutElements } = overrides
  return merge(options, overridesWithoutElements)
}

export default {
  mergeSearchBoxConfiguration,
  mergeSearchResultsConfiguration
}
