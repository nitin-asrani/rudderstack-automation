"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locators = void 0;
exports.locators = {
    login: {
        emailInput: '#text-input-email',
        passwordInput: '#text-input-password',
        loginButton: 'button[type="button"]',
    },
    navigation: {
        connectionsTab: 'text=Connections',
    },
    dataPlane: {
        urlText: '.sc-jrkPvW.ebfakN.text-ellipsis',
        writeKeyText: '.sc-kDnyiN.kWZpvc.text-ellipsis',
    },
    webhook: {
        destinationLink: 'text=TestAutomationDestination',
        eventsTab: { role: 'tab', name: 'Events' },
        deliveredCountText: '.sc-hHvloA.jFcMOz h2 span',
    },
    mfa: {
        skipMfaLink: {
            role: 'link',
            name: "I'll do this later"
        },
        goToDashboard: {
            role: 'button',
            name: 'Go to dashboard',
        },
        closeButton: {
            role: 'button',
            name: 'Close',
        },
    },
};
//# sourceMappingURL=locators.js.map