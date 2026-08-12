// src/config/runtime.ts — typed accessor for public/defaults.js window-context.
// The ONLY place that touches window.__APP_CONFIG__. Validated at the boundary.
import { z } from 'zod';

const RuntimeConfig = z.object({
  theme: z.string(),
  apiUrl: z.string(),
});

declare global {
  interface Window {
    __APP_CONFIG__: unknown;
  }
}

export const runtime = RuntimeConfig.parse(window.__APP_CONFIG__);
