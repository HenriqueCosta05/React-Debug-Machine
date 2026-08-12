// src/main.tsx — bootstrap: start MSW (dev, gated) -> load theme -> render.
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { env } from '@/config/env';
import { runtime } from '@/config/runtime';
import { store } from '@/store/store';
import { loadTheme } from '@/theme/loadTheme';
import { App } from '@/App';
import '@/internationalization/i18n';

async function enableMocking() {
  if (env.PUBLIC_API_MOCKING !== 'enabled') return;
  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

async function bootstrap() {
  await enableMocking();
  const theme = await loadTheme(runtime.theme); // await before first render
  const rootEl = document.getElementById('root');
  if (!rootEl) throw new Error('#root element not found');
  createRoot(rootEl).render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>,
  );
}

void bootstrap();
