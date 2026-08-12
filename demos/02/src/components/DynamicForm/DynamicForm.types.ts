// DynamicForm.types.ts — config-driven form contract (our own, no form library).
export type FieldType = 'text' | 'number' | 'select';

export interface SelectOption {
  value: string;
  labelKey: string;
}

export interface FieldConfig {
  /** matches a key in the form slice's `values` */
  name: string;
  type: FieldType;
  /** i18n key for the label */
  labelKey: string;
  /** required when type === 'select' */
  options?: readonly SelectOption[];
}

export interface DynamicFormProps {
  fields: readonly FieldConfig[];
  values: Record<string, string>;
  errors: Record<string, string | undefined>;
  /** i18n namespace used for labels + error messages */
  ns: string;
  onChange: (name: string, value: string) => void;
}
