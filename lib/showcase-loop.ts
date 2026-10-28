export type ShowcaseLoop = {
  period: number;
  precedingCycles: number;
  copies: number;
};

/** Keep one phase for motion, dragging and keyboard positioning. */
export function wrapPhase(value: number, period: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(period) || period <= 0) return 0;
  const remainder = value % period;
  return remainder === 0 ? 0 : remainder < 0 ? remainder + period : remainder;
}

/** Preserve the selected point in a cycle when responsive card sizes change. */
export function resizePhase(phase: number, previousPeriod: number, nextPeriod: number): number {
  if (!Number.isFinite(previousPeriod) || previousPeriod <= 0) return 0;
  return wrapPhase(wrapPhase(phase, previousPeriod) / previousPeriod * nextPeriod, nextPeriod);
}

/**
 * The track translates by phase - precedingCycles * period. Each card projects
 * right from its slot; previous cycles must therefore cover its entire visual
 * overhang. An extra cycle on both sides stays outside the viewport at a wrap,
 * so the next copy inherits the same neighbors and overlap order.
 */
export function calculateShowcaseLoop(
  viewportWidth: number,
  pitch: number,
  sheetCount: number,
  projectedWidth: number,
): ShowcaseLoop {
  const count = Math.floor(sheetCount);
  const period = pitch * count;
  if (!Number.isFinite(period) || pitch <= 0 || count < 1 || period <= 0) {
    return { period: 0, precedingCycles: 2, copies: 0 };
  }
  const viewport = Number.isFinite(viewportWidth) ? Math.max(0, viewportWidth) : 0;
  const extent = Number.isFinite(projectedWidth) ? Math.max(0, projectedWidth) : pitch;
  const precedingCycles = Math.max(2, Math.ceil(extent / period) + 1);
  const followingCycles = Math.max(1, Math.ceil(viewport / period)) + 1;
  return { period, precedingCycles, copies: precedingCycles + followingCycles };
}
