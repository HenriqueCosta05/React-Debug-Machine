// src/theme/tokens.schema.ts — validates a public/themes/*.json file at load.
// Theme JSON crosses a runtime boundary, so we parse it (typescript.md rule).
import { z } from 'zod';

const PaletteColor = z.object({
  main: z.string(),
  light: z.string().optional(),
  dark: z.string().optional(),
});

const Scheme = z.object({
  palette: z.object({
    primary: PaletteColor,
    warning: PaletteColor.optional(),
    success: PaletteColor.optional(),
    error: PaletteColor.optional(),
    background: z.object({ default: z.string(), paper: z.string() }),
    text: z.object({ primary: z.string(), secondary: z.string() }),
  }),
});

export const TokensSchema = z.object({
  shape: z.object({ borderRadius: z.number() }),
  typography: z.record(z.string(), z.unknown()),
  colorSchemes: z.object({ light: Scheme, dark: Scheme.optional() }),
});

export type ThemeTokens = z.infer<typeof TokensSchema>;
