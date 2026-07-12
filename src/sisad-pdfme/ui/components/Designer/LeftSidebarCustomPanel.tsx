import React from 'react';
import { Button } from 'antd';
import type { Plugin, Schema } from '@sisad-pdfme/common';
import { DESIGNER_CLASSNAME } from '../../constants.js';
import { mergeUniqueClassNames } from './shared/className.js';

type RuntimeCustomSchemaDefinition = {
  id: string;
  label: string;
  category: string;
  pluginType: string;
  autoFillSource?: string;
  defaultValue?: string;
};

type LeftSidebarCustomPanelProps = {
  definitions: RuntimeCustomSchemaDefinition[];
  variant: 'compact' | 'panel';
  onOpenCreate: () => void;
  renderDraggableItem: (definition: RuntimeCustomSchemaDefinition, plugin: Plugin<Schema>) => React.ReactNode;
  resolvePlugin: (pluginType: string) => Plugin<Schema> | undefined;
};

const LeftSidebarCustomPanel = ({
  definitions,
  variant,
  onOpenCreate,
  renderDraggableItem,
  resolvePlugin,
}: LeftSidebarCustomPanelProps) => (
  <div
    className={mergeUniqueClassNames(
      `${DESIGNER_CLASSNAME}left-sidebar-custom`,
      'rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-2.5 shadow-sm',
    )}
  >
    <div className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-head`, 'flex items-start justify-between gap-2.5')}>
      <div className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-head-copy`, 'min-w-0')}>
        <strong className="block text-[0.8rem] font-semibold tracking-tight text-slate-900">Campos personalizados</strong>
        <span className="block text-[11px] text-slate-500">{definitions.length} disponibles</span>
      </div>
      <button
        type="button"
        className={mergeUniqueClassNames(
          `${DESIGNER_CLASSNAME}left-sidebar-custom-add`,
          'inline-flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-base font-semibold text-slate-700 shadow-sm transition',
          'hover:border-sky-200 hover:text-sky-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
        )}
        onClick={onOpenCreate}
        aria-label="Añadir un campo personalizado"
      >
        +
      </button>
    </div>
    <div className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-list`, 'mt-2.5 space-y-[0.3125rem]')}>
      {definitions.length === 0 ? (
        <span className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-empty`, 'block rounded-xl border border-dashed border-slate-200 bg-white px-3 py-3.5 text-[0.8rem] text-slate-500')}>
          No hay campos personalizados
        </span>
      ) : (
        definitions.map((definition) => {
          const plugin = resolvePlugin(definition.pluginType);
          if (!plugin) return null;

          return (
            <React.Fragment key={definition.id}>{renderDraggableItem(definition, plugin)}</React.Fragment>
          );
        })
      )}
    </div>
    {variant === 'panel' ? (
      <Button
        type="default"
        onClick={onOpenCreate}
        className="mt-2.5 h-8 w-full rounded-xl border-slate-200 text-[0.75rem] font-semibold text-slate-700 shadow-none"
      >
        Crear campo personalizado
      </Button>
    ) : null}
  </div>
);

export type { RuntimeCustomSchemaDefinition };
export default LeftSidebarCustomPanel;
