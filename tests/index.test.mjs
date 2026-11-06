import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('equal splits reference', () => {
  assert.deepEqual(api.planSplits(2, 600), [
    { index: 1, distanceKm: 1, elapsedSeconds: 300, segmentSeconds: 300 },
    { index: 2, distanceKm: 1, elapsedSeconds: 600, segmentSeconds: 300 },
  ]);
});
test('partial final segment', () => {
  const p = api.planSplits(2.5, 750);
  assert.deepEqual(p.at(-1), {
    index: 3,
    distanceKm: 0.5,
    elapsedSeconds: 750,
    segmentSeconds: 150,
  });
});
test('split larger than race', () => {
  assert.equal(api.planSplits(0.5, 100, 1).length, 1);
});
test('variance reference', () => {
  assert.deepEqual(api.splitVariance([300, 310], [305, 305]), { deltas: [-5, 5], totalDelta: 0 });
});
test('bounds and lengths', () => {
  assert.throws(() => api.planSplits(0, 10));
  assert.throws(() => api.planSplits(10001, 100, 1));
  assert.throws(() => api.splitVariance([1], []));
  assert.throws(() => api.splitVariance([1, , 2], [1, 2, 3]));
});
test('conservation oracle', () => {
  for (let d = 0.25; d <= 20; d += 0.25) {
    const p = api.planSplits(d, 1234, 0.75);
    assert.ok(Math.abs(p.reduce((s, x) => s + x.distanceKm, 0) - d) < 1e-10);
    assert.equal(
      p.reduce((s, x) => s + x.segmentSeconds, 0),
      1234,
    );
    assert.ok(p.every((x) => x.distanceKm > 0 && x.segmentSeconds > 0));
  }
});
test('resolution failures are explicit', () => {
  assert.throws(() => api.planSplits(4, Number.MIN_VALUE, 1));
});
