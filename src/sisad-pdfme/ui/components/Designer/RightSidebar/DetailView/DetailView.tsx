/**
 * DetailView — inspector principal del schema activo.
 *
 * Orquesta hidratación del formulario, validaciones de posición/nombre,
 * construcción de widgets, generación de secciones y emisión de cambios al
 * canvas. Este componente debe coordinar contratos, pero no manipular DOM del
 * canvas, Moveable ni Selecto.
 */
import { useForm } from 'form-render';
import React, { useContext, useEffect, useCallback, useMemo, useState } from 'react';
import type {
  Dict,
  ChangeSchemaItem,
  PropPanelInspectorConfig,
  PropPanelSchema,
  SchemaForUI,
} from '@sisad-pdfme/common';
import { isBlankPdf } from '@sisad-pdfme/common';
import type { SidebarProps } from '../../../../types.js';
import { I18nContext, PluginsRegistry, OptionsContext } from '../../../../contexts.js';
import { debounce } from '../../../../helper.js';
import { theme } from 'antd';
import { InternalNamePath, ValidateErrorEntity } from 'rc-field-form/es/interface.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import { asRecord, isRecord } from '../../../../../shared/objectGuards.js';
import type { SisadPdfmeVisibilityConfig } from '../../../../../config/SisadPdfmeConfig.js';
import {
  resolveDesignerSchemaAccessState,
  type SchemaAccessState,
  type SchemaAccessContext,
} from '../../shared/accessPolicy.js';
import { buildInspectorSections } from './detailSchemas.js';
import buildDetailWidgets from './detailWidgetRegistry.js';
import DetailViewContent from './DetailViewContent.js';
import {
  getSchemaConfigStorageKey,
  getSchemaDesignerConfig,
  mergeSchemaDesignerConfig,
  resolveDesignerEngine,
  type SchemaDesignerConfig,
} from '../../../../designerEngine.js';

/**
 * Props requeridas por el inspector principal del schema activo.
 */
type DetailViewProps = Pick<
  SidebarProps,
  | 'size'
  | 'schemas'
  | 'schemasList'
  | 'pageSize'
  | 'basePdf'
  | 'changeSchemas'
  | 'activeElements'
  | 'deselectSchema'
  | 'collaborationContext'
> & {
  activeSchema: SchemaForUI;
  selectionCommands?: SelectionCommandSet;
};

/** Campos geométricos validados por límites de página. */
type PositionFieldName = 'x' | 'y' | 'width' | 'height';

/** Límites efectivos usados para validar posición y tamaño. */
type PositionBounds = {
  pageWidth: number;
  pageHeight: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
};

/**
 * Crea valores iniciales para hidratar form-render desde un schema.
 */
const createHydrationValues = (schema: SchemaForUI): Record<string, unknown> => {
  const values: Record<string, unknown> = { ...schema };
  values.editable = !Boolean(values.readOnly);
  return values;
};

/**
 * Crea un validador de posición/tamaño acotado por página y padding.
 */
const createPositionValidator =
  (getFormValues: () => Record<string, unknown>, bounds: PositionBounds) =>
  (_: unknown, value: number, fieldName: PositionFieldName): boolean => {
    const formValues = getFormValues();
    const position = asRecord(formValues.position) || undefined;
    const width = typeof formValues.width === 'number' ? formValues.width : undefined;
    const height = typeof formValues.height === 'number' ? formValues.height : undefined;
    const positionX = typeof position?.x === 'number' ? position.x : undefined;
    const positionY = typeof position?.y === 'number' ? position.y : undefined;

    if (positionX === undefined || positionY === undefined || width === undefined || height === undefined) return true;

    const validators: Record<PositionFieldName, () => boolean> = {
      x: () => {
        if (value < bounds.paddingLeft || value > bounds.pageWidth - bounds.paddingRight) return true;
        if (width > 0 && value + width > bounds.pageWidth - bounds.paddingRight) return false;
        return true;
      },
      y: () => {
        if (value < bounds.paddingTop || value > bounds.pageHeight - bounds.paddingBottom) return true;
        if (height > 0 && value + height > bounds.pageHeight - bounds.paddingBottom) return false;
        return true;
      },
      width: () => {
        if (positionX < bounds.paddingLeft || positionX > bounds.pageWidth - bounds.paddingRight) return true;
        if (value > 0 && positionX + value > bounds.pageWidth - bounds.paddingRight) return false;
        return true;
      },
      height: () => {
        if (positionY < bounds.paddingTop || positionY > bounds.pageHeight - bounds.paddingBottom) return true;
        if (value > 0 && positionY + value > bounds.pageHeight - bounds.paddingBottom) return false;
        return true;
      },
    };

    return validators[fieldName]();
  };

