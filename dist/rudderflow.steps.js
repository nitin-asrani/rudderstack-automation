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
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let browser;
let page;
let dataPlaneUrl, writeKey;
let beforeDeliveredCount;
(0, cucumber_1.Given)('I have valid credentials and environment configuration', async () => {
    console.log('UserID: ', process.env.LOGIN_USER);
    console.log('Password: ', process.env.LOGIN_PASS);
    console.log('URL: ', process.env.BASE_URL);
    console.log('Browser: ', process.env.BROWSER);
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
    await page.goto(process.env.BASE_URL);
    await page.fill('#text-input-email', process.env.LOGIN_USER);
    await page.fill('#text-input-password', process.env.LOGIN_PASS);
    await page.click('button[type="button"]');
    await page.click('text=Connections');
});
(0, cucumber_1.Then)('I capture the dataPlane URL and write key', async () => {
    dataPlaneUrl = await page.locator('.sc-jrkPvW.ebfakN.text-ellipsis').innerText();
    console.log('Captured Data Plane URL:', dataPlaneUrl);
    const fullText = await page.locator('.sc-kDnyiN.kWZpvc.text-ellipsis').nth(1).innerText();
    console.log('Raw text:', fullText);
    writeKey = fullText.replace(/^Write key\s*/i, '').trim();
    console.log('Extracted write key:', writeKey);
});
(0, cucumber_1.When)('I send an event via HTTP API', async () => {
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
    console.log('API Response Status:', response.status());
    if (response.status() !== 200) {
        throw new Error(`Event send failed: ${response.status()}`);
    }
});
(0, cucumber_1.Then)('I open the webhook destination events tab', async () => {
    await page.click('text=TestAutomationDestination');
    await page.getByRole('tab', { name: 'Events' }).click();
    const beforeText = await page.locator('.sc-hHvloA.jFcMOz h2 span').nth(1).innerText();
    beforeDeliveredCount = parseInt(beforeText);
    console.log('Delivered Events Before:', beforeDeliveredCount);
});
(0, cucumber_1.Then)('I verify delivered events count increased', async () => {
    await page.waitForTimeout(60000);
    await page.reload();
    const afterText = await page.locator('.sc-hHvloA.jFcMOz h2 span').nth(1).innerText();
    const after = parseInt(afterText);
    console.log('Delivered Events After:', after);
    if (after <= beforeDeliveredCount) {
        throw new Error(`Failed count did not increase: before ${beforeDeliveredCount}, after ${after}`);
    }
    await browser.close();
});
