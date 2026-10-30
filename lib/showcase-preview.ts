/** The opened renderer occupies only the visible viewport below navigation. */
export function getShowcasePreviewBounds(navbarBottom: number, viewportHeight: number, viewportTop = 0) {
  const top = Math.max(viewportTop, navbarBottom);
  return { top, height: Math.max(1, viewportHeight + viewportTop - top) };
}
