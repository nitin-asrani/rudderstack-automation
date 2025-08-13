// report-generator.js

const fs = require('fs');
const os = require('os');
const path = require('path');
const reporter = require('multiple-cucumber-html-reporter');
const dotenv = require('dotenv');

// ------------------------------
// Determine Environment
// ------------------------------
const env = process.env.ENV || 'dev';
const isCI = !!process.env.GITHUB_ACTIONS;

// ------------------------------
// Load Local Environment Variables
// ------------------------------
if (!isCI) {
  const envFilePath = path.resolve(__dirname, `./environment/.env.${env}`);
  
  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
    console.log(`✅ Loaded local environment file: ${envFilePath}`);
  } else {
    console.warn(`⚠️ Environment file not found: ${envFilePath}`);
  }
}

// ------------------------------
// Metadata for Report
// ------------------------------
const metadata = {
  browser: {
    name: process.env.BROWSER || 'chromium',
    version: 'latest'
  },
  device: isCI ? 'GitHub Actions Runner' : os.hostname(),
  platform: {
    name: process.platform,
    version: process.version
  }
};

// ------------------------------
// Custom Data for Report
// ------------------------------
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

// Add GitHub Actions metadata if running in CI
if (isCI) {
  customData.data.push({ label: 'GitHub Workflow', value: process.env.GITHUB_WORKFLOW || 'N/A' });
  customData.data.push({ label: 'GitHub Run ID', value: process.env.GITHUB_RUN_ID || 'N/A' });
  customData.data.push({ label: 'GitHub Job', value: process.env.GITHUB_JOB || 'N/A' });
}

// ------------------------------
// Generate Report
// ------------------------------
try {
  reporter.generate({
    jsonDir: 'reports',
    reportPath: 'html-report',
    metadata,
    customData,
    displayDuration: true,
    pageTitle: 'Cucumber HTML Report',
    reportName: `Cucumber Report - ${env.toUpperCase()}`
  });

  console.log(`✅ Cucumber HTML report generated at: ${path.resolve('html-report/index.html')}`);
} catch (error) {
  console.error('❌ Failed to generate report:', error.message);
  process.exit(1);
}
