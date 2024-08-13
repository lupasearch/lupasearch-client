import { initPinia } from '@getlupa/vue'
import { createApp, type Component, reactive, h } from 'vue'

const getMountElement = (element: Element, mountingBehavior = 'replace', mountToParent: boolean) => {
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
