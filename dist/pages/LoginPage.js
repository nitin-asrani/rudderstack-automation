"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const locators_1 = require("../support/locators");
const logger_1 = __importDefault(require("../support/logger"));
class LoginPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async navigate(url) {
        logger_1.default.info('Navigating to login page...');
        await this.page.goto(url);
    }
    async login(email, password) {
        await this.page.fill(locators_1.locators.login.emailInput, email);
        await this.page.fill(locators_1.locators.login.passwordInput, password);
        await this.page.click(locators_1.locators.login.loginButton);
    }
}
exports.LoginPage = LoginPage;
