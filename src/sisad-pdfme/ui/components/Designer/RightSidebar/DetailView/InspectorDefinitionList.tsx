import React from 'react';
import { mergeClassNames } from '../../shared/className.js';

export type InspectorDefinitionItem = {
  label: string;
  value: React.ReactNode;
  description?: string;
};

export type InspectorDefinitionListProps = {
  items: InspectorDefinitionItem[];
  className?: string;
  testId?: string;
  density?: 'compact' | 'default' | 'mini';
};

export const InspectorDefinitionList = ({ items, className, testId, density = 'default' }: InspectorDefinitionListProps) => (
  <dl
    data-testid={testId}
    className={mergeClassNames(
      'grid gap-x-3 gap-y-1.5 rounded-xl border border-slate-200/80 bg-white/90 p-2 shadow-none',
      density === 'mini' ? 'grid-cols-1' : density === 'compact' ? 'grid-cols-1' : 'grid-cols-2',
      className,
    )}
  >
    {items.map((item) => (
      <React.Fragment key={item.label}>
        <dt className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">{item.label}</dt>
        <dd className="text-[11px] leading-5 text-slate-900">
          {item.value}
          {item.description ? <div className="text-[10px] leading-4 text-slate-500">{item.description}</div> : null}
        </dd>
      </React.Fragment>
    ))}
  </dl>
);

export default InspectorDefinitionList;
