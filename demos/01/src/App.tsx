import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createDebugSession } from '@henriquecosta/react-debug-machine-shared';
import { DebugMachineDevtools } from '@henriquecosta/react-debug-machine-devtools';
import { startNetworkCapture } from '@henriquecosta/react-debug-machine-network';
import { startConsoleCapture } from '@henriquecosta/react-debug-machine-console';
import { startDomCapture } from '@henriquecosta/react-debug-machine-dom';
import { startTanstackCapture } from '@henriquecosta/react-debug-machine-state';
import Dashboard from './Dashboard';
import './App.css';

const session = createDebugSession();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

const App = () => {
  useEffect(() => {
    const stopNetwork = startNetworkCapture(session.bus);
    const stopConsole = startConsoleCapture(session.bus);
    const stopDom = startDomCapture(session.bus);
    const stopTanstack = startTanstackCapture(session.bus, queryClient);

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
      <DebugMachineDevtools session={session} />
    </QueryClientProvider>
  );
};

export default App;
