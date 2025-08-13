import { Page } from '@playwright/test';
import { locators } from '../utils/locators';
import logger from '../utils/logger';

/**
 * Page object representing the Data Plane page.
 */
export class DataPlanePage {
  constructor(private readonly page: Page) {}

  /**
   * Retrieves the Data Plane URL from the page.
   * @returns {Promise<string>} The Data Plane URL text.
   * @throws Will throw an error if the locator is not found or the text is empty.
   */
  async getDataPlaneUrl(): Promise<string> {
    try {
      await this.page.waitForSelector(locators.dataPlane.urlText, { state: 'visible', timeout: 5000 });
      const url = await this.page.locator(locators.dataPlane.urlText).innerText();

      if (!url) {
        throw new Error('Data Plane URL text is empty.');
      }

      logger.info(`Captured Data Plane URL: ${url}`);
      return url;
    } catch (error) {
      logger.error(`Failed to get Data Plane URL: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Retrieves and extracts the Write Key from the page.
   * @returns {Promise<string>} The extracted Write Key.
   * @throws Will throw an error if the locator is not found or the key cannot be extracted.
   */
  async getWriteKey(): Promise<string> {
    try {
      // Wait for the element to be visible to ensure stability
      await this.page.waitForSelector(locators.dataPlane.writeKeyText, { state: 'visible', timeout: 5000 });

      // Use nth(1) to get the second element (index 1)
      const fullText = await this.page.locator(locators.dataPlane.writeKeyText).nth(1).innerText();

      if (!fullText) {
        throw new Error('Write Key text is empty.');
      }

      logger.info(`Raw Write Key Text: ${fullText}`);

      // Improved regex to extract after "Write key" ignoring case and optional whitespace
      const match = fullText.match(/write key\s*(.*)/i);
      if (!match || !match[1]) {
        throw new Error('Unable to extract Write Key from text.');
      }

      const writeKey = match[1].trim();
      logger.info(`Extracted Write Key: ${writeKey}`);
      return writeKey;
    } catch (error) {
      logger.error(`Failed to get Write Key: ${(error as Error).message}`);
      throw error;
    }
  }
}
