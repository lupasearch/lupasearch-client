export const getQueryParam = (name: string): string | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  } catch {
    return null
  }
}
