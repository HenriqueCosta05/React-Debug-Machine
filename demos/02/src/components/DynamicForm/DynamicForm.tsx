// DynamicForm.tsx — renders MUI inputs from a field config + Redux-owned state.
// Keep it simple and config-driven. MUI inputs are controlled by the caller's slice.
import { MenuItem, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { DynamicFormProps } from './DynamicForm.types';

export function DynamicForm({ fields, values, errors, ns, onChange }: DynamicFormProps) {
  const { t } = useTranslation(ns);
  return (
    <Stack spacing={2}>
      {fields.map((f) => {
        const error = errors[f.name];
        return (
          <TextField
            key={f.name}
            type={f.type === 'select' ? undefined : f.type}
            select={f.type === 'select'}
            label={t(f.labelKey)}
            value={values[f.name] ?? ''}
            onChange={(e) => onChange(f.name, e.target.value)}
            error={Boolean(error)}
            // error messages are fully-qualified i18n keys (e.g. "trades:errors.symbol")
            helperText={error ? t(error) : undefined}
          >
            {f.type === 'select' &&
              f.options?.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </MenuItem>
              ))}
          </TextField>
        );
      })}
    </Stack>
  );
}
