import { Page } from '@playwright/test';
import { locators } from '../utils/locators';
import logger from '../utils/logger';

/**
 * Page object representing the MFA (Multi-Factor Authentication) page.
 */
export class MfaPage {
  constructor(private readonly page: Page) {}

  /**
   * Clicks the "Skip MFA" link if available.
   */
  async skipMfa(): Promise<void> {
    try {
      logger.info('Attempting to skip MFA...');
      await this.page.getByRole(locators.mfa.skipMfaLink.role as any, { name: locators.mfa.skipMfaLink.name }).waitFor({ state: 'visible', timeout: 5000 });
      await this.page.getByRole(locators.mfa.skipMfaLink.role as any, { name: locators.mfa.skipMfaLink.name }).click();
      logger.info('Successfully skipped MFA.');
    } catch (error) {
      logger.warn(`Skip MFA link not found or failed to click: ${(error as Error).message}`);
      // Optionally rethrow or handle gracefully if MFA skip is not always required
    }
  }

  /**
   * Clicks the "Go to dashboard" button.
   */
  async goToDashboard(): Promise<void> {
    try {
      logger.info('Navigating to dashboard...');
      await this.page.getByRole(locators.mfa.goToDashboard.role as any, { name: locators.mfa.goToDashboard.name }).waitFor({ state: 'visible', timeout: 5000 });
      await this.page.getByRole(locators.mfa.goToDashboard.role as any, { name: locators.mfa.goToDashboard.name }).click();
      logger.info('Navigation to dashboard complete.');
    } catch (error) {
      logger.error(`Failed to go to dashboard: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Clicks the "Close" button on any popup.
   */
  async closePopup(): Promise<void> {
    try {
      logger.info('Closing popup...');
      await this.page.getByRole(locators.mfa.closeButton.role as any, { name: locators.mfa.closeButton.name }).waitFor({ state: 'visible', timeout: 5000 });
      await this.page.getByRole(locators.mfa.closeButton.role as any, { name: locators.mfa.closeButton.name }).click();
      logger.info('Popup closed.');
    } catch (error) {
      logger.warn(`Popup close button not found or failed to click: ${(error as Error).message}`);
      // Optionally ignore if popup isn't always present
    }
  }
}
