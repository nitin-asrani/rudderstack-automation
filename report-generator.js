const reporter = require('multiple-cucumber-html-reporter');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Determine ENV
const env = process.env.ENV || 'dev';

// Load environment variables from .env.[env] only when running locally
if (!process.env.GITHUB_ACTIONS) {
  const envPath = path.resolve(__dirname, `.env.${env}`);
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`✅ Loaded local environment file: .env.${env}`);
  } else {
    console.warn(`⚠️ .env.${env} not found`);
  }
}

// Build metadata
const metadata = {
  browser: {
    name: process.env.BROWSER || 'chromium',
    version: 'latest'
  },
  device: process.env.GITHUB_ACTIONS ? 'GitHub Actions Runner' : os.hostname(),
  platform: {
    name: process.platform,
    version: process.version
  }
};

// Build custom data
const customData = {
  title: 'Run Info',
  data: [
    { label: 'Execution Env', value: env },
    { label: 'Base URL', value: process.env.BASE_URL || 'N/A' },
    { label: 'Browser', value: process.env.BROWSER || 'chromium' },
    { label: 'Run By', value: process.env.GITHUB_ACTOR || os.userInfo().username },
    {
      label: 'Run Timestamp',
      value: new Date().toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC'
    }
  ]
};

// Optional: include GitHub Actions metadata
if (process.env.GITHUB_ACTIONS) {
  customData.data.push({ label: 'GitHub Workflow', value: process.env.GITHUB_WORKFLOW });
  customData.data.push({ label: 'GitHub Run ID', value: process.env.GITHUB_RUN_ID });
  customData.data.push({ label: 'GitHub Job', value: process.env.GITHUB_JOB });
}

reporter.generate({
  jsonDir: 'reports',
  reportPath: 'html-report',
  metadata,
  customData,
  displayDuration: true,
  pageTitle: 'Cucumber HTML Report',
  reportName: `Cucumber Report - ${env.toUpperCase()}`
});
