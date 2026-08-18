import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5174';

/**
 * Los E2E viven bajo `tests/e2e/`. Antes `testDir` era `tests`, lo que obligaba
 * a Playwright a recorrer los ~430 tests de vitest en cada arranque para
 * descartarlos por `testMatch`.
 *
 * `webServer` invoca `npm run dev:lab`, que fija host y puerto en el propio
 * script. La forma anterior —`VITE_PORT=5174 npm run dev`— es una asignación de
 * entorno POSIX dentro del comando y no sobrevive fuera de un shell tipo sh.
 */
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',

  timeout: 30_000,
  expect: { timeout: 5_000 },

  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/testing/playwright', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL,
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  webServer: {
    command: 'npm run dev:lab',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
