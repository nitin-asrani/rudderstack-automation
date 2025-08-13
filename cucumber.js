const path = require('path');

/**
 * Cucumber.js Configuration
 * 
 * This file configures how Cucumber runs your tests.
 * - Uses ts-node to support TypeScript step definitions
 * - Loads step definitions and utilities
 * - Specifies feature files location
 */
module.exports = {
  default: {
    // Enable ts-node for compiling TypeScript on the fly
    requireModule: ['ts-node/register'],

    // Step definitions and utility files to load
    require: [
      path.join('steps', '**', '*.ts'),
      path.join('utils', 'timmer.ts')
    ],

    // Pattern to locate feature files
    paths: ['features/**/*.feature'],

    // Optional: set strict mode for undefined steps or pending
    // strict: true,

    // Optional: format output (can add multiple formats)
    // format: ['progress', 'json:reports/cucumber-report.json'],

    // Optional: enable parallel execution (requires newer versions)
    // parallel: 4,
  }
};
