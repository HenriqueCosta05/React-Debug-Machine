// src/store/slices/tradeForm.ts — FORM state in Redux (no form library).
// Field values are all kept as strings for controlled inputs (incl. `side`,
// driven by the DynamicForm select) + validation errors; `toTradeSide` below
// narrows `side` back to TradeSide at submit time.
// Submission is an RTK Query mutation (services/api.ts).
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TradeSide } from '@/@types/trade';

type Values = { symbol: string; side: string; quantity: string; price: string };
type TradeFormState = { values: Values; errors: Partial<Record<keyof Values, string>> };

const initialState: TradeFormState = {
  values: { symbol: '', side: 'buy', quantity: '', price: '' },
  errors: {},
};

const tradeForm = createSlice({
  name: 'tradeForm',
  initialState,
  reducers: {
    fieldChanged(
      state,
      { payload }: PayloadAction<{ name: keyof Values; value: string }>,
    ) {
      state.values[payload.name] = payload.value;
      delete state.errors[payload.name]; // clear error on edit
    },
    validated(state, { payload }: PayloadAction<TradeFormState['errors']>) {
      state.errors = payload;
    },
    reset: () => initialState,
  },
  selectors: {
    selectValues: (s) => s.values,
    selectErrors: (s) => s.errors,
  },
});

export const { fieldChanged, validated, reset } = tradeForm.actions;
export const { selectValues, selectErrors } = tradeForm.selectors;
export default tradeForm.reducer;

/** Plain validator (utils-style). No schema/validation library needed. */
export function validateTradeForm(values: Values): TradeFormState['errors'] {
  const errors: TradeFormState['errors'] = {};
  if (values.symbol.trim() === '') errors.symbol = 'trades:errors.symbol';
  if (!(Number(values.quantity) > 0)) errors.quantity = 'trades:errors.quantity';
  if (!(Number(values.price) > 0)) errors.price = 'trades:errors.price';
  return errors;
}

/** Narrows the form's free-text `side` value to the TradeSide union at submit time. */
export function toTradeSide(side: string): TradeSide {
  return side === 'sell' ? 'sell' : 'buy';
}