/**
 * Compara valores de formulario contra el schema actual y genera cambios.
 */
const buildChangeSet = (nextValues: Record<string, unknown>, currentSchema: SchemaForUI): ChangeSchemaItem[] => {
  const ignoredKeys = new Set(['id', 'content']);
  const nullableKeys = new Set(['rotate', 'opacity']);
  const changes: ChangeSchemaItem[] = [];
  const currentValues = asRecord(currentSchema) || {};

  const valuesDiffer = (formValue: unknown, schemaValue: unknown): boolean => {
    if (typeof formValue === 'object' && formValue !== null) {
      return JSON.stringify(formValue) !== JSON.stringify(schemaValue);
    }
    return formValue !== schemaValue;
  };

  for (const key in nextValues) {
    if (ignoredKeys.has(key)) continue;

    let value = nextValues[key];
    if (!valuesDiffer(value, currentValues[key])) continue;

    if (value === null && nullableKeys.has(key)) {
      value = undefined;
    }

    if (key === 'editable') {
      const readOnlyValue = !value;
      changes.push({ key: 'readOnly', value: readOnlyValue, schemaId: currentSchema.id });
      if (readOnlyValue) {
        changes.push({ key: 'required', value: false, schemaId: currentSchema.id });
      }
      continue;
    }

    changes.push({ key, value, schemaId: currentSchema.id });
  }

  return changes;
};

/**
 * Remueve cambios cuyo campo está reportado como inválido por form-render.
 */
const filterInvalidChanges = (
  changes: ChangeSchemaItem[],
  reason: ValidateErrorEntity,
): ChangeSchemaItem[] =>
  changes.filter(
    (change) =>
      !reason.errorFields.some((field: { name: InternalNamePath; errors: string[] }) =>
        field.name.includes(change.key),
      ),
  );

/**
 * Inspector principal del schema activo.
 *
 * @param props Contexto del sidebar, schema activo y comandos de selección.
 * @returns Vista de detalle con header y secciones dinámicas.
 */
