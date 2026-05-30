import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/playwright',
  timeout: 60_000,
  expect: { timeout: 5000 },
  use: {
    baseURL: 'http://127.0.0.1:5174',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } }
  ],

});
