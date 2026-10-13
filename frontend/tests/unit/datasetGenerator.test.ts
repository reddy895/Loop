import assert from 'node:assert';
import { mockFeedbackList, mockWorkspace } from '../../lib/mockData';

/**
 * @file tests/unit/datasetGenerator.test.ts
 * @description Unit tests validating dataset integrity, sentiment scores, and schema constraints.
 */

export async function runDatasetGeneratorTests(): Promise<void> {
  console.log('  ▸ Dataset Integrity: workspace structure validation...');
  {
    assert.ok(mockWorkspace.id, 'Workspace must possess an ID');
    assert.strictEqual(typeof mockWorkspace.totalFeedbackCount, 'number');
    assert.ok(mockWorkspace.totalFeedbackCount > 0, 'Feedback count must be greater than zero');
  }

  console.log('  ▸ Dataset Integrity: feedback record schema & sentiments...');
  {
    assert.ok(Array.isArray(mockFeedbackList), 'Mock feedback list must be an array');
    assert.ok(mockFeedbackList.length >= 10, 'Mock feedback list must contain sufficient records');

    const validSentiments = new Set(['Positive', 'Negative', 'Neutral']);
    const validChannels = new Set(['Zendesk', 'Intercom', 'Discourse', 'App Store', 'Email', 'CSV Import']);

    for (const item of mockFeedbackList) {
      assert.ok(item.id.startsWith('FB-'), `Item ID ${item.id} must start with FB- prefix`);
      assert.ok(item.customerName.trim().length > 0, 'Customer name must not be empty');
      assert.ok(item.customerEmail.includes('@'), 'Customer email must be valid');
      assert.ok(validSentiments.has(item.sentiment), `Invalid sentiment: ${item.sentiment}`);
      assert.ok(validChannels.has(item.channel), `Invalid channel: ${item.channel}`);
      assert.ok(
        typeof item.sentimentScore === 'number' && item.sentimentScore >= 0 && item.sentimentScore <= 100,
        `Sentiment score ${item.sentimentScore} must be within 0-100 range`
      );
      assert.ok(item.feedback.trim().length > 0, 'Feedback text must not be empty');
      assert.ok(item.theme.trim().length > 0, 'Theme must not be empty');
    }
  }

  console.log('  ▸ Dataset Integrity: sentiment distribution...');
  {
    const positiveCount = mockFeedbackList.filter((f) => f.sentiment === 'Positive').length;
    const negativeCount = mockFeedbackList.filter((f) => f.sentiment === 'Negative').length;
    const neutralCount = mockFeedbackList.filter((f) => f.sentiment === 'Neutral').length;

    assert.ok(positiveCount > 0, 'Dataset must have positive feedback');
    assert.ok(negativeCount > 0, 'Dataset must have negative feedback');
    assert.ok(neutralCount > 0, 'Dataset must have neutral feedback');
  }
}

if (process.argv[1] && process.argv[1].endsWith('datasetGenerator.test.ts')) {
  runDatasetGeneratorTests().then(() => console.log('✔ Dataset generator unit tests passed'));
}