const DetailView = (props: DetailViewProps) => {
  const { token } = theme.useToken();
  const {
    schemasList,
    changeSchemas,
    deselectSchema,
    activeSchema,
    activeElements,
    pageSize,
    basePdf,
    collaborationContext,
  } = props;
  const form = useForm();
  const i18n = useContext(I18nContext);
  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext);
  const designerEngine = useMemo(() => resolveDesignerEngine(asRecord(options) || {}), [options]);

  const accessContext = useMemo<SchemaAccessContext>(
    () => ({
      actorId: collaborationContext?.actorId || null,
      isGlobalView: collaborationContext?.isGlobalView ?? false,
      canEditStructure: collaborationContext?.canEditStructure ?? true,
    }),
    [collaborationContext],
  );

  const accessState = useMemo<SchemaAccessState>(
    () => resolveDesignerSchemaAccessState(activeSchema, accessContext),
    [activeSchema, accessContext],
  );
  const selectionCount = Array.isArray(activeElements) ? activeElements.length : 0;

  const isReadOnly = useMemo(() => accessState.isLockedByOther || !accessState.isEditable, [accessState]);

  const schemaConfig = useMemo(
    () => getSchemaDesignerConfig(activeSchema, designerEngine) || null,
    [activeSchema, designerEngine],
  );
  const [isHydratingForm, setIsHydratingForm] = useState(false);

  const typedI18n = useCallback(
    (key: string): string => {
      return typeof i18n === 'function' ? i18n(key as keyof Dict) : key;
    },
    [i18n],
  );

  const normalizeColorHex = useCallback((value: unknown): string => {
    if (typeof value !== 'string') return '#000000';
    const hexMatch = value.trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (hexMatch) {
      const raw = hexMatch[1];
      if (raw.length === 3) {
        return `#${raw
          .split('')
          .map((c) => `${c}${c}`)
          .join('')}`;
      }
      return `#${raw}`;
    }

    const rgbMatch = value
      .replace(/\s+/g, '')
      .match(/^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(?:,[0-9.]+)?\)$/i);
    if (rgbMatch) {
      const [r, g, b] = rgbMatch.slice(1, 4).map((n) => {
        const parsed = Number(n);
        return Math.max(0, Math.min(255, Number.isFinite(parsed) ? parsed : 0));
      });
      return `#${[r, g, b]
        .map((channel) => channel.toString(16).padStart(2, '0'))
        .join('')}`;
    }
    return '#000000';
  }, []);

  const widgets = React.useMemo(
    () =>
      buildDetailWidgets({
        pluginsRegistry,
        options,
        token,
        typedI18n,
        normalizeColorHex,
        props: {
          ...props,
          designerEngine,
          schemaConfig,
          updateSchemaConfig: (patch: Partial<SchemaDesignerConfig>) => {
            const currentConfig = getSchemaDesignerConfig(activeSchema, designerEngine) || {};
            const nextSchema = mergeSchemaDesignerConfig(activeSchema, patch, designerEngine);
            const storageKey = getSchemaConfigStorageKey(designerEngine);
            const nextConfig = getSchemaDesignerConfig(nextSchema, designerEngine) || {};
            if (JSON.stringify(currentConfig) === JSON.stringify(nextConfig)) return;
            changeSchemas([{ schemaId: activeSchema.id, key: storageKey, value: nextConfig }]);
          },
        },
      }),
    [
      activeSchema,
      changeSchemas,
      designerEngine,
      normalizeColorHex,
      options,
      pluginsRegistry,
      props,
      schemaConfig,
      token,
      typedI18n,
    ],
  );

  useEffect(() => {
    const values = createHydrationValues(activeSchema);

    let resetTimeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeoutId = setTimeout(() => {
      setIsHydratingForm(true);
      if (typeof form.setValues === 'function') {
        form.setValues(values);
      }
      resetTimeoutId = setTimeout(() => {
        setIsHydratingForm(false);
      }, 0);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (resetTimeoutId !== undefined) {
        clearTimeout(resetTimeoutId);
      }
    };
  }, [activeSchema, form]);

  const validateUniqueSchemaName = useCallback(
    (_: unknown, value: string): boolean => {
      for (const page of schemasList) {
        for (const schema of Object.values(page)) {
          if (schema.name === value && schema.id !== activeSchema.id) {
            return false;
          }
        }
      }
      return true;
    },
    [schemasList, activeSchema.id],
  );

  const [paddingTop, paddingRight, paddingBottom, paddingLeft] = isBlankPdf(basePdf)
    ? basePdf.padding
    : [0, 0, 0, 0];

  const validatePosition = createPositionValidator(
    () => asRecord(form.getValues()) || {},
    {
      pageWidth: pageSize.width,
      pageHeight: pageSize.height,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    },
  );

  const handleWatch = debounce(function (...args: unknown[]) {
    if (isHydratingForm) return;
    const formSchema = asRecord(args[0]) || {};
    let changes = buildChangeSet(formSchema, activeSchema);

    if (changes.length) {
      form
        .validateFields()
        .then(() => changeSchemas(changes))
        .catch((reason: ValidateErrorEntity) => {
          if (reason.errorFields.length) {
            changes = filterInvalidChanges(changes, reason);
          }
          if (changes.length) {
            changeSchemas(changes);
          }
        });
    }
  }, 100);

  const activePlugin = pluginsRegistry.findByType(activeSchema.type);
  if (!activePlugin) {
    throw Error(`[@sisad-pdfme/ui] Failed to find plugin used for ${activeSchema.type}`);
  }

  const defaultSchema: Record<string, unknown> = isRecord(activePlugin?.propPanel?.defaultSchema)
    ? { ...activePlugin.propPanel.defaultSchema }
    : {};

  let pluginProps: Record<string, PropPanelSchema> = {};
  if (typeof activePlugin.propPanel.schema === 'function') {
    const { size, schemas, pageSize, changeSchemas, activeElements, deselectSchema, activeSchema } = props;
    const propPanelProps = {
      size,
      schemas,
      pageSize,
      changeSchemas,
      activeElements,
      deselectSchema,
      activeSchema,
    };
    const functionResult = activePlugin.propPanel.schema({
      ...propPanelProps,
      options,
      theme: token,
      i18n: typedI18n,
    });
    if (isRecord(functionResult)) {
      pluginProps = functionResult as Record<string, PropPanelSchema>;
    }
  } else if (activePlugin.propPanel.schema && typeof activePlugin.propPanel.schema === 'object') {
    pluginProps = activePlugin.propPanel.schema as Record<string, PropPanelSchema>;
  }
  const inspectorConfig = (activePlugin.propPanel.inspector || undefined) as PropPanelInspectorConfig | undefined;

  const maxWidth = pageSize.width - paddingLeft - paddingRight;
  const maxHeight = pageSize.height - paddingTop - paddingBottom;
  const visibility = asRecord(asRecord(options)?.visibility) as SisadPdfmeVisibilityConfig | undefined;
  const sections = buildInspectorSections({
    activeSchemaType: activeSchema.type,
    activeSchema,
    schemaConfig,
    typedI18n,
    defaultSchema,
    pluginProps,
    inspectorConfig,
    pageSize,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    maxWidth,
    maxHeight,
    validateUniqueSchemaName,
    validatePosition,
    visibility,
  });
  const detailViewResetToken = schemaFingerprint(activeSchema);

  return (
    <DetailViewContent
      activeSchema={activeSchema}
      resetToken={detailViewResetToken}
      schemaConfig={schemaConfig}
      selectionCount={selectionCount}
      deselectSchema={deselectSchema}
      form={form}
      sections={sections}
      widgets={widgets}
      watchHandler={handleWatch}
      readOnly={isReadOnly}
      accessState={accessState}
    />
  );
};

