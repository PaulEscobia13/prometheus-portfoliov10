# Made in Webflow gallery runtime

`webflow-miw-slider.a0e2db7.js` is the published browser bundle used by Webflow's Made in Webflow section, pinned to `webflow/brand_studio` revision `a0e2db7`.

Source: https://github.com/webflow/brand_studio/blob/a0e2db7/global-brand-code/custom-components/miw-slider.js

Distributed bundle: https://cdn.jsdelivr.net/gh/webflow/brand_studio@a0e2db7/global-brand-code/custom-components/miw-slider.min.js

The adapter in `components/WebflowShowcaseGallery.tsx` supplies Prometheus artwork and controls. No Webflow artwork, logos, marketing copy or browser-frame images are included. Keep the upstream header and provenance when updating the pinned runtime.

Local extension: `autoAdvance` (cards per second, default `0`) advances the existing looping position while idle and keeps the render loop awake. It is disabled for reduced motion and while dragging or a preview is open. The adapter enables it only while the gallery is visible, the document is active, and keyboard navigation is idle. Scroll-position-driven movement is disabled in favor of this steady conveyor.

Preview isolation: while a card is opening, open, or closing, all other cards have zero alpha in both the WebGL and DOM renderers. They fade back into the carousel after the selected card closes. This prevents neighboring sheets from showing through a fitted preview.
