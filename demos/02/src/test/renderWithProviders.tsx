// src/test/renderWithProviders.tsx — render with the REAL providers, fresh store per test.
// Theme is built synchronously from bundled tokens — tests never fetch.
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import tradeFormReducer from '@/store/slices/tradeForm';
import i18n from '@/internationalization/i18n';
import { buildTheme } from '@/theme/buildTheme';
import lightTokens from '../../public/themes/light.json';

const theme = buildTheme(lightTokens);

export function renderWithProviders(ui: ReactElement) {
  const store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      tradeForm: tradeFormReducer,
    },
    middleware: (g) => g().concat(api.middleware),
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>{ui}</ThemeProvider>
        </I18nextProvider>
      </Provider>,
    ),
  };
}
