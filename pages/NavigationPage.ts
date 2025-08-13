import { Page } from '@playwright/test';
import { locators } from '../utils/locators';
import logger from '../utils/logger';

/**
 * Page object representing navigation actions.
 */
export class NavigationPage {
  constructor(private readonly page: Page) {}

  /**
   * Navigates to the Connections tab.
   */
  async goToConnections(): Promise<void> {
    try {
      logger.info('Navigating to Connections tab...');
      await this.page.waitForSelector(locators.navigation.connectionsTab, { state: 'visible', timeout: 5000 });
      await this.page.click(locators.navigation.connectionsTab);
      logger.info('Successfully navigated to Connections tab.');
    } catch (error) {
      logger.error(`Failed to navigate to Connections tab: ${(error as Error).message}`);
      throw error;
    }
  }
}
