// NewTrade.test.tsx — behavioural test: validation, then a successful submit.
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/renderWithProviders';
import { NewTrade } from './NewTrade';

it('validates the form before submitting', async () => {
  const user = userEvent.setup();
  renderWithProviders(<NewTrade />);
  await user.click(await screen.findByRole('button', { name: /submit/i }));
  expect(await screen.findByText(/enter a ticker symbol/i)).toBeVisible();
});

it('submits a valid trade and shows a success message', async () => {
  const user = userEvent.setup();
  renderWithProviders(<NewTrade />);

  await user.type(screen.getByLabelText(/symbol/i), 'nvda');
  await user.type(screen.getByLabelText(/quantity/i), '2');
  await user.type(screen.getByLabelText(/price/i), '120');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(await screen.findByText(/trade submitted successfully/i)).toBeVisible();
});
