// Dashboard.test.tsx — behavioural test: stats + trade list, and an error state.
import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/renderWithProviders';
import { server } from '@/mocks/server';
import { Dashboard } from './Dashboard';

it('renders portfolio stats and the recent trades list from the API', async () => {
  renderWithProviders(<Dashboard />);
  expect(await screen.findByRole('heading', { name: /portfolio dashboard/i })).toBeVisible();
  expect(await screen.findByText(/3 trades/i)).toBeVisible();
  expect(screen.getByText('AAPL')).toBeVisible();
});

it('shows an error state and can retry the trades list', async () => {
  server.use(http.get('/api/trades', () => HttpResponse.json(null, { status: 500 })));
  renderWithProviders(<Dashboard />);
  expect(await screen.findAllByText(/something went wrong/i)).not.toHaveLength(0);
  expect(screen.getAllByRole('button', { name: /retry/i })[0]).toBeEnabled();
});
