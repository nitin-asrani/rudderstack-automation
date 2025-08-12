import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, Page, request } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import logger from '../support/logger';
const env = process.env.ENV || 'dev'; // fallback to 'dev'
const envPath = path.resolve(__dirname, `../.env.${env}`);
dotenv.config({ path: envPath });
logger.info(`Running with ENV: ${env}`);

import { LoginPage } from '../pages/LoginPage';
import { MfaPage } from '../pages/MfaPage';
import { NavigationPage } from '../pages/NavigationPage';
import { DataPlanePage } from '../pages/DataPlanePage';
import { WebhookPage } from '../pages/WebhookPage';

dotenv.config();

let browser: Browser;
let page: Page;
let loginPage: LoginPage;
let mfaPage: MfaPage;
let navigationPage: NavigationPage;
let dataPlanePage: DataPlanePage;
let webhookPage: WebhookPage;

let dataPlaneUrl: string, writeKey: string;
let beforeDeliveredCount: number;

Given('I have valid credentials and environment configuration', async () => {
  logger.info(`UserID: ${process.env.LOGIN_USER}`);
  logger.info(`Password: ${process.env.LOGIN_PASS}`);
  logger.info(`URL: ${process.env.BASE_URL}`);
  logger.info(`Browser: ${process.env.BROWSER}`);
});

When('I log in and navigate to connections', async () => {
  const browserName = (process.env.BROWSER || 'chromium').toLowerCase();

  switch (browserName) {
    case 'firefox':
      browser = await firefox.launch({ headless: false });
      break;
    case 'webkit':
      browser = await webkit.launch({ headless: false });
      break;
    case 'chromium':
    default:
      browser = await chromium.launch({ headless: false });
      break;
  }

  page = await browser.newPage();

  loginPage = new LoginPage(page);
  mfaPage = new MfaPage(page);
  navigationPage = new NavigationPage(page);
  dataPlanePage = new DataPlanePage(page);
  webhookPage = new WebhookPage(page);

  await loginPage.navigate(process.env.BASE_URL!);
  await loginPage.login(process.env.LOGIN_USER!, process.env.LOGIN_PASS!);

  await mfaPage.skipMfa();
  await mfaPage.goToDashboard();
  await mfaPage.closePopup();

  await navigationPage.goToConnections();
});

Then('I capture the dataPlane URL and write key', async () => {
  dataPlaneUrl = await dataPlanePage.getDataPlaneUrl();
  writeKey = await dataPlanePage.getWriteKey();
});

When('I send an event via HTTP API', async () => {
  logger.info('Sending test event to HTTP API...');
  const req = await request.newContext({
    baseURL: dataPlaneUrl,
    extraHTTPHeaders: {
      Authorization: 'Basic ' + Buffer.from(`${writeKey}:`).toString('base64'),
      'Content-Type': 'application/json',
    },
  });

  const response = await req.post('/v1/track', {
    data: {
      userId: 'test-user',
      event: 'Test Event',
      properties: {},
    },
  });

  logger.info(`API Response Status: ${response.status()}`);
  if (response.status() !== 200) {
    throw new Error(`Event send failed: ${response.status()}`);
  }
});

Then('I open the webhook destination events tab', async () => {
  await webhookPage.openDestination();
  await webhookPage.openEventsTab();
  beforeDeliveredCount = await webhookPage.getDeliveredCount();
});

Then('I verify delivered events count increased', async () => {
  logger.info('Waiting 90 seconds for event to be processed...');
  await page.waitForTimeout(90000);
  await page.reload();
  const afterDeliveredCount = await webhookPage.getDeliveredCount();

  if (afterDeliveredCount <= beforeDeliveredCount) {
    throw new Error(`Delivered count did not increase: before ${beforeDeliveredCount}, after ${afterDeliveredCount}`);
  }

  await browser.close();
  logger.info('Test completed and browser closed.');
});
