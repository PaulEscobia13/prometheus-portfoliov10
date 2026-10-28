Private Arounda reference study. Existing Prometheus projects are untouched.

Run `npm ci`, `npm run dev`. Validate with `npm run typecheck` and `npm run build`.

On Windows, install the four exact reference fonts from the site's CDN by running `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\download-reference-fonts.ps1` from this directory. This bypass applies only to execution of this local helper, not TLS verification or a persistent system policy. Font binaries remain local in ignored `public/fonts/`. Compare both browser tabs at 100% zoom (Ctrl+0). The helper cannot be executed in this Linux environment and its CDN requests are currently blocked here; successful font loading and visual parity still require browser verification.

This initial harness preserves supplied DOM and CSS for calibration. It is not the finished React implementation. Scripts, trackers, iframes and remote font requests are excluded. Fonts are missing; typography and screenshot parity are not validated. Navigation dropdowns, video and animation behavior have not been implemented. Original assets are reference material, not authorized Prometheus production content. Do not publish this reference publicly.
