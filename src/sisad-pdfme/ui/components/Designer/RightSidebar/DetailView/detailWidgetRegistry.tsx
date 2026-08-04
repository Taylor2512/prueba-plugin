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
import { asRecord } from '../../../../../shared/objectGuards.js';
import {
  describeSchemaAccessDenyReason,
  type SchemaAccessState,
} from '../../shared/accessPolicy.js';

/**
 * Deriva un `data-testid` estable desde el path del campo de form-render.
 *
 * `required` → `inspector-required-switch`. Es el ancla que usan las pruebas
 * e2e, que antes tenían que localizar los switches por posición.
 */
const buildSwitchTestId = (fieldId: unknown): string | undefined => {
  const normalized = String(fieldId ?? '')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return normalized ? `inspector-${normalized}-switch` : undefined;
};

/**
 * Lee el valor de un widget booleano de form-render.
 *
 * form-render declara `valuePropName: 'checked'` para los widgets `switch` y
 * `checkbox` (`render-core/FieldItem`), así que el valor no llega en `value`
 * sino en `checked`. Leer solo `value` dejaba a todos los switches del
 * inspector con `undefined`: nacían apagados aunque el schema dijera lo
 * contrario y volvían a apagarse tras cada commit.
 */
const readBooleanWidgetValue = (widgetProps: PropPanelWidgetProps): unknown => {
  const { value, checked } = widgetProps as { value?: unknown; checked?: unknown };
  return value === undefined ? checked : value;
};

/** Etiqueta accesible del widget, tomada del schema del campo. */
const resolveWidgetLabel = (widgetProps: PropPanelWidgetProps): string | undefined => {
  const title = asRecord(widgetProps.schema)?.title;
  return typeof title === 'string' && title.trim() ? title : undefined;
};

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
  /** Fuente de verdad del acceso; los widgets no recalculan permisos. */
  accessState?: SchemaAccessState;
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
 * Contexto con los parámetros vigentes del inspector.
 *
 * form-render resuelve cada widget por nombre en cada render y lo usa como tipo
 * de componente: si estas funciones cambiaran de identidad, React desmontaría el
 * control que el usuario acaba de tocar (el switch perdía el foco y "rebotaba").
 * El registro se construye una vez por tipo de schema y los valores frescos
 * llegan por contexto, no por closure.
 */
const InspectorWidgetParamsContext = React.createContext<BuildWidgetsParams | null>(null);

/** Provider de los parámetros que consumen los widgets del inspector. */
export const InspectorWidgetParamsProvider = InspectorWidgetParamsContext.Provider;

/** Lee los parámetros vigentes; falla ruidosamente si falta el provider. */
const useWidgetParams = (): BuildWidgetsParams => {
  const params = React.useContext(InspectorWidgetParamsContext);
  if (!params) {
    throw Error('[@sisad-pdfme/ui] InspectorWidgetParamsProvider ausente en el DetailView');
  }
  return params;
};

/** Permiso estructural vigente; fuente única para todos los widgets. */
const useWidgetAccess = () => {
  const { accessState } = useWidgetParams();
  return {
    canEditStructure: accessState ? accessState.canEditStructure : true,
    deniedReason: describeSchemaAccessDenyReason(accessState?.reasons.structure),
  };
};

/** Selector de color nativo del inspector. */
const NativeColorWidget = (p: PropPanelWidgetProps) => {
  const { normalizeColorHex } = useWidgetParams();
  return <ColorPickerWidget value={p.value} onChange={p.onChange} normalizeHex={normalizeColorHex} />;
};

/** Switch booleano del inspector, con el acceso ya resuelto. */
const InspectorSwitchWidget = (p: PropPanelWidgetProps) => {
  const { canEditStructure, deniedReason } = useWidgetAccess();
  return (
    <BooleanSwitchWidget
      value={readBooleanWidgetValue(p)}
      onChange={(nextValue) => p.onChange?.(nextValue)}
      // `disabled` efectivo = widget + acceso. `p.readOnly` no se propaga como
      // bloqueo aquí: representa el modo readOnly del formulario, que ya se
      // deriva del permiso estructural en DetailView.
      disabled={p.disabled === true || !canEditStructure}
      disabledReason={canEditStructure ? undefined : deniedReason}
      testId={buildSwitchTestId(p.id)}
      aria-label={resolveWidgetLabel(p)}
    />
  );
};

