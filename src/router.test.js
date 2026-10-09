import { describe, it, expect } from 'vitest'
import router from './router'

describe('router.js', () => {
  it('memiliki konfigurasi rute yang lengkap', () => {
    expect(router).toBeDefined()
    const routes = router.getRoutes()
    expect(routes.length).toBeGreaterThan(0)

    const paths = routes.map((r) => r.path)
    expect(paths).toContain('/')
    expect(paths).toContain('/login')
    expect(paths).toContain('/register')
  })
})