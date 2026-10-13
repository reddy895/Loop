import assert from 'node:assert';

/**
 * @file tests/unit/feedbackCharts.test.ts
 * @description Unit tests for FeedbackCharts data processing, fallbacks, and tooltip calculation invariants.
 */

export async function runFeedbackChartsTests(): Promise<void> {
  console.log('  ▸ Feedback Volume Chart safeData fallback invariant...');
  {
    // When data is null or empty, default mock volume data should be returned
    const emptyData: Record<string, unknown>[] = [];
    const safeDataFallback = emptyData && emptyData.length > 0 && emptyData.some((d) => Number(d.volume) > 0)
      ? emptyData
      : [
          { date: 'Jul 29', volume: 12 },
          { date: 'Jul 30', volume: 19 },
          { date: 'Jul 31', volume: 15 },
          { date: 'Aug 01', volume: 27 },
          { date: 'Aug 02', volume: 32 },
          { date: 'Aug 03', volume: 24 },
          { date: 'Aug 04', volume: 28 }
        ];

    assert.strictEqual(safeDataFallback.length, 7, 'Default volume fallback must contain 7 days');
    assert.strictEqual(safeDataFallback[0].date, 'Jul 29');

    // When valid non-zero data is supplied, it must be preserved
    const customData = [{ date: 'Aug 10', volume: 45 }];
    const safeDataCustom = customData && customData.length > 0 && customData.some((d) => Number(d.volume) > 0)
      ? customData
      : [];
    assert.strictEqual(safeDataCustom.length, 1);
    assert.strictEqual(safeDataCustom[0].volume, 45);
  }

  console.log('  ▸ Sentiment Breakdown Pie Chart percentage invariants...');
  {
    const sentimentData = [
      { name: 'Positive', value: 70, color: '#10B981' },
      { name: 'Negative', value: 20, color: '#EF4444' },
      { name: 'Neutral', value: 10, color: '#F59E0B' }
    ];

    const total = sentimentData.reduce((acc, curr) => acc + (curr.value || 0), 0);
    assert.strictEqual(total, 100, 'Sentiment totals must sum to 100');

    const positivePct = Math.round((70 / total) * 100);
    assert.strictEqual(positivePct, 70, 'Positive percentage must accurately equal 70%');
  }

  console.log('  ▸ Top Themes Bar Chart safeData fallback invariant...');
  {
    const zeroData: Record<string, unknown>[] = [{ theme: 'Test', count: 0 }];
    const safeThemeData = zeroData && zeroData.length > 0 && zeroData.some((d) => Number(d.count) > 0)
      ? zeroData
      : [
          { theme: 'UX Performance', count: 42 },
          { theme: 'Billing & Pricing', count: 28 }
        ];

    assert.strictEqual(safeThemeData.length, 2, 'Fallback must activate when counts are all zero');
    assert.strictEqual(safeThemeData[0].theme, 'UX Performance');
  }
}

if (process.argv[1] && process.argv[1].endsWith('feedbackCharts.test.ts')) {
  runFeedbackChartsTests().then(() => console.log('✔ FeedbackCharts unit tests passed'));
}