/**
 * Construye una huella estable para evitar renders innecesarios del DetailView.
 */
const schemaFingerprint = (schema: SchemaForUI) => {
  const coreKeys = new Set([
    'id',
    'name',
    'type',
    'content',
    'width',
    'height',
    'required',
    'readOnly',
    'rotate',
    'opacity',
    'position',
  ]);
  const rawSchema = asRecord(schema) || {};
  const extraFingerprint = Object.keys(rawSchema)
    .filter((key) => !coreKeys.has(key))
    .sort()
    .map((key) => `${key}:${JSON.stringify(rawSchema[key])}`)
    .join('|');
  const rawPosition = asRecord(rawSchema.position);

  return [
    rawSchema.id,
    rawSchema.name,
    rawSchema.type,
    rawSchema.content,
    rawSchema.width,
    rawSchema.height,
    rawSchema.required ? '1' : '0',
    rawSchema.readOnly ? '1' : '0',
    rawSchema.rotate ?? '',
    rawSchema.opacity ?? '',
    rawPosition?.x ?? '',
    rawPosition?.y ?? '',
    extraFingerprint,
  ].join('|');
};

/**
 * Comparador personalizado para React.memo basado en huella del schema activo.
 */
const propsAreUnchanged = (prevProps: DetailViewProps, nextProps: DetailViewProps) =>
  schemaFingerprint(prevProps.activeSchema) === schemaFingerprint(nextProps.activeSchema);

export default React.memo(DetailView, propsAreUnchanged);
