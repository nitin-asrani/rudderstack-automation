import { Page } from '@playwright/test';
import { locators } from '../support/locators';
import logger from '../support/logger';

export class WebhookPage {
  constructor(private page: Page) {}

  async openDestination() {
    await this.page.click(locators.webhook.destinationLink);
  }

  async openEventsTab() {
    await this.page.getByRole(locators.webhook.eventsTab.role as any, { name: locators.webhook.eventsTab.name }).click();
  }

  async getDeliveredCount(): Promise<number> {
    const text = await this.page.locator(locators.webhook.deliveredCountText).nth(1).innerText();
    const count = parseInt(text);
    logger.info(`Delivered events count: ${count}`);
    return count;
  }
}
