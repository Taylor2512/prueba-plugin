import React from 'react';
import { Button, Tooltip } from 'antd';
import type { Plugin, Schema } from '@sisad-pdfme/common';
import PluginIcon from './PluginIcon.js';
import { DESIGNER_CLASSNAME } from '../../constants.js';

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
  <div className={`${DESIGNER_CLASSNAME}left-sidebar-custom`}>
    <div className={`${DESIGNER_CLASSNAME}left-sidebar-custom-head`}>
      <div className={`${DESIGNER_CLASSNAME}left-sidebar-custom-head-copy`}>
        <strong>Campos personalizados</strong>
        <span>{definitions.length} disponibles</span>
      </div>
      <button
        type="button"
        className={`${DESIGNER_CLASSNAME}left-sidebar-custom-add`}
        onClick={onOpenCreate}
        aria-label="Añadir un campo personalizado"
      >
        +
      </button>
    </div>
    <div className={`${DESIGNER_CLASSNAME}left-sidebar-custom-list`}>
      {definitions.length === 0 ? (
        <span className={`${DESIGNER_CLASSNAME}left-sidebar-custom-empty`}>No hay campos personalizados</span>
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
      <div className={`${DESIGNER_CLASSNAME}left-sidebar-custom-preview`}>
        {definitions.slice(0, 2).map((definition) => {
          const plugin = resolvePlugin(definition.pluginType);
          if (!plugin) return null;

          return (
            <Tooltip key={`${definition.id}-preview`} title={definition.label}>
              <div className={`${DESIGNER_CLASSNAME}left-sidebar-custom-preview-item`}>
                <span className={`${DESIGNER_CLASSNAME}left-sidebar-custom-preview-icon`}>
                  <PluginIcon plugin={plugin} label={definition.label} size={16} />
                </span>
                <div className={`${DESIGNER_CLASSNAME}left-sidebar-custom-preview-copy`}>
                  <div className={`${DESIGNER_CLASSNAME}left-sidebar-custom-preview-title`}>
                    {definition.label}
                  </div>
                  <div className={`${DESIGNER_CLASSNAME}left-sidebar-custom-preview-meta`}>
                    {definition.pluginType}
                  </div>
                </div>
              </div>
            </Tooltip>
          );
        })}
        <Button type="default" onClick={onOpenCreate}>
          Crear campo personalizado
        </Button>
      </div>
    ) : null}
  </div>
);

export type { RuntimeCustomSchemaDefinition };
export default LeftSidebarCustomPanel;
