import React from 'react';
import { mergeClassNames } from '../../shared/className.js';

export type InspectorFieldProps = {
  label: string;
  description?: string;
  ownerColor?: string | null;
  children?: React.ReactNode;
  className?: string;
  testId?: string;
  density?: 'compact' | 'default' | 'mini';
};

export const InspectorField = ({
  label,
  description,
  ownerColor,
  children,
  className,
  testId,
  density = 'default',
}: InspectorFieldProps) => (
  <div
    data-testid={testId}
    className={mergeClassNames(
      'rounded-xl border border-slate-200/80 bg-white/90 p-2 shadow-none',
      density === 'mini' ? 'space-y-1' : density === 'compact' ? 'space-y-1.5' : 'space-y-2',
      className,
    )}
    style={ownerColor ? ({ '--schema-owner-color': ownerColor } as React.CSSProperties) : undefined}
  >
    <div className="min-w-0">
      <div className="text-[11px] font-semibold leading-tight text-slate-900">{label}</div>
      {description ? <div className="text-[10px] leading-4 text-slate-500">{description}</div> : null}
    </div>
    {children}
  </div>
);

export default InspectorField;
