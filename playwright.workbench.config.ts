import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/workbench',
  outputDir: './test-results/workbench',
  timeout: 60000,
  expect: { timeout: 10000 },
  workers: 2,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3015',
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run serve -- --port 3015',
        url: 'http://localhost:3015',
        reuseExistingServer: false,
      },
})
