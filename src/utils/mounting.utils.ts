import { initPinia } from '@getlupa/vue'
import { createApp, type Component, reactive, h } from 'vue'

const createDomPing = () => {
  let started = false

  return (intervalMs: number = 250) => {
    if (started) {
      return
    }
    started = true

    const flush = () => {
      const el = document.createElement('div')
      el.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;'
      el.setAttribute('data-nudge', Date.now().toString())
      document.body.appendChild(el)
      document.body.removeChild(el)
    }

    setInterval(flush, intervalMs)
  }
}

export const startDomPing = createDomPing()

const getMountElement = (
  element: Element,
  mountingBehavior = 'replace',
  mountToParent: boolean
) => {
  const parent = element?.parentElement
  if (mountingBehavior === 'replace') {
    let mountElement = element
    if (mountToParent) {
      mountElement = parent
    }
    return mountElement
  }
  if (mountingBehavior === 'append') {
    // append new child element and return it
    const newElement = document.createElement('div')
    element?.append(newElement)
    return newElement
  }
  if (mountingBehavior === 'prepend') {
    // prepend new child element and return it
    const newElement = document.createElement('div')
    element?.prepend(newElement)
    return newElement
  }
}

export const createVue = (
  selector: string | Element,
  mountingBehavior = 'replace',
  rootComponent: Component,
  options: Record<string, unknown>,
  mountToParent = false
) => {
  const pinia = initPinia()
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector

  const mountElement = getMountElement(element, mountingBehavior, mountToParent)

  if (!mountElement) {
    console.error(`Cannot mount LupaSearch component. Element "${selector}" not found`)
    return
  }

  let mountedComponent = null

  const props = reactive({ ...options })
  const app = createApp({
    render: () => (mountedComponent = h(rootComponent, props))
  })
  app.use(pinia)

  const mountedApp = app.mount(mountElement)

  if (mountToParent) {
    element?.remove()
  }

  return { mountedApp, mountedComponent, props, app, mountElement }
}

export const canMount = (allowedMountUrls?: string[]) => {
  if (allowedMountUrls && Array.isArray(allowedMountUrls) && allowedMountUrls.length) {
    const currentUrl = window.location.href
    return allowedMountUrls?.some((url) => currentUrl.includes(url))
  }
  return true
}
