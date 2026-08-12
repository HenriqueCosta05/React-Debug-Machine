// src/theme/components.ts — code-only theme parts (functions/overrides JSON can't carry).
// Merged with JSON tokens by buildTheme().
import type { ThemeOptions } from '@mui/material/styles';

export const components: ThemeOptions['components'] = {
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: { root: { textTransform: 'none' } },
  },
  MuiTextField: {
    defaultProps: { size: 'small', fullWidth: true },
  },
  MuiCard: {
    styleOverrides: { root: { backgroundImage: 'none' } },
  },
};