/**
 * Construye el mapa de widgets que form-render puede usar en el DetailView.
 *
 * @param params Registry de plugins y tipo de schema activo (estables por tipo).
 * @returns Registro estable de widgets internos y de plugin.
 */
const buildDetailWidgets = (
  params: Pick<BuildWidgetsParams, 'pluginsRegistry'> & { activeSchemaType?: string },
): Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element> => {
  const activeSchemaType = typeof params.activeSchemaType === 'string' ? params.activeSchemaType : '';
  const familyPreset = getSchemaTypeInspectorPreset(activeSchemaType);

  const widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element> = {
    AlignWidget: (p) => {
      const { props, options } = useWidgetParams();
      return <AlignWidget {...p} {...props} options={options} selectionCommands={props.selectionCommands} />;
    },
    Divider: () => (
      <Divider
        className={`${DESIGNER_CLASSNAME}detail-view-divider my-1.5 border-slate-200/70`}
      />
    ),
    ButtonGroup: (p) => {
      const { props, options } = useWidgetParams();
      return <ButtonGroupWidget {...p} {...props} options={options} />;
    },
    nativeColor: NativeColorWidget,
    // Unified React options editor (select/radioGroup/checkboxGroup) — replaces
    // the imperative rootElement editors inside the DetailView.
    SchemaOptionsEditor: () => {
      const { props } = useWidgetParams();
      return <SchemaOptionsEditor activeSchema={props.activeSchema} changeSchemas={props.changeSchemas} />;
    },
    switch: InspectorSwitchWidget,
    InlineEditActionsWidget: () => {
      const { props, options } = useWidgetParams();
      const { canEditStructure } = useWidgetAccess();
      const schemaType = typeof props.activeSchema?.type === 'string' ? props.activeSchema.type : '';
      const isTextType = INLINE_EDITABLE_TEXT_TYPES.has(schemaType);
      // Mismo permiso estructural que los switches: sin esto el inspector
      // mostraba controles habilitados y acciones deshabilitadas (o al revés)
      // para el mismo estado de acceso.
      const canEdit = canEditStructure && props.selectionCommands?.canEditStructure !== false;
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
      return <SchemaFieldCommentsWidget {...p} {...useWidgetParams().props} />;
    };
    SchemaFieldCommentsWidgetRenderer.displayName = 'SchemaFieldCommentsWidget';
    widgets.SchemaFieldCommentsWidget = SchemaFieldCommentsWidgetRenderer;
  }

  if (familyPreset.supportsConnections) {
    const SchemaConnectionsWidgetRenderer = function SchemaConnectionsWidgetRenderer(
      p: PropPanelWidgetProps,
    ) {
      return <SchemaConnectionsWidget {...p} {...useWidgetParams().props} />;
    };
    SchemaConnectionsWidgetRenderer.displayName = 'SchemaConnectionsWidget';
    widgets.SchemaConnectionsWidget = SchemaConnectionsWidgetRenderer;
  }

  if (familyPreset.supportsCollaboration) {
    const SchemaCollaborationWidgetRenderer = function SchemaCollaborationWidgetRenderer(
      p: PropPanelWidgetProps,
    ) {
      return <SchemaCollaborationWidget {...p} {...useWidgetParams().props} />;
    };
    SchemaCollaborationWidgetRenderer.displayName = 'SchemaCollaborationWidget';
    widgets.SchemaCollaborationWidget = SchemaCollaborationWidgetRenderer;
  }

  for (const plugin of params.pluginsRegistry.values()) {
    const pluginWidgets = plugin.propPanel.widgets || {};
    Object.entries(pluginWidgets).forEach(([widgetKey, widgetValue]) => {
      const PluginWidgetRenderer = (p: PropPanelWidgetProps) => {
        const { props, options, token, typedI18n } = useWidgetParams();
        return (
          <WidgetRenderer
            {...p}
            {...props}
            options={options}
            theme={token}
            i18n={typedI18n}
            widget={widgetValue}
          />
        );
      };
      PluginWidgetRenderer.displayName = `PluginWidget(${widgetKey})`;
      widgets[widgetKey] = PluginWidgetRenderer;
    });
  }

  return widgets;
};

export default buildDetailWidgets;
