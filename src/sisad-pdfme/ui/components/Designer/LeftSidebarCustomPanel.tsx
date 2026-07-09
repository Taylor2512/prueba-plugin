import React from 'react';
import { Button, Tooltip } from 'antd';
import type { Plugin, Schema } from '@sisad-pdfme/common';
import PluginIcon from './PluginIcon.js';
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
      <div className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-preview`, 'mt-2.5 rounded-2xl border border-slate-200/70 bg-white p-2.5 shadow-sm')}>
        {definitions.slice(0, 2).map((definition) => {
          const plugin = resolvePlugin(definition.pluginType);
          if (!plugin) return null;

          return (
            <Tooltip key={`${definition.id}-preview`} title={definition.label}>
              <div className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-preview-item`, 'flex items-center gap-2.5 rounded-xl px-2 py-1.5')}>
                <span
                  className={mergeUniqueClassNames(
                    `${DESIGNER_CLASSNAME}left-sidebar-custom-preview-icon`,
                    'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700',
                  )}
                >
                  <PluginIcon plugin={plugin} label={definition.label} size={16} />
                </span>
                <div className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-preview-copy`, 'min-w-0')}>
                  <div className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-preview-title`, 'truncate text-sm font-medium text-slate-800')}>
                    {definition.label}
                  </div>
                </div>
              </div>
            </Tooltip>
          );
        })}
        <Button
          type="default"
          onClick={onOpenCreate}
          className="mt-3 h-8 w-full rounded-xl border-slate-200 text-[0.75rem] font-semibold text-slate-700 shadow-none"
        >
          Crear campo personalizado
        </Button>
      </div>
    ) : null}
  </div>
);

export type { RuntimeCustomSchemaDefinition };
export default LeftSidebarCustomPanel;
