import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@': './src',
      '@application': './src/application',
      '@core': './src/core',
      '@infra': './src/infra'
    },
    testTimeout: 30_000,
    exclude: ['./src/tests', './dist', 'node_modules']
  }
})
