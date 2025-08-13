"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationPage = void 0;
const locators_1 = require("../utils/locators");
const logger_1 = __importDefault(require("../utils/logger"));
class NavigationPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async goToConnections() {
        logger_1.default.info('Navigating to Connections tab...');
        await this.page.click(locators_1.locators.navigation.connectionsTab);
    }
}
exports.NavigationPage = NavigationPage;
//# sourceMappingURL=NavigationPage.js.map