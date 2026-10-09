import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    pool: 'threads',
    threads: {
      singleThread: true,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/App.vue',
        'src/router.js',
        'src/features/auth/api/authApi.js',
        'src/features/auth/layouts/AuthLayout.vue',
        'src/features/auth/pages/LoginPage.vue',
        'src/features/auth/pages/RegisterPage.vue',
        'src/features/auth/states/authStore.js',
        'src/features/common/pages/NotFoundPage.vue'
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    },
  },
})