import { defineConfig, devices } from '@playwright/test';

const testFirebaseConfig = JSON.stringify({
  apiKey: 'playwright-test-api-key',
  authDomain: 'localhost',
  projectId: 'wfrc-bike-map-e2e',
  appId: '1:123456789:web:playwright',
});

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm exec vite --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_FIREBASE_CONFIG: testFirebaseConfig,
    },
    timeout: 120_000,
  },
});
