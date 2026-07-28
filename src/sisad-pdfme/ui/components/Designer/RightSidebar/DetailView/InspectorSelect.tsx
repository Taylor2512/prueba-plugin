import React from 'react';
import { Select } from 'antd';
import { mergeClassNames } from '../../shared/className.js';

export type InspectorSelectOption = { label: React.ReactNode; value: string };

export type InspectorSelectProps = {
  value?: string;
  options: InspectorSelectOption[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  className?: string;
  testId?: string;
};

export const InspectorSelect = ({
  value,
  options,
  onChange,
  disabled,
  readOnly,
  label,
  className,
  testId,
}: InspectorSelectProps) => (
  <label className={mergeClassNames(
    'flex min-h-8 flex-col gap-1 text-[11px] text-slate-700 [&_.ant-select-selector]:min-h-[2rem] [&_.ant-select-selector]:rounded-md [&_.ant-select-selector]:border-slate-200 [&_.ant-select-selector]:bg-[var(--color-bg-surface)] [&_.ant-select-selector]:text-[0.6875rem] [&_.ant-select-selector]:shadow-none',
    className,
  )}>
    {label ? <span className="font-medium text-slate-900">{label}</span> : null}
    <Select
      data-testid={testId}
      value={value}
      options={options}
      disabled={disabled || readOnly}
      onChange={(nextValue) => onChange?.(String(nextValue))}
      size="small"
      className="w-full"
    />
  </label>
);
