Private Arounda reference study. Existing Prometheus projects are untouched.

The `/prometheus` route is a separate background and wordmark experiment requested by the user. `/` remains the original reference. Install the supplied PNG on Windows with `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-preview-background.ps1`. This uses `Downloads/Moody Red, Cream, and Teal Waves.png` by default, or accepts `-Source` with another path. The PNG was visible in chat but not supplied as a downloadable attachment to the cloud workspace, so the original image is not committed. The preview retains reference copy/assets and outbound Arounda links for now; it is not ready for publication as a Prometheus site. Gordita gives the wordmark a similar typographic style; Arounda's original logo is custom vector artwork, not a reproducible font wordmark.

Run `npm ci`, `npm run dev`. Validate with `npm test`, `npm run lint`, `npm run typecheck` and `npm run build`.

The pricing section follows the showcase at `/prometheus#pricing`. It uses the supplied three-plan reference layout with Prometheus colors, a highlighted Premium card, semantic feature lists, keyboard focus states and stacked mobile cards. The user requested keeping the reference prices for now: Essential $2,000/project, Premium $4,500/project and Custom Partnership. Edit `content/pricing.ts` to change the plans. Buttons use `#contacts`, which now reaches the editorial contact footer. The screenshot's floating navbar and template badges were not reproduced.

