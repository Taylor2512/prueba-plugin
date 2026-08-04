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
import { mergeClassNames } from '../../shared/className.js';
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
  const watchConfig = React.useMemo(() => ({ '#': watchHandler }), [watchHandler]);
  const formRenderKey = React.useMemo(
    () => `${resetToken || 'detail'}:${sectionKey || title}`,
    [resetToken, sectionKey, title],
  );

  return (
    <DetailSectionCard
      sectionKey={sectionKey}
      title={title}
      description={description}
      defaultCollapsed={defaultCollapsed}
      resetToken={resetToken}
    >
      {directWidget ? (
        // DetailSectionCard → widget. No form shell / Ant Card levels in between.
        directWidget({ readOnly } as PropPanelWidgetProps)
      ) : (
        <div
          className={mergeClassNames(
            `${DESIGNER_CLASSNAME}detail-view-form-shell`,
            'flex min-h-0 w-full flex-col rounded-lg bg-transparent p-0 shadow-none',
            '[&_.fr-form]:w-full [&_.fr-form]:min-w-0',
            '[&_.ant-form]:w-full [&_.ant-form]:min-w-0',
            '[&_.ant-row]:mx-0 [&_.ant-col]:px-[0.1875rem]',
            '[&_.ant-form-item]:mb-[0.3125rem] [&_.ant-form-item-label]:pb-[0.0625rem]',
            '[&_.ant-form-item-label>label]:h-auto [&_.ant-form-item-label>label]:text-[0.5938rem] [&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:leading-tight [&_.ant-form-item-label>label]:tracking-[0.02em] [&_.ant-form-item-label>label]:text-[var(--color-gray-600)]',
            '[&_.ant-input]:min-h-[var(--inspector-field-min-height)] [&_.ant-input]:rounded-md [&_.ant-input]:border-slate-200 [&_.ant-input]:text-[0.6875rem] [&_.ant-input]:shadow-none [&_.ant-input]:transition-[border-color,box-shadow,background-color]',
            '[&_.ant-input:focus]:bg-white [&_.ant-input-number-input:focus]:bg-white',
            '[&_.ant-input-number]:min-h-[var(--inspector-field-min-height)] [&_.ant-input-number]:rounded-md [&_.ant-input-number]:border-slate-200 [&_.ant-input-number]:text-[0.6875rem] [&_.ant-input-number]:shadow-none [&_.ant-input-number]:transition-[border-color,box-shadow] [&_.ant-input-number:hover]:border-[var(--color-primary-30)] [&_.ant-input-number:focus-within]:border-[var(--color-primary)] [&_.ant-input-number:focus-within]:shadow-[0_0_0_2px_var(--color-primary-10)]',
            '[&_.ant-input-number-input]:h-[var(--inspector-field-min-height)] [&_.ant-input-number-input]:leading-none',
            '[&_.ant-select-selector]:min-h-[var(--inspector-field-min-height)] [&_.ant-select-selector]:rounded-md [&_.ant-select-selector]:border-slate-200 [&_.ant-select-selector]:text-[0.6875rem] [&_.ant-select-selector]:shadow-none [&_.ant-select-selector]:transition-[border-color,box-shadow] [&_.ant-select-selection-item]:leading-[var(--inspector-field-min-height)] [&_.ant-select-selection-item]:text-[0.6875rem] [&_.ant-select:hover_.ant-select-selector]:border-[var(--color-primary-30)] [&_.ant-select-focused_.ant-select-selector]:border-[var(--color-primary)] [&_.ant-select-focused_.ant-select-selector]:shadow-[0_0_0_2px_var(--color-primary-10)]',
            '[&_.ant-card]:border-0 [&_.ant-card]:bg-transparent [&_.ant-card]:shadow-none',
            '[&_.ant-card-head]:min-h-0 [&_.ant-card-head]:border-b-0 [&_.ant-card-head]:px-0 [&_.ant-card-head]:pb-1 [&_.ant-card-head]:pt-0',
            '[&_.ant-card-head-title]:px-0 [&_.ant-card-head-title]:text-[11px] [&_.ant-card-head-title]:font-semibold [&_.ant-card-head-title]:text-slate-500',
            '[&_.ant-card-body]:p-0',
            '[&_.ant-checkbox-wrapper]:inline-flex [&_.ant-checkbox-wrapper]:items-center [&_.ant-checkbox-wrapper]:gap-[0.375rem] [&_.ant-checkbox-wrapper]:text-[0.6875rem] [&_.ant-checkbox-wrapper]:text-[var(--color-text-secondary)] [&_.ant-checkbox-wrapper]:cursor-pointer [&_.ant-checkbox-wrapper]:transition-colors [&_.ant-checkbox-wrapper:hover]:text-[var(--color-text-primary)]',
          )}
        >
          <FormRenderComponent
            key={formRenderKey}
            form={form}
            schema={schema}
            widgets={widgets}
            watch={watchConfig}
            readOnly={readOnly}
            // form-render types only accept 'zh-CN' | 'en-US'. Use 'en-US' to satisfy typing.
            locale="en-US"
            // `footer={{reset:{hide:true},submit:{hide:true}}}` seguía siendo
            // truthy para form-render: ocultaba los botones pero mantenía un
            // Row/Col/Form.Item vacío al pie de CADA sección. `false` lo elimina.
            footer={false}
          />
        </div>
      )}
    </DetailSectionCard>
  );
};

export default DetailFormSection;
