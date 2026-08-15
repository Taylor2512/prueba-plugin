import React from 'react';
import { Select } from 'antd';

export type FormSelectOption = { label: React.ReactNode; value: string };

export type FormSelectProps = {
  id?: string;
  name?: string;
  value?: string | number | null;
  options?: FormSelectOption[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
  placeholder?: string;
  className?: string;
  testId?: string;
};

/**
 * Small wrapper around `antd` Select that accepts `name` and normalizes
 * value/event shapes used across the inspector widgets. This prevents
 * duplicating small adapters in many files and keeps typing consistent.
 */
export const FormSelect = ({
  id,
  name,
  value,
  options = [],
  onChange,
  disabled,
  allowClear,
  showSearch,
  placeholder,
  className,
  testId,
}: FormSelectProps) => {
  return (
    <Select
      id={id}
      data-testid={testId}
      name={name}
      value={value as any}
      options={options as any}
      disabled={disabled}
      allowClear={allowClear}
      showSearch={showSearch}
      placeholder={placeholder}
      onChange={(next) => onChange?.(String(next))}
      size="small"
      className={className}
    />
  );
};

export default FormSelect;
