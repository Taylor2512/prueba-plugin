import React from 'react';
import { mergeClassNames } from '../../shared/className.js';

export type InspectorFieldProps = {
  label: string;
  description?: string;
  ownerColor?: string | null;
  children?: React.ReactNode;
  className?: string;
  testId?: string;
  density?: 'compact' | 'default' | 'minimal';
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
      'rounded-xl border border-slate-200/70 bg-white/96 p-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
      density === 'minimal' ? 'space-y-[3px]' : density === 'compact' ? 'space-y-1' : 'space-y-1.5',
      className,
    )}
    style={ownerColor ? ({ '--schema-owner-color': ownerColor } as React.CSSProperties) : undefined}
  >
    <div className="min-w-0">
      <div className="text-[9px] font-semibold uppercase tracking-[0.04em] leading-tight text-slate-600">{label}</div>
      {description ? <div className="text-[9px] leading-4 text-slate-500">{description}</div> : null}
    </div>
    {children}
  </div>
);

export default InspectorField;
