import React from 'react';
import { Button } from 'antd';
import type { Plugin, Schema } from '@sisad-pdfme/common';
import { DESIGNER_CLASSNAME } from '../../constants.js';
import { mergeUniqueClassNames } from './shared/className.js';
import { SidebarEmptyState } from './shared/SidebarEmptyState.js';

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
  density?: 'comfortable' | 'compact' | 'minimal';
  onOpenCreate: () => void;
  renderDraggableItem: (definition: RuntimeCustomSchemaDefinition, plugin: Plugin<Schema>) => React.ReactNode;
  resolvePlugin: (pluginType: string) => Plugin<Schema> | undefined;
};

const LeftSidebarCustomPanel = ({
  definitions,
  variant,
  density = 'comfortable',
  onOpenCreate,
  renderDraggableItem,
  resolvePlugin,
}: LeftSidebarCustomPanelProps) => (
  <div
    className={mergeUniqueClassNames(
      `${DESIGNER_CLASSNAME}left-sidebar-custom`,
      'rounded-[1rem] border border-slate-200/65 bg-white/95 p-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
      density === 'minimal' ? 'p-1.5' : ''
    )}
  >
    <div className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-head`, 'flex items-start justify-between gap-2.5')}>
      <div className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-head-copy`, 'min-w-0')}>
        <strong className={mergeUniqueClassNames('block font-semibold tracking-tight text-slate-900', density === 'minimal' ? 'text-[9px]' : 'text-[0.8rem]')}>Campos personalizados</strong>
        <span className={mergeUniqueClassNames('block text-slate-500', density === 'minimal' ? 'text-[8px]' : 'text-[11px]')}>{definitions.length} disponibles</span>
      </div>
      <button
        type="button"
        className={mergeUniqueClassNames(
          `${DESIGNER_CLASSNAME}left-sidebar-custom-add`,
          'inline-flex h-7 w-7 appearance-none items-center justify-center rounded-xl border border-slate-200/80 bg-white text-base font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition',
          'hover:border-sky-200 hover:text-sky-700 hover:shadow-[0_1px_3px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/55',
          density === 'minimal' ? 'h-5 w-5 text-sm rounded-lg' : ''
        )}
        onClick={onOpenCreate}
        aria-label="Añadir un campo personalizado"
      >
        +
      </button>
    </div>
    <div className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-list`, 'mt-2.5 space-y-[0.3125rem]')}>
      {definitions.length === 0 ? (
        <SidebarEmptyState
          title="Sin campos personalizados"
          description="Crea campos reutilizables con estilos y configuraciones específicas."
          density={density}
        />
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
        className={mergeUniqueClassNames(
          'mt-2.5 w-full rounded-xl border-slate-200/80 bg-white font-semibold text-slate-700 shadow-none',
          density === 'minimal' ? 'h-6 text-[9px]' : 'h-8 text-[0.75rem]'
        )}
      >
        Crear campo personalizado
      </Button>
    ) : null}
  </div>
);

export type { RuntimeCustomSchemaDefinition };
export default LeftSidebarCustomPanel;
