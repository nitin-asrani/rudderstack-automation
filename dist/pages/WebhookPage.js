"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookPage = void 0;
const locators_1 = require("../support/locators");
const logger_1 = __importDefault(require("../support/logger"));
class WebhookPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async openDestination() {
        await this.page.click(locators_1.locators.webhook.destinationLink);
    }
    async openEventsTab() {
        await this.page.getByRole(locators_1.locators.webhook.eventsTab.role, { name: locators_1.locators.webhook.eventsTab.name }).click();
    }
    async getDeliveredCount() {
        const text = await this.page.locator(locators_1.locators.webhook.deliveredCountText).nth(1).innerText();
        const count = parseInt(text);
        logger_1.default.info(`Delivered events count: ${count}`);
        return count;
    }
}
exports.WebhookPage = WebhookPage;
