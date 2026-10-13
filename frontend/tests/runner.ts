/**
 * @file tests/runner.ts
 * @description Master unified test runner for LOOP frontend unit test suites.
 */

import { runFeedbackChartsTests } from './unit/feedbackCharts.test';
import { runEnvResolutionTests } from './unit/envResolution.test';
import { runDatasetGeneratorTests } from './unit/datasetGenerator.test';

async function runAllFrontendSuites(): Promise<void> {
  const startTime = Date.now();
  console.log('===============================================================');
  console.log('        LOOP INTELLIGENCE PLATFORM — FRONTEND TEST RUNNER       ');
  console.log('===============================================================\n');

  const suites: Array<{ name: string; fn: () => Promise<void> }> = [
    { name: 'FeedbackCharts Data & Fallback Invariants', fn: runFeedbackChartsTests },
    { name: 'Environment Resolution & API URL Normalization', fn: runEnvResolutionTests },
    { name: 'Dataset Schema & Seed Integrity Constraints', fn: runDatasetGeneratorTests },
  ];

  let passed = 0;
  for (const suite of suites) {
    const suiteStart = Date.now();
    try {
      console.log(`[SUITE] ${suite.name}`);
      await suite.fn();
      const duration = Date.now() - suiteStart;
      console.log(`[PASS] ${suite.name} (${duration}ms)\n`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${suite.name}:`, err);
      process.exit(1);
    }
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('===============================================================');
  console.log(`Total Suites:     ${suites.length}`);
  console.log(`Passed:           ${passed}`);
  console.log(`Failed:           0`);
  console.log(`Total Duration:   ${totalDuration}s`);
  console.log('===============================================================');
}

runAllFrontendSuites();
