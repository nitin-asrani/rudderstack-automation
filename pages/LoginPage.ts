import { Page } from '@playwright/test';
import { locators } from '../utils/locators';
import logger from '../utils/logger';

/**
 * Page object representing the Login page.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  /**
   * Navigates to the login page URL.
   * @param url - The URL of the login page.
   */
  async navigate(url: string): Promise<void> {
    try {
      logger.info(`Navigating to login page: ${url}`);
      await this.page.goto(url, { waitUntil: 'load' });
      logger.info('Navigation to login page complete.');
    } catch (error) {
      logger.error(`Failed to navigate to login page: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Logs in using provided email and password.
   * Waits for login button to be enabled before clicking.
   * @param email - User email address.
   * @param password - User password.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      logger.info('Filling login credentials...');
      await this.page.fill(locators.login.emailInput, email);
      await this.page.fill(locators.login.passwordInput, password);

      // Wait for the login button to be enabled and visible before clicking
      await this.page.waitForSelector(locators.login.loginButton, { state: 'visible', timeout: 5000 });

      logger.info('Clicking login button...');
      await this.page.click(locators.login.loginButton);
    } catch (error) {
      logger.error(`Login failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Optionally, you can add a method to verify login success.
   * Example:
   * async verifyLoginSuccess(): Promise<void> {
   *   await this.page.waitForSelector('selector-for-logged-in-element', { timeout: 10000 });
   *   logger.info('Login successful.');
   * }
   */
}
