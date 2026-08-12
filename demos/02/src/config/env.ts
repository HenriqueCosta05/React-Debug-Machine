// src/config/env.ts — build-time env (baked into the bundle by RsBuild).
// Distinct from runtime.ts (window-context). Validate once; import typed values.
import { z } from 'zod';

const Env = z.object({
  PUBLIC_API_MOCKING: z.enum(['enabled', 'disabled']).default('enabled'),
});

export const env = Env.parse({
  PUBLIC_API_MOCKING: import.meta.env.PUBLIC_API_MOCKING,
});
