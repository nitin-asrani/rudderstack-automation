import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Determine environment (default to 'development')
const env = process.env.NODE_ENV || 'development';

// Load environment variables from .env file according to environment
const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
const result = dotenv.config({ path: envFilePath });

if (result.error) {
  console.warn(`⚠️ Environment file ${envFilePath} not found, falling back to default .env`);
  dotenv.config(); // fallback to default .env
} else {
  console.log(`✅ Loaded environment variables from ${envFilePath}`);
}

/**
 * Playwright Test Configuration
 */
export default defineConfig({
  testDir: './tests',  // Set your tests directory here
  timeout: 30 * 1000,  // Max time per test in milliseconds
  retries: process.env.CI ? 2 : 0,  // Retry on CI only

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',  // Default fallback baseURL
    headless: true,                                          // Run tests in headless mode
    viewport: { width: 1280, height: 720 },                  // Default viewport size
    ignoreHTTPSErrors: true,                                  
    video: 'retain-on-failure',                              // Record video only on failure
    screenshot: 'only-on-failure',                           // Capture screenshots only on failure
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  reporter: [['html', { open: 'never' }]],  // Adjust reporter options as needed
});
