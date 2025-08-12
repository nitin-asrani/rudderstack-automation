import { Page } from '@playwright/test';
import { locators } from '../support/locators';
import logger from '../support/logger';

export class LoginPage {
  constructor(private page: Page) {}

  async navigate(url: string) {
    logger.info('Navigating to login page...');
    await this.page.goto(url);
  }

  async login(email: string, password: string) {
    await this.page.fill(locators.login.emailInput, email);
    await this.page.fill(locators.login.passwordInput, password);
    await this.page.click(locators.login.loginButton);
  }
}
