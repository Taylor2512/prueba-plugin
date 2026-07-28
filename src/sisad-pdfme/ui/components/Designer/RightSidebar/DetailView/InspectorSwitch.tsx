import React from 'react';
import { Switch } from 'antd';
import { mergeClassNames } from '../../shared/className.js';
import { stopInspectorPointerEvent } from './inspectorInteractionGuards.js';

export type InspectorSwitchProps = {
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (nextChecked: boolean) => void;
  label?: string;
  className?: string;
  testId?: string;
};

export const InspectorSwitch = ({
  checked,
  disabled,
  readOnly,
  onChange,
  label,
  className,
  testId,
}: InspectorSwitchProps) => (
  <button
    type="button"
    data-testid={testId}
    disabled={disabled || readOnly}
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled || readOnly) return;
      onChange?.(!checked);
    }}
    onPointerDown={stopInspectorPointerEvent}
    className={mergeClassNames(
      'flex min-h-8 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left text-[11px] text-slate-700 shadow-none transition hover:border-slate-300',
      (disabled || readOnly) && 'cursor-not-allowed opacity-60',
      className,
    )}
  >
    <span className="min-w-0 flex-1 truncate">{label}</span>
    <Switch checked={Boolean(checked)} disabled={disabled || readOnly} />
  </button>
);
