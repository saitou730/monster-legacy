const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure', screenshot: 'only-on-failure', video: 'retain-on-failure'
  },
  webServer: {
    command: 'npx http-server . -p 4173 -c-1',
    url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI, timeout: 120000
  },
  projects: [
    { name: 'android-chrome', use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 }, browserName: 'chromium' } },
    { name: 'mobile-360', use: { browserName: 'chromium', viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } },
    { name: 'mobile-430', use: { browserName: 'chromium', viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true } }
  ]
});
