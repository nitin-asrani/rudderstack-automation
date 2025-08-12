import { Page } from '@playwright/test';
import { locators } from '../support/locators';
import logger from '../support/logger';

export class MfaPage {
  constructor(private page: Page) {}

  async skipMfa() {
    logger.info('Skipping MFA...');
    await this.page.getByRole(locators.mfa.skipMfaLink.role as any, { name: locators.mfa.skipMfaLink.name }).click();
  }

  async goToDashboard() {
    logger.info('Going to dashboard...');
    await this.page.getByRole(locators.mfa.goToDashboard.role as any, { name: locators.mfa.goToDashboard.name }).click();
  }

  async closePopup() {
    logger.info('Closing popup...');
    await this.page.getByRole(locators.mfa.closeButton.role as any, { name: locators.mfa.closeButton.name }).click();
  }
}
