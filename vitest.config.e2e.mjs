import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import { loadEnvFile } from 'process'

export default defineConfig({
  test: {
    include: ['**/*.e2e-test.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
    env: loadEnvFile('.env.test.local'),
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
    tsConfigPaths(),
  ],
})
