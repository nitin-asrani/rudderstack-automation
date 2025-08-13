import { setDefaultTimeout } from '@cucumber/cucumber';

/**
 * Sets the default timeout for all step definitions.
 * 
 * Adjust this value based on your test environment and expected step durations.
 * Here it is set to 2 minutes (120000 ms).
 */

// Timeout duration in milliseconds
const STEP_TIMEOUT_MS = process.env.STEP_TIMEOUT_MS 
  ? parseInt(process.env.STEP_TIMEOUT_MS, 10) 
  : 120_000;

setDefaultTimeout(STEP_TIMEOUT_MS);

console.log(`✅ Cucumber step default timeout set to ${STEP_TIMEOUT_MS} ms`);
