import { Page } from '@playwright/test';
import { locators } from '../support/locators';
import logger from '../support/logger';

export class DataPlanePage {
  constructor(private page: Page) {}

  async getDataPlaneUrl(): Promise<string> {
    const url = await this.page.locator(locators.dataPlane.urlText).innerText();
    logger.info(`Captured Data Plane URL: ${url}`);
    return url;
  }

  async getWriteKey(): Promise<string> {
    const fullText = await this.page.locator(locators.dataPlane.writeKeyText).nth(1).innerText();
    logger.info(`Raw Write Key Text: ${fullText}`);
    const writeKey = fullText.replace(/^Write key\s*/i, '').trim();
    logger.info(`Extracted Write Key: ${writeKey}`);
    return writeKey;
  }
}
