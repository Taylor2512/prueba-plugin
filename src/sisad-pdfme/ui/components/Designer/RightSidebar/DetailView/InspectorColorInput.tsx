import React from 'react';
import { mergeClassNames } from '../../shared/className.js';

export type InspectorColorInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  className?: string;
  testId?: string;
};

export const InspectorColorInput = ({
  value,
  onChange,
  disabled,
  readOnly,
  label,
  className,
  testId,
}: InspectorColorInputProps) => (
  <label className={mergeClassNames('flex min-h-8 flex-col gap-1 text-[11px] text-slate-700', className)}>
    {label ? <span className="font-medium text-slate-900">{label}</span> : null}
    <input
      data-testid={testId}
      type="color"
      value={value || '#000000'}
      disabled={disabled || readOnly}
      onChange={(event) => onChange?.(event.target.value)}
      className="h-8 w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
    />
  </label>
);

export default InspectorColorInput;
