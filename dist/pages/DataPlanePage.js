"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPlanePage = void 0;
const locators_1 = require("../support/locators");
const logger_1 = __importDefault(require("../support/logger"));
class DataPlanePage {
    page;
    constructor(page) {
        this.page = page;
    }
    async getDataPlaneUrl() {
        const url = await this.page.locator(locators_1.locators.dataPlane.urlText).innerText();
        logger_1.default.info(`Captured Data Plane URL: ${url}`);
        return url;
    }
    async getWriteKey() {
        const fullText = await this.page.locator(locators_1.locators.dataPlane.writeKeyText).nth(1).innerText();
        logger_1.default.info(`Raw Write Key Text: ${fullText}`);
        const writeKey = fullText.replace(/^Write key\s*/i, '').trim();
        logger_1.default.info(`Extracted Write Key: ${writeKey}`);
        return writeKey;
    }
}
exports.DataPlanePage = DataPlanePage;
