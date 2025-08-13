"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const logger_1 = __importDefault(require("../utils/logger"));
const env = process.env.ENV || 'dev';
const envPath = path.resolve(__dirname, `../environment/.env.${env}`);
dotenv.config({ path: envPath });
logger_1.default.info(`Running with ENV: ${env}`);
const LoginPage_1 = require("../pages/LoginPage");
const MfaPage_1 = require("../pages/MfaPage");
const NavigationPage_1 = require("../pages/NavigationPage");
const DataPlanePage_1 = require("../pages/DataPlanePage");
const WebhookPage_1 = require("../pages/WebhookPage");
dotenv.config();
let browser;
let page;
let loginPage;
let mfaPage;
let navigationPage;
let dataPlanePage;
let webhookPage;
let dataPlaneUrl, writeKey;
let beforeDeliveredCount;
(0, cucumber_1.Given)('I have valid credentials and environment configuration', async () => {
    logger_1.default.info(`UserID: ${process.env.LOGIN_USER}`);
    logger_1.default.info(`Password: ${process.env.LOGIN_PASS}`);
    logger_1.default.info(`URL: ${process.env.BASE_URL}`);
    logger_1.default.info(`Browser: ${process.env.BROWSER}`);
});
(0, cucumber_1.When)('I log in and navigate to connections', async () => {
    const browserName = (process.env.BROWSER || 'chromium').toLowerCase();
    switch (browserName) {
        case 'firefox':
            browser = await test_1.firefox.launch({ headless: false });
            break;
        case 'webkit':
            browser = await test_1.webkit.launch({ headless: false });
            break;
        case 'chromium':
        default:
            browser = await test_1.chromium.launch({ headless: false });
            break;
    }
    page = await browser.newPage();
    loginPage = new LoginPage_1.LoginPage(page);
    mfaPage = new MfaPage_1.MfaPage(page);
    navigationPage = new NavigationPage_1.NavigationPage(page);
    dataPlanePage = new DataPlanePage_1.DataPlanePage(page);
    webhookPage = new WebhookPage_1.WebhookPage(page);
    await loginPage.navigate(process.env.BASE_URL);
    await loginPage.login(process.env.LOGIN_USER, process.env.LOGIN_PASS);
    await mfaPage.skipMfa();
    await mfaPage.goToDashboard();
    await mfaPage.closePopup();
    await navigationPage.goToConnections();
});
(0, cucumber_1.Then)('I capture the dataPlane URL and write key', async () => {
    dataPlaneUrl = await dataPlanePage.getDataPlaneUrl();
    writeKey = await dataPlanePage.getWriteKey();
});
(0, cucumber_1.When)('I send an event via HTTP API', async () => {
    logger_1.default.info('Sending test event to HTTP API...');
    const req = await test_1.request.newContext({
        baseURL: dataPlaneUrl,
        extraHTTPHeaders: {
            Authorization: 'Basic ' + Buffer.from(`${writeKey}:`).toString('base64'),
            'Content-Type': 'application/json',
        },
    });
    const response = await req.post('/v1/track', {
        data: {
            userId: 'test-user',
            event: 'Test Event',
            properties: {},
        },
    });
    logger_1.default.info(`API Response Status: ${response.status()}`);
    if (response.status() !== 200) {
        throw new Error(`Event send failed: ${response.status()}`);
    }
});
(0, cucumber_1.Then)('I open the webhook destination events tab', async () => {
    await webhookPage.openDestination();
    await webhookPage.openEventsTab();
    beforeDeliveredCount = await webhookPage.getDeliveredCount();
});
(0, cucumber_1.Then)('I verify delivered events count increased', async () => {
    logger_1.default.info('Waiting 90 seconds for event to be processed...');
    await page.waitForTimeout(90000);
    await page.reload();
    const afterDeliveredCount = await webhookPage.getDeliveredCount();
    if (afterDeliveredCount <= beforeDeliveredCount) {
        throw new Error(`Delivered count did not increase: before ${beforeDeliveredCount}, after ${afterDeliveredCount}`);
    }
    await browser.close();
    logger_1.default.info('Test completed and browser closed.');
});
//# sourceMappingURL=rudderflow.steps.js.map