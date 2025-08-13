import { Page } from '@playwright/test';
import { locators } from '../utils/locators';
import logger from '../utils/logger';

/**
 * Page object for interacting with the Webhook destination page.
 */
export class WebhookPage {
  constructor(private readonly page: Page) {}

  /**
   * Opens the webhook destination link.
   */
  async openDestination(): Promise<void> {
    try {
      logger.info('Opening webhook destination link...');
      await this.page.waitForSelector(locators.webhook.destinationLink, { state: 'visible', timeout: 5000 });
      await this.page.click(locators.webhook.destinationLink);
      logger.info('Webhook destination opened.');
    } catch (error) {
      logger.error(`Failed to open webhook destination: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Opens the Events tab within the webhook destination.
   */
  async openEventsTab(): Promise<void> {
    try {
      logger.info('Opening Events tab...');
      await this.page.getByRole(locators.webhook.eventsTab.role as any, { name: locators.webhook.eventsTab.name }).click();
      logger.info('Events tab opened.');
    } catch (error) {
      logger.error(`Failed to open Events tab: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Retrieves the count of delivered webhook events.
   * @returns {Promise<number>} Number of delivered events
   */
  async getDeliveredCount(): Promise<number> {
    try {
      await this.page.waitForSelector(locators.webhook.deliveredCountText, { state: 'visible', timeout: 5000 });
      const text = await this.page.locator(locators.webhook.deliveredCountText).nth(1).innerText();
      const count = parseInt(text, 10);
      if (isNaN(count)) {
        throw new Error(`Delivered count is not a valid number: "${text}"`);
      }
      logger.info(`Delivered events count: ${count}`);
      return count;
    } catch (error) {
      logger.error(`Failed to get delivered count: ${(error as Error).message}`);
      throw error;
    }
  }
}
