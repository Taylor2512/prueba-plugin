import React from 'react';
import { InputNumber } from 'antd';
import { mergeClassNames } from '../../shared/className.js';

export type InspectorNumberInputProps = {
  value?: number;
  onChange?: (value: number | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  className?: string;
  testId?: string;
  min?: number;
  max?: number;
  step?: number;
};

export const InspectorNumberInput = ({
  value,
  onChange,
  disabled,
  readOnly,
  label,
  className,
  testId,
  min,
  max,
  step,
}: InspectorNumberInputProps) => (
  <label className={mergeClassNames('flex min-h-7 flex-col gap-0.5 text-[10px] text-slate-700', className)}>
    {label ? <span className="font-medium text-slate-900">{label}</span> : null}
    <InputNumber
      data-testid={testId}
      value={value}
      min={min}
      max={max}
      step={step}
      disabled={disabled || readOnly}
      onChange={(nextValue) => onChange?.(typeof nextValue === 'number' ? nextValue : null)}
      size="small"
      className="w-full"
    />
  </label>
);

export default InspectorNumberInput;
