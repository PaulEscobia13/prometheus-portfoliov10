import assert from 'node:assert/strict';
import test from 'node:test';
import { getShowcasePreviewBounds } from '../lib/showcase-preview.ts';

test('preview fits below the actual navbar across desktop, mobile and viewport changes', () => {
  for (const [navbar, viewportHeight, viewportTop, expected] of [
    [109, 650, 0, {top:109, height:541}],
    [80, 744, 0, {top:80, height:664}],
    [100, 390, 0, {top:100, height:290}],
    [80, 500, 20, {top:80, height:440}],
  ]) {
    const bounds = getShowcasePreviewBounds(navbar, viewportHeight, viewportTop);
    assert.deepEqual(bounds, expected);
    assert.ok(bounds.top >= navbar, 'artwork starts below navigation');
    assert.equal(bounds.top + bounds.height, viewportTop + viewportHeight, 'preview ends at the visible viewport edge');
  }
});
