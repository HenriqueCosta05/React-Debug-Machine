// src/theme/buildTheme.ts — turn JSON tokens into a MUI theme.
// cssVariables + colorSchemes => light/dark switch with useColorScheme(), no rebuild.
import { createTheme, type Theme } from '@mui/material/styles';
import { components } from './components';
import type { ThemeTokens } from './tokens.schema';

export function buildTheme(tokens: ThemeTokens): Theme {
  // @ts-expect-error — MUI's `Components<Theme>` type (used by our plain
  // `components.ts`) doesn't structurally match the CssVarsTheme-flavored
  // shape createTheme expects once `cssVariables` is enabled; both are valid
  // at runtime (upstream typing gap, not a real mismatch).
  return createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    ...tokens, // shape / typography / colorSchemes (data)
    components, // overrides + variants (code)
  });
}
