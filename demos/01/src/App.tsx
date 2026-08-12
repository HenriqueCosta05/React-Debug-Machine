import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createDebugSession } from '@henriquecosta/react-debug-machine-shared';
import type { StateEventData } from '@henriquecosta/react-debug-machine-shared';
import { DebugMachineDevtools } from '@henriquecosta/react-debug-machine-devtools';
import type { ReplayerRegistry } from '@henriquecosta/react-debug-machine-recorder';
import { startNetworkCapture, replayNetworkEvent } from '@henriquecosta/react-debug-machine-network';
import { startConsoleCapture, replayConsoleEvent } from '@henriquecosta/react-debug-machine-console';
import { startDomCapture, replayDomEvent } from '@henriquecosta/react-debug-machine-dom';
import {
  startTanstackCapture,
  createStateSetterRegistry,
  replayStateEvent,
} from '@henriquecosta/react-debug-machine-state';
import Dashboard from './Dashboard';
import './App.css';

const session = createDebugSession();
const stateRegistry = createStateSetterRegistry();

// Replay em rede/estado é melhor-esforço (ADR-006/RK-05 em docs/): request não-GET
// reexecuta de verdade, `RecorderControls` já exige confirmação antes de disparar.
const replayers: ReplayerRegistry = {
  dom: replayDomEvent,
  network: replayNetworkEvent,
  console: replayConsoleEvent,
  state: (data) => {
    const { label, after } = data as StateEventData;
    return replayStateEvent(label, after, stateRegistry);
  },
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

const App = () => {
  useEffect(() => {
    const stopNetwork = startNetworkCapture(session.bus);
    const stopConsole = startConsoleCapture(session.bus);
    const stopDom = startDomCapture(session.bus);
    const stopTanstack = startTanstackCapture(session.bus, queryClient, stateRegistry);

    return () => {
      stopNetwork();
      stopConsole();
      stopDom();
      stopTanstack();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
      <DebugMachineDevtools session={session} replayers={replayers} />
    </QueryClientProvider>
  );
};

export default App;
