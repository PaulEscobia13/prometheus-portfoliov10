# Prometheus handover — 28 October 2026

## Repository and checkout
- Repository: https://github.com/PaulEscobia13/prometheus-portfoliov10
- Branch: transfer/prometheus-showcase. Do not merge or deploy without permission.
- Current checkout: outputs/prometheus-showcase under this Codex chat directory. Do not use the older work/prometheus clone.
- User dev server: http://localhost:3100/prometheus (leave it running).
- Start: npm install, then npm run dev -- --port 3100.

## Verified work before this checkpoint
- Recovered showcase continued, seam fixed, twelve placeholder cards preserved. Assets restored.
- Pricing implemented; user approved reference prices $2,000 / $4,500 / Custom.
- Pricing font: local Geist, heading 600, subtitle 500, features 400; heading tracking -0.04em.
- Team implemented in 08e4025: scroll-driven left/right Team cover, dark Linear-style layout, four clearly marked fictional profiles. User approved dummy data. Reduced-motion and native skip supported.
- Last VERIFIED state (08e4025): 20 tests passed, lint no errors/two existing CaseStudies img warnings, TypeScript and production build passed. Desktop/mobile/keyboard checks done.

## Current checkpoint: FAQ/footer UNFINISHED AND UNVERIFIED
User requested commit/push immediately to preserve work near usage limit. This checkpoint adds:
- components/FAQItem.tsx, FAQSection.tsx, FooterReveal.tsx, FooterSection.tsx
- content/faq.ts, contact.ts
- app/prometheus/closing.css and page composition changes
- @fontsource/manrope 5.3.0 (installed and lockfile updated)
No lint, typecheck, build, browser validation, or new tests have run for these additions yet. Do not describe this checkpoint as finished.

## Authoritative references and decisions
- FAQ: https://www.paradigm.design/?ref=unsection.com
- Footer: https://furnitureodyssey-landing.vercel.app/
- User explicitly approved Georgia for FAQ instead of Canela Text. Reference answer body uses Manrope; installed locally.
- User's clips were only 0.63s (FAQ) and 1.47s (footer), so live pages were inspected to learn behavior.
- FAQ allows multiple open answers, right arrow rotates 90 degrees downward, height expands/collapses. Current implementation uses native details plus a 400ms WAAPI enhancement, supporting reversal and reduced motion. Timing is approximate, not measured from reference animation configuration.
- FAQ content adapted for Prometheus project scope (no invented unlimited revision/subscription promises).
- Footer exact live styling: burgundy #642b2d, ivory #fff4ea, Georgia serif heading and giant cropped wordmark; Trebuchet MS body. Desktop artboard aspect 1774/806. Foreground padding 3.6cqw 9.5cqw, heading 5cqw/.94 tracking -.058em max-width68cqw, intro1.3cqw/1.58 max53cqw, lower row top23.5cqw, wordmark14.7cqw/.9 bottom-.25em translateX(-50%) scaleX(1.075), tracking-.075em.
- Reference reveal: footer sticky bottom0 z1; preceding main z2 with rounded bottom76px (52 tablet/36 mobile). Foreground alone translates from40px to0 based on preceding main natural bottom; wordmark stays fixed in artboard.
- Contact CTA currently reuses the reference's team calendar, explicitly documented in content/contact.ts: https://cal.com/rex-oliver-jumawid-mmz8ct/furniture-odyssey-consultation . Confirm suitability for general portfolio before any deployment. No booking was submitted.

## Priority next steps
1. Inspect/fix footer geometry BEFORE validation. Current closing.css has negative top margin and top padding equal to radius on the sticky footer. This likely conflicts with FooterReveal's progress math, preventing offset reaching zero. Suggested fix: remove negative margin/top padding, keep footer sticky bottom0 behind main, round only final FAQ background so existing Team sticky stage is unaffected. Avoid clipping whole main, which could affect existing sticky sections/dialogs.
2. Test keyboard access to footer links while drawer is covered by FAQ. Focus may need to scroll to the document end using existing prometheus:scroll-to event (handled by SmoothScroll) to reveal focused controls. Do not trap focus or interrupt navigation out of the footer.
3. Verify FAQ rapid reversals, multiple rows open, Enter/Space toggles, focus outlines, reduced-motion changes, and non-JS native details fallback.
4. Browser QA desktop1440x1000, mobile390x844 and320x740. Check no overflow or clipped links, drawer reveal 40px to0, stationary wordmark, preceding Team/gallery still correct. Mobile footer currently uses normal flow to keep all links reachable.
5. Run npm test, npm run lint, npm run typecheck, npm run build. Add meaningful motion/cleanup regression tests if needed.
6. Update README/delivery notes, screenshots, source ZIP and Git bundle after final implementation. Existing archives are only current through Team 08e4025; this Git push is authoritative for FAQ/footer checkpoint.

## Tooling
- Node binary: C:/Users/Paul Escobia/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe
- npm CLI: C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js
- Git: C:/Users/Paul Escobia/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe
- Prepend Node bin to PATH for npm scripts. Production build may require sandbox escalation (EPERM).
- Read AGENTS.md and relevant installed Next docs before modifying framework code.
- Use cua_repl for all browser UI; reload after client edits if HMR appears stale. Browser overrides can affect screenshot geometry. Reset overrides when done.
- Screenshot files must use absolute paths in chat. Save user deliverables under outputs/.
- Work scratch contains extracted reference frames and ffmpeg under work/video-deps/imageio_ffmpeg/binaries/.
- Existing packaging helper work/update-team-delivery.py refreshes archives from outputs/prometheus-showcase; do NOT run old package-delivery.py (targets old clone).