ESLint uses the Next.js Core Web Vitals and TypeScript presets. The TypeScript packages follow Microsoft's side-by-side compatibility setup: `@typescript/native` supplies TypeScript 7.0.2's `tsc` command, while the `typescript` alias supplies the TypeScript 6 API required by ESLint and other programmatic tooling. See [Microsoft's compatibility guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).

Gallery regression tests cover wrap positioning and overlap order, responsive resizing, reduced-motion preference changes, preview animation cancellation, pointer cancellation, visibility changes, and effect cleanup. Component tests mount the gallery in JSDOM with controlled browser API stubs; browser testing is still required for CSS projection, actual modal behavior and visual comparison with the recording.

The recovered showcase continues at `/prometheus#showcase` with twelve concept sheets. It uses the recording's orthographic 3D tilt and descending overlap order, horizontal autoplay and dragging, a lifted/brightened hover state, and a flat expanded preview. The loop measures the actual distance between repeated cards and keeps complete predecessor and successor buffers across both wrap directions. Arrow keys, Home/End, Enter/Space and native Previous/Preview/Next controls provide access to every concept. Escape, the close button and backdrop dismiss the native modal; focus and page scrolling are restored. Pause/Play, live reduced-motion preferences, offscreen and hidden-tab suspension are supported.

Final showcase artwork remains separate. Optional local files `public/showcase/sheet-01` through `sheet-12` (PNG, JPEG, WebP or AVIF, case insensitive) fill those same twelve slots; absent slots stay as the existing placeholders. The install helper accepts up to twelve images. The existing local background, partner logos, favicons, case captures and reference fonts were recovered for this Windows checkout; none is required for the placeholder gallery. The recovered desktop Furniture Odyssey screenshot contains a loading skeleton and should be recaptured independently. The historical asset notes below describe the original cloud handoff.

The Prometheus navbar is transparent at the top and switches after 16px of scroll to a 62% dark tint with the captured 5px backdrop blur. An open mobile menu also enables the dark glass. This keeps #FFF4EA controls readable when cream service cards scroll underneath; a darker fallback applies without backdrop-filter support. The scroll listener is passive and removed on unmount, and reduced-motion preferences disable the tint transition.

Mobile navigation follows the captured Arounda control/panel geometry: two 24px by 3px bars in a borderless 38px control rotate into an X; the light floating panel has a square upper-left corner, 24px other corners, 24px primary labels and thin dividers.
It overlays content without changing hero layout.
Services links directly to the services section without a submenu.
Escape, an outside tap and selecting a destination close the panel; a closed mobile panel is inert.
The existing Prometheus labels/order and neutral palette are retained rather than restoring Industries or Blog.

The Prometheus favicon alternates every four seconds between the two user-supplied flame PNGs. Install the originals from Downloads with `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-favicons.ps1` (`Maroon Flame on Cream Gradient.png` and `redlojo (4).png`). Each image is rendered once to a 64px PNG with a 14px corner radius and transparent corners; the timer reuses these data URLs. The component removes its own favicon and timer on unmount and leaves the Arounda route alone. Browsers may throttle background-tab timers. Original inline image attachments are not available as downloadable files in the cloud workspace, so they are not committed. Timing and corner transparency were verified in Chromium with synthetic test artwork; the Windows copy helper requires local execution.

The third section, `#works`, follows the supplied video: cases are stacked in normal document flow, with a left summary sticky at 110px while multiple right-hand visuals scroll. The summary releases at the end of its own gallery. Up/down links scroll to adjacent projects through Lenis; first/last boundary controls are disabled. There is no carousel state, slide-swap animation, autoplay, or scroll interception. On mobile, summaries flow above the image stacks. Summaries use the handoff project facts and public live URLs. At the user's request, five-star ratings, testimonials and client identities are currently dummy content, visibly labeled Sample review. Fictional portraits were generated for this private wireframe and are committed in public/samples/client-portraits.png. Replace the feedback fields in content/caseStudies.ts and the portrait assets before publication. The right panels use labeled project-overview/scope cards until screenshots are available. Run `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\capture-case-previews.ps1` on Windows to capture desktop and mobile versions of both public sites using installed Chrome or Edge. Existing captures are kept. The helper is untested in this Linux environment; cloud requests to both sites returned proxy HTTP 403. Screenshots are presented in CSS laptop/phone frames. Optional extra images are read from `public/cases/<project-id>-2.png` and `-3.png`; the primary file is `<project-id>.png` and mobile is `<project-id>-mobile.png`. Restart development or rebuild production after installing images. Actual laptop-render artwork like the reference requires appropriate project mockup assets; CSS frames do not establish exact visual parity.

Prometheus navigation uses Services, Works, Pricing, About, Contacts in that order; Contacts is the right-hand CTA. Links use the wordmark's #FFF4EA, with teal hover accents. The mobile menu supports keyboard focus, Escape and closing on selection. Services targets the existing section; Works, Pricing, About and Contacts use local anchors reserved for sections not yet implemented, rather than linking to Arounda. Lenis handles existing same-page anchors smoothly.

The Prometheus services section follows the captured Arounda section's structure, heading typography, spacing classes and rounded three-column panel. Its content is adapted to Websites, Business Systems and Custom Solutions, with five offerings each. Service rows are native keyboard-accessible disclosures showing descriptions; they do not navigate to Arounda service pages. The panel uses the Prometheus neutral palette and red interaction states. Hero and services share one continuous, top-aligned background image without repeating it or stretching its aspect ratio; the services section has no opaque backdrop. Future sections belong outside this shared intro stage.

The Prometheus client strip contains only Furniture Odyssey and Piercing Corner. The logos are neutral #FFF4EA by default; hovering reveals their original colors outward from the center over 1.4 seconds, reversing on exit. Keyboard focus reveals them too; reduced-motion preferences remove the animation. The default layer uses the separately supplied neutral PNG directly, preserving its interior detail. It fades as the original-color layer reveals; both layers use the same container and contain-fit. Install the user-supplied originals (`furniture_odyssey_fff4ea.png`, `piercing_corner_fff4ea.png`, `Mid-Century Furniture Odyssey Logo.png`, and `piercing_corner_fixed.png`) from Downloads with `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-partner-logos.ps1`. The helper preserves image bytes and transparency and refuses to overwrite different existing files. The original PNGs were displayed as inline chat images without downloadable file references; they are not yet present in this Git repository. The Arounda reference retains its original six logos.

The Prometheus route uses Lenis 1.3.1 with the captured site's `lerp: 0.1` and `wheelMultiplier: 1`. Touch remains native. Reduced-motion preferences disable interpolation, including when the preference changes while the page is open. The animation frame and Lenis instance are cleaned up on unmount. The original reference route does not initialize Lenis.

On Windows, install the four exact reference fonts from the site's CDN by running `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\download-reference-fonts.ps1` from this directory. This bypass applies only to execution of this local helper, not TLS verification or a persistent system policy. Font binaries remain local in ignored `public/fonts/`. Compare both browser tabs at 100% zoom (Ctrl+0). The helper cannot be executed in this Linux environment and its CDN requests are currently blocked here; successful font loading and visual parity still require browser verification.

This initial harness preserves supplied DOM and CSS for calibration. It is not the finished React implementation. Scripts, trackers, iframes and remote font requests are excluded. Fonts are missing; typography and screenshot parity are not validated. Navigation dropdowns, video and animation behavior have not been implemented. Original assets are reference material, not authorized Prometheus production content. Do not publish this reference publicly.

Review-panel typography now uses the captured font-size tokens, Gordita Medium (500) for titles and testimonials, the captured 30px title / 20px review override on short desktop screens, a 64px portrait, Libre Baskerville italic client name, and 60px adjacent controls. It uses a generic Review label instead of claiming Clutch verification.

Pricing typography uses the self-hosted Geist font from the official geist package, scoped to PricingSection: heading 600, subtitle 500, features 400, and heading tracking -0.04em.


### Team section

After pricing, `#about` opens a full-screen Team cover. Scrolling opens its left and right halves to reveal the dark, four-person team layout; scrolling back closes it. The Meet the team button skips the animation and focuses the team heading, including during active smooth scrolling. Reduced motion and JavaScript-disabled browsing show the team directly without the extra scroll distance.

Sample names, roles and portrait paths are centralized in `content/team.ts`. The four `public/team/placeholder-*.svg` files are intentionally generic illustrated placeholders. Replace these with real team portraits and update names/roles together. The section does not use Linear staff photos or claim the sample people work at Prometheus.


### FAQ and contact footer

`#faq` follows the team section. The Paradigm reference layout uses Georgia as the user-approved substitute for Canela Text, with locally hosted Manrope answer text. Native details controls work without JavaScript; enhanced 400ms height animations support rapid reversal, independent open answers, and reduced-motion changes. FAQ copy is adapted to Prometheus project scope in `content/faq.ts`.

`#contacts` contains the burgundy editorial footer based on the supplied Furniture Odyssey reference. The desktop drawer is sticky behind the rounded FAQ sheet; foreground text moves from 40px to zero while the cropped wordmark remains in its artboard. Focus entering a covered footer link reveals it through the existing smooth-scroll integration. Mobile, short viewports, and reduced motion use normal flow for access. `content/contact.ts` centralizes links and the reference team booking URL; review the Furniture Odyssey consultation calendar before publishing a general portfolio.

Automated regression coverage includes FAQ reversal, independent rows, reduced-motion changes, missing-animation fallback, footer progress/clamping, covered-link keyboard access and cleanup. Visual fidelity still requires browser verification; see HANDOVER.md for the current check status.


### Hero demo and project inquiry

The Prometheus hero Play button opens a native video dialog with controls, Escape dismissal, focus return, and media cleanup on close.
The server selects a supported video from `public/videos`, preferring a Furniture Odyssey filename, and sends only its public URL to the client.
If media is missing or fails to load, the dialog shows an unavailable message.
Book a Call opens `/prometheus/contact`, featuring Oliver Jumawid, Co-Founder & DevOps, and the existing team portrait.
The required name, email, budget, and project fields continue to the existing Cal.com consultation calendar with prefilled details.
The visitor must finish scheduling on Cal.com; this page does not store inquiries or send email independently.
Budget ranges are editable in `components/ProjectInquiry.tsx`.


### Showcase artwork footer

The large footer wordmark crossfades between the same local artwork used by #MadeByPrometheus every 1.5 seconds while visible.
Artwork is clipped inside the existing letters, preserving the footer layout and cream base.
The gallery and footer read their canonical fourteen slots through `lib/showcase-assets.ts`.
Only the next artwork is loaded as needed; failed images preserve the previous appearance.
Offscreen and hidden-tab playback pauses, and reduced-motion preferences show the static cream wordmark.
