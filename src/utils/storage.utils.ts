export const saveToLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // local storage not available, do nothing
  }
}

export const tryLoadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // local storage not available, do nothing
  }
}

export const saveToSessionStorage = (key: string, value: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // session storage not available, do nothing
  }
}

export const tryLoadFromSessionStorage = <T>(key: string): T | null => {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export const removeFromSessionStorage = (key: string) => {
  try {
    sessionStorage.removeItem(key)
  } catch {
    // session storage not available, do nothing
  }
}
