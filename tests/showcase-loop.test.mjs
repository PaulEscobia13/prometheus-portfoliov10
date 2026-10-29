import assert from "node:assert/strict";
import test from "node:test";
import { calculateShowcaseLoop, resizePhase, wrapPhase } from "../lib/showcase-loop.ts";

const scenarios = [
  { name: "fourteen artwork cards", viewport: 1920, pitch: 300, count: 14, extent: 550 },
  { name: "mobile", viewport: 375, pitch: 170, count: 12, extent: 269 },
  { name: "desktop", viewport: 1440, pitch: 230, count: 12, extent: 421 },
  { name: "ultrawide", viewport: 7680, pitch: 170, count: 12, extent: 269 },
  { name: "exact cycle width", viewport: 4080, pitch: 170, count: 12, extent: 269 },
  { name: "large projected overhang", viewport: 200, pitch: 20, count: 2, extent: 390 },
];

function snapshot(indices, phase, scenario) {
  const { viewport, pitch, count, extent } = scenario;
  const visible = indices.map(index => ({
    id: wrapPhase(index, count),
    x: index * pitch + phase,
    index,
  })).filter(card => card.x < viewport && card.x + extent > 0);
  // Lower slot indices paint above later neighbors, as in the gallery CSS.
  const lastIndex = visible.at(-1)?.index ?? 0;
  return visible.map(({ id, x, index }) => ({ id, x, stack: lastIndex - index }));
}

function renderedSnapshot(phase, scenario, loop) {
  const indices = Array.from({ length: loop.copies * scenario.count }, (_, index) => index - loop.precedingCycles * scenario.count);
  return snapshot(indices, phase, scenario);
}

function infiniteSnapshot(phase, scenario) {
  const start = Math.floor((-scenario.extent - phase) / scenario.pitch) - 1;
  const end = Math.ceil((scenario.viewport - phase) / scenario.pitch) + 1;
  return snapshot(Array.from({ length: end - start + 1 }, (_, index) => start + index), phase, scenario);
}

for (const scenario of scenarios) {
  test(`${scenario.name}: both sides of a wrap retain card identity, position and overlap order`, () => {
    const loop = calculateShowcaseLoop(scenario.viewport, scenario.pitch, scenario.count, scenario.extent);
    assert.ok(loop.precedingCycles >= 2);
    assert.deepEqual(renderedSnapshot(loop.period, scenario, loop), renderedSnapshot(0, scenario, loop));
    for (const phase of [0, 0.001, loop.period / 2, loop.period - 0.001, loop.period]) {
      const actual = renderedSnapshot(phase, scenario, loop);
      assert.deepEqual(actual, infiniteSnapshot(phase, scenario));
      assert.ok(actual[0].x <= 0, "a preceding sheet covers the left edge");
      let coveredThrough = 0;
      for (const card of actual) {
        assert.ok(card.x <= coveredThrough, "no uncovered interval appears between sheets");
        coveredThrough = Math.max(coveredThrough, card.x + scenario.extent);
      }
      assert.ok(coveredThrough >= scenario.viewport, "the final sheet covers the right edge");
    }
  });
}

test("reverse and large drags land on the same cycle without losing precision near zero", () => {
  const period = 3264;
  for (const cycles of [-100_000, -3, -1, 0, 1, 3, 100_000]) {
    assert.equal(wrapPhase(cycles * period + 127.5, period), 127.5);
    assert.equal(wrapPhase(cycles * period - 127.5, period), period - 127.5);
  }
  assert.equal(wrapPhase(0.000000001, period), 0.000000001);
  assert.equal(Object.is(wrapPhase(-period, period), -0), false);
});

test("responsive resizing preserves normalized position and its preceding overlap", () => {
  const before = scenarios[1];
  const after = scenarios[0];
  const oldLoop = calculateShowcaseLoop(before.viewport, before.pitch, before.count, before.extent);
  const nextLoop = calculateShowcaseLoop(after.viewport, after.pitch, after.count, after.extent);
  for (const fraction of [0, 0.001, 0.38, 0.5, 0.999]) {
    const resized = resizePhase(oldLoop.period * (fraction - 3), oldLoop.period, nextLoop.period);
    assert.ok(Math.abs(resized / nextLoop.period - fraction) < 1e-12);
    assert.deepEqual(renderedSnapshot(resized, after, nextLoop), infiniteSnapshot(resized, after));
  }
});

test("unmeasured and invalid dimensions do not produce infinite copies or NaN phases", () => {
  for (const [pitch, count] of [[0, 12], [170, 0], [-10, 12], [Infinity, 12], [NaN, 12]]) {
    assert.deepEqual(calculateShowcaseLoop(375, pitch, count, 269), { period: 0, precedingCycles: 2, copies: 0 });
  }
  assert.equal(wrapPhase(1, 0), 0);
  assert.equal(wrapPhase(Infinity, 12), 0);
  assert.equal(resizePhase(200, 0, 2040), 0);
  assert.equal(resizePhase(200, 2760, 0), 0);
});
