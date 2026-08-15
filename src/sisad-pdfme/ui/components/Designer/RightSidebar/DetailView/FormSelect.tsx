import React from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';

export type FormSelectOption<T = string | number> = { label: React.ReactNode; value: T };
export type FormSelectProps<T = string | number> = Omit<
  SelectProps<T>,
  'value' | 'onChange' | 'options'
> & {
  id?: string;
  name?: string;
  value?: T | null;
  options?: Array<FormSelectOption<T>>;
  onChange?: (value: T) => void;
  testId?: string;
  size?: SelectProps<T>['size'];
};

/**
 * Small wrapper around `antd` Select that accepts `name`, exposes common
 * AntD props, and is generic over the option value type. Forwards the
 * remaining `SelectProps` directly while keeping mappings typed.
 */
export const FormSelect = <T extends string | number = string>(
  {
    id,
    name,
    value,
    options = [],
    onChange,
    testId,
    size = 'small',
    ...rest
  }: FormSelectProps<T>,
) => {
  // Map canonical options to AntD `options` structure expected by Select
  const mappedOptions: SelectProps<T>['options'] = options.map((o) => ({
    label: o.label,
    value: o.value,
  }));

  const handleChange: SelectProps<T>['onChange'] = (nextValue, _option) => {
    // AntD may pass value as single or array (depending on mode). We support single-select here.
    if (Array.isArray(nextValue)) {
      // Take first as fallback
      onChange?.(nextValue[0] as T);
      return;
    }
    onChange?.(nextValue as T);
  };

  return (
    <Select<T>
      id={id}
      data-testid={testId}
      name={name}
      value={(value ?? undefined) as unknown as SelectProps<T>['value']}
      options={mappedOptions}
      onChange={handleChange}
      size={size}
      {...(rest as SelectProps<T>)}
    />
  );
};

export default FormSelect;
