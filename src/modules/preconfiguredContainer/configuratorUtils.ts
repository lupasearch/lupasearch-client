import { SearchResultDemoOptions } from '@/types/PreconfiguredSearchContainerOptions'

export const displayDiscountedPriceSection = (
  doc: Record<string, string>,
  options: SearchResultDemoOptions
) => {
  const discountPrice = doc[options.fields.discountPriceKey ?? '']
  const regularPrice = doc[options.fields.regularPriceKey ?? '']
  return discountPrice && regularPrice && discountPrice < regularPrice
}

export const displayRegularPriceSection = (
  doc: Record<string, string>,
  options: SearchResultDemoOptions
) => {
  const discountPrice = doc[options.fields.discountPriceKey ?? '']
  const regularPrice = doc[options.fields.regularPriceKey ?? '']
  const anyPrice = discountPrice || regularPrice
  return anyPrice && !displayDiscountedPriceSection(doc, options)
}

export const escapeHtml = (source?: string): string | undefined => {
  if (!source) {
    return source
  }
  return `${source}`
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const toMaxDecimalPlaces = (
  value?: string | number,
  maxDecimal = 2
): string | number | undefined => {
  if (!value) {
    return 0
  }
  try {
    return +parseFloat(`${value}`).toFixed(maxDecimal)
  } catch {
    return `${value}`
  }
}

export const capitalize = (value?: string) => {
  if (!value) {
    return ''
  }
  return value.charAt(0).toLocaleUpperCase() + value.slice(1)
}

export const getAlphanumeric = (value?: string) => {
  if (!value) {
    return ''
  }
  return value.replace(/[\W_]/g, ' ')
}

export const getAdditionalElements = (fields: string[]) => {
  return fields.map((key) => ({
    type: 'custom',
    key,
    label: capitalize(getAlphanumeric(key)),
    className: 'lupa-custom',
    display: (doc: Record<string, string>) => Boolean(doc[key])
  }))
}

export const addFieldIfKeyExists = (field: string, key?: string, config?: any) => {
  if (key) {
    return config
  }
  return { key: field, type: 'customHtml', display: () => false }
}
