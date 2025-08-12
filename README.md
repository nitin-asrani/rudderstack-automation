# RudderStack Automation Test Suite

This project is an end-to-end test automation framework for RudderStack's UI and API interactions using **Playwright**, **Cucumber**, and **TypeScript**, integrated with **HTML reporting** and **GitHub Actions CI**.

---

## 📁 Project Structure

```
rudderstack-tests/
├── features/                # Feature files
├── pages/                   # Page Object Models
├── steps/                   # Step Definitions
├── support/                 # Helpers (logger, locators)
├── reports/                 # JSON reports
├── html-report/             # HTML reports
├── .env.dev                 # Development env config
├── .env.qa                  # QA env config
├── cucumber.js              # Cucumber configuration
├── report-generator.js      # HTML report generator
├── package.json             # Project config & scripts
└── README.md                # Documentation
```

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/rudderstack-automation.git
cd rudderstack-automation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Files

Create environment-specific `.env` files:

#### .env.dev

```
LOGIN_USER=your-dev-username
LOGIN_PASS=your-dev-password
BASE_URL=https://dev.rudderstack.com
BROWSER=chromium
```

#### .env.qa

```
LOGIN_USER=your-qa-username
LOGIN_PASS=your-qa-password
BASE_URL=https://qa.rudderstack.com
BROWSER=firefox
```

---

## 🚀 Running Tests

### Local Execution with HTML Report

- **Development**

```bash
npm run test:dev:report
```

- **QA**

```bash
npm run test:qa:report
```

### Generate HTML Report Only

```bash
npm run generate-report
```

The report will be available at: `html-report/index.html`

---

## 🧪 GitHub Actions Integration

### GitHub Workflow

Your `.github/workflows/daily-test.yml` triggers the test daily via cron and publishes the report as an artifact.

### Schedule

```
Runs every day at 1:00 AM UTC
```

---

## 🧾 Scripts in package.json

```json
"scripts": {
  "test:dev": "cross-env ENV=dev cucumber-js --format json:reports/cucumber-report.json",
  "test:qa": "cross-env ENV=qa cucumber-js --format json:reports/cucumber-report.json",
  "generate-report": "node report-generator.js",
  "test:dev:report": "npm run test:dev && npm run generate-report",
  "test:qa:report": "npm run test:qa && npm run generate-report"
}
```

---

## 🧰 Tech Stack

- [Playwright](https://playwright.dev)
- [Cucumber.js](https://github.com/cucumber/cucumber-js)
- [TypeScript](https://www.typescriptlang.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [multiple-cucumber-html-reporter](https://www.npmjs.com/package/multiple-cucumber-html-reporter)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 📌 Notes

- Authentication is handled via `.env` files (never push them to public repos).
- GitHub recommends using **tokens** or **SSH** instead of password authentication for `git push`.

---

## 🙋 Support

Raise an issue or open a pull request for feature requests or bugs.

---

**© 2025 Nitin Asrani | All rights reserved.**
