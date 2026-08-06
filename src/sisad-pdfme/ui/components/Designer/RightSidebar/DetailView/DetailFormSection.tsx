/**
 * DetailFormSection — puente entre una sección del inspector y form-render.
 *
 * Renderiza cada sección dentro de `DetailSectionCard` y decide si debe usar el
 * shell de `FormRenderComponent` o montar un widget React directo. Mantiene las
 * secciones del DetailView pequeñas, colapsables y desacopladas de plugins.
 */
import React from 'react';
import type { PropPanelSchema, PropPanelWidgetProps } from '@sisad-pdfme/common';
import FormRenderComponent, { useForm } from 'form-render';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';
import DetailSectionCard from './DetailSectionCard.js';

/** Instancia de formulario de una sección. */
export type SectionFormInstance = ReturnType<typeof useForm>;

/**
 * Props de una sección renderizable del DetailView.
 */
type DetailFormSectionProps = {
  sectionKey?: string;
  title: string;
  description: string;
  schema: PropPanelSchema;
  /** Valores del schema activo con los que hidratar la sección. */
  hydrationValues: Record<string, unknown>;
  widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element>;
  watchHandler: (
    _values: Record<string, unknown>,
    _form: SectionFormInstance,
    _touchedKeys: ReadonlySet<string>,
  ) => void;
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
/**
 * Formulario de una sección, con su propia instancia de form-render.
 *
 * Cada sección necesita su instancia: `useForm()` de form-render está pensado
 * para un único `<FormRender>`, y al compartir una instancia entre varias
 * secciones solo una recibía los valores — el resto renderizaba sus campos con
 * `value === undefined` (los switches nacían apagados y no reflejaban el
 * schema). La hidratación vive aquí y no en el padre para que también ocurra
 * cuando una sección colapsada se expande y se monta más tarde.
 */
const valuesDiffer = (a: unknown, b: unknown): boolean => {
  if ((typeof a === 'object' && a !== null) || (typeof b === 'object' && b !== null)) {
    return JSON.stringify(a) !== JSON.stringify(b);
  }
  return a !== b;
};

/** Margen sobre el debounce de commit del inspector (180 ms). */
const DEFERRED_HYDRATION_DELAY = 260;

/** Lee un valor anidado siguiendo una ruta `a.b.c`. */
const readByPath = (source: Record<string, unknown>, path: string): unknown =>
  path.split('.').reduce<unknown>(
    (accumulator, part) =>
      accumulator && typeof accumulator === 'object'
        ? (accumulator as Record<string, unknown>)[part]
        : undefined,
    source,
  );

/**
 * Expone como clave literal los campos cuyo nombre es una ruta (`validation.type`).
 *
 * El formulario los identifica por ese nombre exacto —así los emite en el watch—
 * pero `changeSchemas` los persiste por ruta, dejándolos anidados en el schema.
 * Sin este puente el valor se guarda y nunca vuelve: el control aparece vacío al
 * reseleccionar el campo.
 */
const withDottedKeys = (
  values: Record<string, unknown>,
  dottedKeys: readonly string[],
): Record<string, unknown> => {
  if (!dottedKeys.length) return values;
  const next = { ...values };
  dottedKeys.forEach((key) => {
    if (next[key] !== undefined) return;
    const value = readByPath(values, key);
    if (value !== undefined) next[key] = value;
  });
  return next;
};

const SectionFormRenderer = ({
  schema,
  hydrationValues,
  widgets,
  watchHandler,
  readOnly,
}: Pick<DetailFormSectionProps, 'schema' | 'hydrationValues' | 'widgets' | 'watchHandler' | 'readOnly'>) => {
  const form = useForm();
  // Firma estable: `schema` cambia de identidad en cada render, y usarlo como
  // dependencia rehidrataría el formulario continuamente.
  const dottedKeysSignature = Object.keys(
    (schema as { properties?: Record<string, unknown> }).properties || {},
  )
    .filter((key) => key.includes('.'))
    .join(',');
  const resolvedHydrationValues = React.useMemo(
    () => withDottedKeys(hydrationValues, dottedKeysSignature ? dottedKeysSignature.split(',') : []),
    [dottedKeysSignature, hydrationValues],
  );
  const hydratingRef = React.useRef(true);
  // `useForm` devuelve un objeto nuevo en cada render (hace rest sobre la
  // instancia de antd). Usarlo como dependencia rehidrataba el formulario en
  // cada render y borraba lo que el usuario estaba escribiendo, así que se
  // guarda en un ref y solo los valores disparan la hidratación.
  const formRef = React.useRef(form);
  const watchHandlerRef = React.useRef(watchHandler);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  /** Últimos valores conocidos, para saber qué tocó el usuario en cada watch. */
  const lastValuesRef = React.useRef<Record<string, unknown>>(resolvedHydrationValues);
  /** Hidratación aplazada porque el foco estaba dentro de la sección. */
  const pendingHydrationRef = React.useRef<Record<string, unknown> | null>(null);
  const pendingHydrationTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    formRef.current = form;
    watchHandlerRef.current = watchHandler;
  });

  const applyHydration = React.useCallback((values: Record<string, unknown>) => {
    hydratingRef.current = true;
    if (typeof formRef.current.setValues === 'function') {
      formRef.current.setValues(values);
    }
    lastValuesRef.current = values;
    setTimeout(() => {
      hydratingRef.current = false;
    }, 0);
  }, []);

  /**
   * El usuario está escribiendo aquí: rehidratar le borraría lo tecleado.
   *
   * Solo cuentan los campos de texto. Un botón con el foco (alineación, por
   * ejemplo) no tiene nada que preservar, y bloquear la hidratación por él
   * dejaba la sección desincronizada hasta el siguiente cambio de selección.
   */
  const hasFocusInside = () => {
    const container = containerRef.current;
    const active = typeof document === 'undefined' ? null : document.activeElement;
    if (!container || !active || !container.contains(active)) return false;
    if (!(active instanceof HTMLElement)) return false;
    if (active.isContentEditable) return true;
    const tagName = active.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea';
  };

  React.useLayoutEffect(() => {
    if (pendingHydrationTimeoutRef.current !== null) {
      clearTimeout(pendingHydrationTimeoutRef.current);
      pendingHydrationTimeoutRef.current = null;
    }
    // Los valores llegan del schema activo, así que también traen los cambios
    // hechos fuera del inspector (arrastre, resize, alineación, undo/redo).
    if (hasFocusInside()) {
      pendingHydrationRef.current = resolvedHydrationValues;
      return;
    }
    pendingHydrationRef.current = null;
    applyHydration(resolvedHydrationValues);
  }, [applyHydration, resolvedHydrationValues]);

  React.useEffect(
    () => () => {
      if (pendingHydrationTimeoutRef.current !== null) {
        clearTimeout(pendingHydrationTimeoutRef.current);
      }
    },
    [],
  );

  const handleBlurCapture = React.useCallback(() => {
    if (!pendingHydrationRef.current) return;
    if (pendingHydrationTimeoutRef.current !== null) {
      clearTimeout(pendingHydrationTimeoutRef.current);
    }
    // Se espera al commit en vuelo: si se rehidratara de inmediato, el valor
    // recién tecleado se sustituiría por el anterior antes de persistirse.
    pendingHydrationTimeoutRef.current = setTimeout(() => {
      pendingHydrationTimeoutRef.current = null;
      const pending = pendingHydrationRef.current;
      pendingHydrationRef.current = null;
      if (pending && !hasFocusInside()) {
        applyHydration(pending);
      }
    }, DEFERRED_HYDRATION_DELAY);
  }, [applyHydration]);

  const watchConfig = React.useMemo(
    () => ({
      '#': (...args: unknown[]) => {
        // Ignora el eco de la propia hidratación: no es una edición del usuario.
        if (hydratingRef.current) return;
        const nextValues = (args[0] as Record<string, unknown>) || {};
        const previousValues = lastValuesRef.current || {};
        const touchedKeys = new Set(
          Object.keys(nextValues).filter((key) => valuesDiffer(nextValues[key], previousValues[key])),
        );
        lastValuesRef.current = nextValues;
        if (touchedKeys.size === 0) return;
        watchHandlerRef.current(nextValues, formRef.current, touchedKeys);
      },
    }),
    [],
  );

  return (
    // `contents` mantiene el layout del shell intacto: este nodo solo existe
    // para acotar el foco y los blur de la sección.
    <div ref={containerRef} className="contents" onBlurCapture={handleBlurCapture}>
      <FormRenderComponent
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
  );
};

const DetailFormSection = ({
  sectionKey,
  title,
  description,
  schema,
  hydrationValues,
  widgets,
  watchHandler,
  defaultCollapsed = false,
  resetToken,
  readOnly = false,
}: DetailFormSectionProps) => {
  const directWidget = resolveDirectWidget(schema, widgets);
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
          <SectionFormRenderer
            key={formRenderKey}
            schema={schema}
            hydrationValues={hydrationValues}
            widgets={widgets}
            watchHandler={watchHandler}
            readOnly={readOnly}
          />
        </div>
      )}
    </DetailSectionCard>
  );
};

export default DetailFormSection;
