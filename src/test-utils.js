import { render } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'

export function createMockPinia(initialState = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

export function renderWithProviders(component, options = {}) {
  const {
    initialState = {},
    routes = [{ path: '/', component: { template: '<div>Home</div>' } }],
    pinia = createMockPinia(initialState),
    ...renderOptions
  } = options

  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  return {
    ...render(component, {
      global: {
        plugins: [pinia, router],
      },
      ...renderOptions,
    }),
    pinia,
    router,
  }
}