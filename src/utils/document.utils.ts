export const waitForElementToBeVisible = async (
  element: string | Element,
  retries = 0,
  maxRetries = 30,
  interval = 10
): Promise<boolean> => {
  let foundElement: Element | null = null

  if (typeof element === 'string') {
    foundElement = document.querySelector(element)
  } else {
    foundElement = element
  }

  if (foundElement) {
    return true
  }

  if (retries >= maxRetries) {
    return false
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        waitForElementToBeVisible(
          element,
          retries + 1,
          maxRetries,
          Math.min(500, interval + Math.round(0.5 * interval))
        )
      )
    }, interval)
  })
}
