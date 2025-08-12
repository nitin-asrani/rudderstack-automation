"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfaPage = void 0;
const locators_1 = require("../support/locators");
const logger_1 = __importDefault(require("../support/logger"));
class MfaPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async skipMfa() {
        logger_1.default.info('Skipping MFA...');
        await this.page.getByRole(locators_1.locators.mfa.skipMfaLink.role, { name: locators_1.locators.mfa.skipMfaLink.name }).click();
    }
    async goToDashboard() {
        logger_1.default.info('Going to dashboard...');
        await this.page.getByRole(locators_1.locators.mfa.goToDashboard.role, { name: locators_1.locators.mfa.goToDashboard.name }).click();
    }
    async closePopup() {
        logger_1.default.info('Closing popup...');
        await this.page.getByRole(locators_1.locators.mfa.closeButton.role, { name: locators_1.locators.mfa.closeButton.name }).click();
    }
}
exports.MfaPage = MfaPage;
