import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// The .feature files are the tests; bddgen turns them into Playwright specs.
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts'],
});

export default defineConfig({
  testDir,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  // One retry on CI only: the demo sleeps when idle and the first request
  // after that can be slow. A test that needs the retry shows as "flaky" in
  // the report, so it is never hidden.
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  globalSetup: './global-setup.ts',
  use: {
    // Point the suite at any copy of the app, e.g. a local or QA server.
    baseURL: process.env.BASE_URL ?? 'https://appdoivo-demo.fly.dev',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'api', grep: /@api/ },
    { name: 'iphone', grep: /@ui/, use: { ...devices['iPhone 13'] } },
    { name: 'desktop', grep: /@ui/, use: { ...devices['Desktop Chrome'] } },
  ],
});
