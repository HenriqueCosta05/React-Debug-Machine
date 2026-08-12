// src/utils/format.ts — l10n formatting helpers backed by Intl (i18n-l10n.md).
// Components call these instead of repeating Intl boilerplate. Read active language.
import i18n from '@/internationalization/i18n';

/** minor units (cents) -> localized currency string */
export function formatCurrency(minor: number, currency: string): string {
  return new Intl.NumberFormat(i18n.language, { style: 'currency', currency }).format(
    minor / 100,
  );
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat(i18n.language, {
    style: 'percent',
    signDisplay: 'exceptZero',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function formatDate(date: Date | number | string): string {
  return new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(date),
  );
}
