import { Page } from '@playwright/test';
import { locators } from '../support/locators';
import logger from '../support/logger';

export class NavigationPage {
  constructor(private page: Page) {}

  async goToConnections() {
    logger.info('Navigating to Connections tab...');
    await this.page.click(locators.navigation.connectionsTab);
  }
}
