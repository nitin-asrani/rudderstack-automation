import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, Page, request } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import logger from '../utils/logger';

import { LoginPage } from '../pages/LoginPage';
import { MfaPage } from '../pages/MfaPage';
import { NavigationPage } from '../pages/NavigationPage';
import { DataPlanePage } from '../pages/DataPlanePage';
import { WebhookPage } from '../pages/WebhookPage';

// Load environment variables once at the top
const env = process.env.ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `../environment/.env.${env}`) });

logger.info(`Running tests with ENV: ${env}`);

let browser: Browser;
let page: Page;

let loginPage: LoginPage;
let mfaPage: MfaPage;
let navigationPage: NavigationPage;
let dataPlanePage: DataPlanePage;
let webhookPage: WebhookPage;

let dataPlaneUrl: string;
let writeKey: string;
let beforeDeliveredCount = 0;

const EVENT_PROCESSING_WAIT_MS = 90000;

/**
 * Validate essential environment variables to avoid runtime errors
 */
function validateEnv() {
  const requiredVars = ['LOGIN_USER', 'LOGIN_PASS', 'BASE_URL', 'BROWSER', 'HEADLESS'];
  for (const key of requiredVars) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

Given('I have valid credentials and environment configuration', async () => {
  validateEnv();
  logger.info(`UserID: ${process.env.LOGIN_USER}`);
  logger.info(`URL: ${process.env.BASE_URL}`);
  logger.info(`Browser: ${process.env.BROWSER}`);
  logger.info(`Headless mode: ${process.env.HEADLESS}`);
  // Do not log passwords for security reasons
});

When('I log in and navigate to connections', async () => {
  try {
    const browserName = (process.env.BROWSER || 'chromium').toLowerCase();
    const headless = process.env.HEADLESS === 'true';  // Convert string to boolean

    logger.info(`Launching browser: ${browserName} with headless=${headless}`);

    browser = await (browserName === 'firefox'
      ? firefox.launch({ headless })
      : browserName === 'webkit'
      ? webkit.launch({ headless })
      : chromium.launch({ headless }));

    page = await browser.newPage();

    // Initialize page objects
    loginPage = new LoginPage(page);
    mfaPage = new MfaPage(page);
    navigationPage = new NavigationPage(page);
    dataPlanePage = new DataPlanePage(page);
    webhookPage = new WebhookPage(page);

    logger.info(`Navigating to ${process.env.BASE_URL}`);
    await loginPage.navigate(process.env.BASE_URL!);

    logger.info('Logging in...');
    await loginPage.login(process.env.LOGIN_USER!, process.env.LOGIN_PASS!);

    logger.info('Skipping MFA steps...');
    await mfaPage.skipMfa();
    await mfaPage.goToDashboard();
    await mfaPage.closePopup();

    logger.info('Navigating to Connections tab...');
    await navigationPage.goToConnections();

  } catch (error) {
    logger.error(`Error during login and navigation: ${(error as Error).message}`);
    await browser?.close();
    throw error;
  }
});

Then('I capture the dataPlane URL and write key', async () => {
  dataPlaneUrl = await dataPlanePage.getDataPlaneUrl();
  writeKey = await dataPlanePage.getWriteKey();

  logger.info(`Captured Data Plane URL: ${dataPlaneUrl}`);
  logger.info(`Captured Write Key: ${writeKey}`);
});

When('I send an event via HTTP API', async () => {
  logger.info('Sending test event to HTTP API...');
  const reqContext = await request.newContext({
    baseURL: dataPlaneUrl,
    extraHTTPHeaders: {
      Authorization: 'Basic ' + Buffer.from(`${writeKey}:`).toString('base64'),
      'Content-Type': 'application/json',
    },
  });

  const response = await reqContext.post('/v1/track', {
    data: {
      userId: 'test-user',
      event: 'Test Event',
      properties: {},
    },
  });

  logger.info(`API Response Status: ${response.status()}`);
  if (response.status() !== 200) {
    throw new Error(`Event send failed with status: ${response.status()}`);
  }

  await reqContext.dispose();
});

Then('I open the webhook destination events tab', async () => {
  await webhookPage.openDestination();
  await webhookPage.openEventsTab();

  beforeDeliveredCount = await webhookPage.getDeliveredCount();
  logger.info(`Delivered event count before sending event: ${beforeDeliveredCount}`);
});

Then('I verify delivered events count increased', async () => {
  logger.info(`Waiting ${EVENT_PROCESSING_WAIT_MS / 1000} seconds for event processing...`);
  await page.waitForTimeout(EVENT_PROCESSING_WAIT_MS);
  await page.reload();

  const afterDeliveredCount = await webhookPage.getDeliveredCount();
  logger.info(`Delivered event count after sending event: ${afterDeliveredCount}`);

  if (afterDeliveredCount <= beforeDeliveredCount) {
    await browser?.close();
    throw new Error(
      `Delivered count did not increase: before ${beforeDeliveredCount}, after ${afterDeliveredCount}`
    );
  }

  await browser?.close();
  logger.info('Test completed successfully. Browser closed.');
});
