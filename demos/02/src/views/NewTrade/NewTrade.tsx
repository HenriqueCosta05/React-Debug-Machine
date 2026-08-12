// views/NewTrade/NewTrade.tsx — container view. Demonstrates: Redux-managed form
// via DynamicForm, RTK Query mutation for submit, all text via t(), no native HTML.
import { useState } from 'react';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCreateTradeMutation } from '@/services/api';
import type { FieldConfig } from '@/components/DynamicForm/DynamicForm.types';
import {
  fieldChanged,
  validated,
  reset,
  selectValues,
  selectErrors,
  validateTradeForm,
  toTradeSide,
} from '@/store/slices/tradeForm';
import { DynamicForm } from '@/components/DynamicForm/DynamicForm';
import { NewTradeViewRoot } from './NewTrade.style';

const FIELDS: readonly FieldConfig[] = [
  { name: 'symbol', type: 'text', labelKey: 'fields.symbol' },
  {
    name: 'side',
    type: 'select',
    labelKey: 'fields.side',
    options: [
      { value: 'buy', labelKey: 'side.buy' },
      { value: 'sell', labelKey: 'side.sell' },
    ],
  },
  { name: 'quantity', type: 'number', labelKey: 'fields.quantity' },
  { name: 'price', type: 'number', labelKey: 'fields.price' },
] as const;

export function NewTrade() {
  const { t } = useTranslation('trades');
  const dispatch = useAppDispatch();
  const [createTrade, { isLoading: isSubmitting }] = useCreateTradeMutation();
  const values = useAppSelector(selectValues);
  const errors = useAppSelector(selectErrors);
  const [submitted, setSubmitted] = useState(false);

  async function submit() {
    const found = validateTradeForm(values);
    dispatch(validated(found));
    if (Object.keys(found).length > 0) return;

    await createTrade({
      symbol: values.symbol.trim().toUpperCase(),
      side: toTradeSide(values.side),
      quantity: Number(values.quantity),
      priceMinor: Math.round(Number(values.price) * 100),
    }).unwrap();
    dispatch(reset());
    setSubmitted(true);
  }

  return (
    <NewTradeViewRoot>
      <Typography component="h1" variant="h4" gutterBottom>
        {t('form.title')}
      </Typography>

      {submitted && (
        <Alert severity="success" onClose={() => setSubmitted(false)} sx={{ mb: 2 }}>
          {t('success')}
        </Alert>
      )}

      <Stack
        spacing={2}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(false);
          void submit();
        }}
      >
        <DynamicForm
          fields={FIELDS}
          values={values}
          errors={errors}
          ns="trades"
          onChange={(name, value) =>
            dispatch(
              fieldChanged({
                name: name as 'symbol' | 'side' | 'quantity' | 'price',
                value,
              }),
            )
          }
        />
        <Button type="submit" variant="contained" loading={isSubmitting}>
          {t('actions.save', { ns: 'common' })}
        </Button>
      </Stack>
    </NewTradeViewRoot>
  );
}
