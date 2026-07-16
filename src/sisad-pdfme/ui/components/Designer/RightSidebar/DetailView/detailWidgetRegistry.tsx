/**
 * detailWidgetRegistry — registro de widgets disponibles para form-render.
 *
 * Construye el mapa final de widgets combinando primitives internas, widgets de
 * colaboración/conexiones/comentarios y widgets declarados por plugins. Mantiene
 * el DetailView desacoplado de implementaciones específicas.
 */
import React from 'react';
import type { GlobalToken, PropPanelWidgetProps, SchemaForUI, UIOptions } from '@sisad-pdfme/common';
import { Button, Divider, Tooltip } from 'antd';
import { Pencil, Type } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import AlignWidget from './AlignWidget.js';
import ButtonGroupWidget from './ButtonGroupWidget.js';
import WidgetRenderer from './WidgetRenderer.js';
import SchemaCollaborationWidget from './SchemaCollaborationWidget.js';
import SchemaConnectionsWidget from './SchemaConnectionsWidget.js';
import SchemaFieldCommentsWidget from './SchemaFieldCommentsWidget.js';
import SchemaOptionsEditor from './SchemaOptionsEditor.js';
import { getSchemaTypeInspectorPreset, INLINE_EDITABLE_TEXT_TYPES } from '../../../../../schemas/schemaFamilies.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import type { DesignerEngine, SchemaDesignerConfig } from '../../../../designerEngine.js';
import type { SidebarProps } from '../../../../types.js';
import { BooleanSwitchWidget } from './InspectorPrimitives.js';
import { ColorPickerWidget } from './detailWidgets.js';
import { asRecord } from '../../shared/objectGuards.js';

/**
 * Parámetros usados para construir el registro final de widgets.
 */
type BuildWidgetsParams = {
  pluginsRegistry: {
    values: () => Iterable<{
      propPanel: {
        widgets?: Record<string, (props: PropPanelWidgetProps) => void>;
      };
    }>;
  };
  options: UIOptions;
  token: GlobalToken;
  typedI18n: (key: string) => string;
  normalizeColorHex: (value: unknown) => string;
  props: Pick<
    SidebarProps,
    'size' | 'schemas' | 'schemasList' | 'pageSize' | 'basePdf' | 'changeSchemas' | 'activeElements' | 'deselectSchema'
  > & {
    activeSchema: SchemaForUI;
    selectionCommands?: SelectionCommandSet;
    designerEngine?: DesignerEngine;
    schemaConfig?: SchemaDesignerConfig | null;
    updateSchemaConfig: (patch: Partial<SchemaDesignerConfig>) => void;
  };
};

/**
 * Construye el mapa de widgets que form-render puede usar en el DetailView.
 *
 * @param params Registry de plugins, opciones, tema y props del sidebar.
 * @returns Registro de widgets internos y de plugin.
 */
const buildDetailWidgets = ({
  pluginsRegistry,
  options,
  token,
  typedI18n,
  normalizeColorHex,
  props,
}: BuildWidgetsParams): Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element> => {
  const activeSchemaType = typeof props?.activeSchema?.type === 'string' ? props.activeSchema.type : '';
  const familyPreset = getSchemaTypeInspectorPreset(activeSchemaType);
  const widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element> = {
    AlignWidget: (p) => <AlignWidget {...p} {...props} options={options} selectionCommands={props.selectionCommands} />,
    Divider: () => (
      <Divider
        className={`${DESIGNER_CLASSNAME}detail-view-divider my-1.5 border-slate-200/70`}
      />
    ),
    ButtonGroup: (p) => <ButtonGroupWidget {...p} {...props} options={options} />,
    nativeColor: (p) => <ColorPickerWidget value={p.value} onChange={p.onChange} normalizeHex={normalizeColorHex} />,
    // Unified React options editor (select/radioGroup/checkboxGroup) — replaces
    // the imperative rootElement editors inside the DetailView.
    SchemaOptionsEditor: () => (
      <SchemaOptionsEditor activeSchema={props.activeSchema} changeSchemas={props.changeSchemas} />
    ),
    switch: (p) => (
      <BooleanSwitchWidget
        value={p.value}
        onChange={(nextValue) => p.onChange?.(nextValue)}
        disabled={p.disabled}
        readOnly={p.readOnly}
      />
    ),
    InlineEditActionsWidget: () => {
      const schemaType = typeof props.activeSchema?.type === 'string' ? props.activeSchema.type : '';
      const isTextType = INLINE_EDITABLE_TEXT_TYPES.has(schemaType);
      const canEdit = props.selectionCommands?.canEditStructure !== false;
      const visibility = asRecord(asRecord(options)?.visibility);
      const actionsVisibility = asRecord(visibility?.actions);
      const showRename = actionsVisibility?.rename !== false;
      return (
        <div className={`${DESIGNER_CLASSNAME}inline-edit-actions`}>
          {showRename ? (
            <Tooltip title="Renombrar campo (F2)" placement="bottom">
              <Button
                size="small"
                icon={<Pencil size={12} />}
                disabled={!canEdit}
                onClick={() => props.selectionCommands?.renameLabel?.()}
                className={`${DESIGNER_CLASSNAME}inline-edit-btn`}
              >
                Renombrar campo
              </Button>
            </Tooltip>
          ) : null}
          {isTextType && (
            <Tooltip title="Editar texto (Enter)" placement="bottom">
              <Button
                size="small"
                icon={<Type size={12} />}
                disabled={!canEdit}
                onClick={() => props.selectionCommands?.editTextInline?.()}
                className={`${DESIGNER_CLASSNAME}inline-edit-btn`}
              >
                Editar texto
              </Button>
            </Tooltip>
          )}
        </div>
      );
    },
  };

  if (familyPreset.supportsComments) {
    const SchemaFieldCommentsWidgetRenderer = function SchemaFieldCommentsWidgetRenderer(
      p: PropPanelWidgetProps,
    ) {
      return <SchemaFieldCommentsWidget {...p} {...props} />;
    };
    SchemaFieldCommentsWidgetRenderer.displayName = 'SchemaFieldCommentsWidget';
    widgets.SchemaFieldCommentsWidget = SchemaFieldCommentsWidgetRenderer;
  }

  if (familyPreset.supportsConnections) {
    const SchemaConnectionsWidgetRenderer = function SchemaConnectionsWidgetRenderer(
      p: PropPanelWidgetProps,
    ) {
      return <SchemaConnectionsWidget {...p} {...props} />;
    };
    SchemaConnectionsWidgetRenderer.displayName = 'SchemaConnectionsWidget';
    widgets.SchemaConnectionsWidget = SchemaConnectionsWidgetRenderer;
  }

  if (familyPreset.supportsCollaboration) {
    const SchemaCollaborationWidgetRenderer = function SchemaCollaborationWidgetRenderer(
      p: PropPanelWidgetProps,
    ) {
      return <SchemaCollaborationWidget {...p} {...props} />;
    };
    SchemaCollaborationWidgetRenderer.displayName = 'SchemaCollaborationWidget';
    widgets.SchemaCollaborationWidget = SchemaCollaborationWidgetRenderer;
  }

  for (const plugin of pluginsRegistry.values()) {
    const pluginWidgets = plugin.propPanel.widgets || {};
    Object.entries(pluginWidgets).forEach(([widgetKey, widgetValue]) => {
      widgets[widgetKey] = (p) => (
        <WidgetRenderer
          {...p}
          {...props}
          options={options}
          theme={token}
          i18n={typedI18n}
          widget={widgetValue}
        />
      );
    });
  }

  return widgets;
};

export default buildDetailWidgets;
