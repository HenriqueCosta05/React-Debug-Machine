// src/App.tsx — top-level shell: two-view nav (Dashboard / New trade).
// Local useState is enough here — nav selection is used by this single subtree,
// so it doesn't belong in Redux (react.md: co-locate state, don't reach for Redux).
import { useEffect, useState } from 'react';
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Dashboard } from '@/views/Dashboard/Dashboard';
import { NewTrade } from '@/views/NewTrade/NewTrade';
import { store } from '@/store/store';
import { DebugMachineDevtools } from '@henriquecosta/react-debug-machine-devtools';
import { createDebugSession } from '@henriquecosta/react-debug-machine-shared';
import type { DomEventData, NetworkEventData, ConsoleEventData, StateEventData } from '@henriquecosta/react-debug-machine-shared';
import type { ReplayerRegistry } from '@henriquecosta/react-debug-machine-recorder';
import { startNetworkCapture, replayNetworkEvent } from '@henriquecosta/react-debug-machine-network';
import { startConsoleCapture, replayConsoleEvent } from '@henriquecosta/react-debug-machine-console';
import { startDomCapture, replayDomEvent } from '@henriquecosta/react-debug-machine-dom';
import { startReduxCapture, createStateSetterRegistry, replayStateEvent } from '@henriquecosta/react-debug-machine-state';

type ViewKey = 'dashboard' | 'newTrade';

// Session/registry vivem fora do componente: precisam sobreviver a re-renders
// (senão cada render zeraria a timeline) e só existe um App montado por vez.
const session = createDebugSession();
const stateRegistry = createStateSetterRegistry();

// Redux não tem forma pública de reaplicar um state arbitrário (sem enhancer
// específico do app), então replay de eventos origin: 'redux' fica em
// 'no-setter-registered' por design — ver comentário em replayStateEvent.
const replayers: ReplayerRegistry = {
  dom: (data) => replayDomEvent(data as DomEventData),
  network: (data) => replayNetworkEvent(data as NetworkEventData),
  console: (data) => replayConsoleEvent(data as ConsoleEventData),
  state: (data) => {
    const { label, after } = data as StateEventData;
    return replayStateEvent(label, after, stateRegistry);
  },
};

export function App() {
  const { t } = useTranslation('common');
  const [view, setView] = useState<ViewKey>('dashboard');

  useEffect(() => {
    const stopNetwork = startNetworkCapture(session.bus);
    const stopConsole = startConsoleCapture(session.bus);
    const stopDom = startDomCapture(session.bus);
    const stopRedux = startReduxCapture(session.bus, store, 'store', ['tradeForm']);

    return () => {
      stopNetwork();
      stopConsole();
      stopDom();
      stopRedux();
    };
  }, []);

  return (
    <Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography component="h1" variant="h6" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>
          <Tabs value={view} onChange={(_e, next: ViewKey) => setView(next)}>
            <Tab value="dashboard" label={t('nav.dashboard')} />
            <Tab value="newTrade" label={t('nav.newTrade')} />
          </Tabs>
        </Toolbar>
        <DebugMachineDevtools session={session} replayers={replayers} />
      </AppBar>

      {view === 'dashboard' && <Dashboard />}
      {view === 'newTrade' && <NewTrade />}
    </Box>
  );
}
