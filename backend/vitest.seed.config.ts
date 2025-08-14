import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@': './src',
      '@application': './src/application',
      '@core': './src/core',
      '@infra': './src/infra',
    },
    exclude: ['./src/application', './src/core', './src/infra', './dist'],
  },
})
