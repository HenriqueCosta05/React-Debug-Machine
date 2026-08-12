// public/defaults.js — runtime window-context config.
// Loaded by a <script> in index.html BEFORE the app bundle, so ops can override
// per environment WITHOUT a rebuild. Static asset; never bundled.
// Read only through src/config/runtime.ts (typed + validated) — never directly.
window.__APP_CONFIG__ = {
  theme: 'light', // which public/themes/<name>.json to load
  apiUrl: '/api',
  PUBLIC_API_MOCKING: "enabled",
};
