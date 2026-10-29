import assert from "node:assert/strict";
import test from "node:test";
import { elasticOut, springStep } from "../lib/pointer-motion.ts";

test("reference elastic easing starts and ends exactly and overshoots between them", () => {
  assert.equal(elasticOut(0), 0);
  assert.equal(elasticOut(1), 1);
  assert.ok(elasticOut(.15) > 1.3);
  assert.ok(elasticOut(.3) < 1);
});

test("reference cursor spring is independent of frame subdivision", () => {
  const whole = springStep(0, 0, 100, .032, 350, 18, .3);
  const first = springStep(0, 0, 100, .016, 350, 18, .3);
  const second = springStep(first.position, first.velocity, 100, .016, 350, 18, .3);
  assert.ok(Math.abs(whole.position - second.position) < 1e-9);
  assert.ok(Math.abs(whole.velocity - second.velocity) < 1e-9);
});

test("reference scale spring grows from a small dot and settles", () => {
  const early = springStep(.1, 0, 1, .05, 200, 20);
  assert.ok(early.position > .1 && early.position < 1);
  const end = springStep(.1, 0, 1, 1.5, 200, 20);
  assert.ok(Math.abs(end.position - 1) < .001);
});
