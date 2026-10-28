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

## Current state: implementation complete, browser comparison pending
The pushed checkpoint was `1f74b25`. Subsequent local work removed the footer's negative margin/top padding so reveal progress can reach zero, added focus handling that reveals covered footer links without moving keyboard focus, and added a normal-flow fallback for short viewports.

The current FAQ/footer components and scoped styles are implemented. Automated tests now cover 25 cases, including five new FAQ/footer regression tests. Lint and TypeScript pass (lint retains two existing CaseStudies image warnings). The production build also passed.

Visual QA was attempted but the browser tool reported: **Local browser use is disabled in Work settings**. Do not claim the FAQ/footer visual match has been verified. The user was directed to Settings > Browser > Agent permissions (codex://settings/browser-use), based on official desktop documentation. Resume browser QA after access is enabled.

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
1. Enable browser access and compare the local page against the two reference URLs. Verify footer layering and rounded corners, 40px-to-zero foreground movement, a stationary wordmark, and no overflow at 1440x1000, 390x844 and 320x740. Also test a short desktop viewport.
2. Use actual keyboard Enter/Space on FAQ summaries and Tab into the footer from the final FAQ. Regression tests pass with controlled DOM boundaries, but real browser focus/scroll behavior remains unverified.
3. Verify Team/gallery sticky behavior remains unchanged and all links remain reachable at the bottom.
4. The contact CTA reuses the reference's Furniture Odyssey consultation calendar. Confirm suitability before a portfolio deployment. No booking has been submitted.
5. Save final screenshots and refresh notes/archives after browser refinement. Do not merge or deploy without permission.

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
