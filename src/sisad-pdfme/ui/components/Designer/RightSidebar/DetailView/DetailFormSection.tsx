/**
 * DetailFormSection — puente entre una sección del inspector y form-render.
 *
 * Renderiza cada sección dentro de `DetailSectionCard` y decide si debe usar el
 * shell de `FormRenderComponent` o montar un widget React directo. Mantiene las
 * secciones del DetailView pequeñas, colapsables y desacopladas de plugins.
 */
import React from 'react';
import type { PropPanelSchema, PropPanelWidgetProps } from '@sisad-pdfme/common';
import type { useForm } from 'form-render';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import DetailSectionCard from './DetailSectionCard.js';
import FormRenderComponent from 'form-render';

/**
 * Props de una sección renderizable del DetailView.
 */
type DetailFormSectionProps = {
  sectionKey?: string;
  title: string;
  description: string;
  schema: PropPanelSchema;
  form: ReturnType<typeof useForm>;
  widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element>;
  watchHandler: (..._args: unknown[]) => void;
  defaultCollapsed?: boolean;
  resetToken?: string;
  readOnly?: boolean;
};

/** Widgets that render as direct React children of the section card, skipping
 * form-render entirely (no form shell, no ant Row/Col, no Ant Card). */
/**
 * Widgets que se montan directamente, sin shell de form-render.
 *
 * Útil para editores React complejos que ya manejan su propio layout.
 */
const DIRECT_RENDER_WIDGETS = new Set(['SchemaOptionsEditor']);

/**
 * Detecta si una sección contiene un único widget directo.
 *
 * @param schema Schema de form-render para la sección.
 * @param widgets Registro de widgets disponibles.
 * @returns Componente directo o null si debe usarse form-render.
 */
const resolveDirectWidget = (
  schema: PropPanelSchema,
  widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element>,
): ((_widgetProps: PropPanelWidgetProps) => React.JSX.Element) | null => {
  const properties = (schema as { properties?: Record<string, PropPanelSchema> }).properties || {};
  const entries = Object.entries(properties).filter(([fieldKey]) => !/^-+$/.test(fieldKey));
  if (entries.length !== 1) return null;
  const widgetName = String(entries[0][1]?.widget || '');
  if (!DIRECT_RENDER_WIDGETS.has(widgetName)) return null;
  return widgets[widgetName] || null;
};

/**
 * Renderiza una sección del inspector usando card colapsable.
 *
 * @param props Datos, schema y widgets requeridos para la sección.
 * @returns Sección visual del DetailView.
 */
const DetailFormSection = ({
  sectionKey,
  title,
  description,
  schema,
  form,
  widgets,
  watchHandler,
  defaultCollapsed = false,
  resetToken,
  readOnly = false,
}: DetailFormSectionProps) => {
  const directWidget = resolveDirectWidget(schema, widgets);

  return (
    <DetailSectionCard
      key={resetToken || sectionKey || title}
      sectionKey={sectionKey}
      title={title}
      description={description}
      defaultCollapsed={defaultCollapsed}
    >
      {directWidget ? (
        // DetailSectionCard → widget. No form shell / Ant Card levels in between.
        directWidget({ readOnly } as PropPanelWidgetProps)
      ) : (
        <div className={`${DESIGNER_CLASSNAME}detail-view-form-shell rounded-lg bg-transparent p-0 shadow-none`}>
          <FormRenderComponent
            form={form}
            schema={schema}
            widgets={widgets}
            watch={{ '#': watchHandler }}
            readOnly={readOnly}
            // form-render types only accept 'zh-CN' | 'en-US'. Use 'en-US' to satisfy typing.
            locale="en-US"
            footer={{
              reset: { hide: true },
              submit: { hide: true },
            }}
          />
        </div>
      )}
    </DetailSectionCard>
  );
};

export default DetailFormSection;
