import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  // Published third-party gallery bundle; lint the adapter, not upstream minified code.
  { ignores: ["public/vendor/webflow-miw-slider.a0e2db7.js"] },
  ...nextVitals,
  ...nextTypescript,
]);
