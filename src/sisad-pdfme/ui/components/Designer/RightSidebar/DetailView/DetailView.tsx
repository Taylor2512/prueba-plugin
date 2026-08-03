/**
 * DetailView — inspector principal del schema activo.
 *
 * Orquesta hidratación del formulario, validaciones de posición/nombre,
 * construcción de widgets, generación de secciones y emisión de cambios al
 * canvas. Este componente debe coordinar contratos, pero no manipular DOM del
 * canvas, Moveable ni Selecto.
 */
import { useForm } from 'form-render';
import React, { useContext, useEffect, useLayoutEffect, useCallback, useMemo, useRef } from 'react';
import type {
  Dict,
  ChangeSchemaItem,
  PropPanelInspectorConfig,
  PropPanelSchema,
  SchemaForUI,
} from '@sisad-pdfme/common';
import { isBlankPdf } from '@sisad-pdfme/common';
import type { SidebarProps } from '../../../../types.js';
import { I18nContext, PluginsRegistry } from '../../../../contexts.js';
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
import { createInspectorConfigurationResolver } from '../../../../../config/InspectorConfigurationResolver.js';
import {
  getSchemaConfigStorageKey,
  getSchemaDesignerConfig,
  mergeSchemaDesignerConfig,
  type SchemaDesignerConfig,
} from '../../../../designerEngine.js';
import { useSisadPdfmeConfig } from '../../../../../react/useSisadPdfmeConfig.js';
import { normalizeSignatureSchema, type SignatureSchema } from '../../../../../schemas/signature/types.js';

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
  const normalizedSchema =
    schema.type === 'signature' || schema.type === 'initials'
      ? (normalizeSignatureSchema(schema as SignatureSchema) as SchemaForUI)
      : schema;
  const values: Record<string, unknown> = { ...normalizedSchema };
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
    size,
    schemas,
    schemasList,
    changeSchemas,
    deselectSchema,
    activeSchema,
    activeElements,
    pageSize,
    basePdf,
    collaborationContext,
    selectionCommands,
  } = props;
  const form = useForm();
  const i18n = useContext(I18nContext);
  const pluginsRegistry = useContext(PluginsRegistry);
  const resolvedConfig = useSisadPdfmeConfig();
  const designerEngine = resolvedConfig.designerEngine;
  const activeSchemaRef = useRef(activeSchema);
  const hydratingFormRef = useRef(false);
  const hydrationKeyRef = useRef<string | null>(null);
  const hydrationClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingWatchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingWatchValuesRef = useRef<Record<string, unknown> | null>(null);
  const inspectorResolver = useMemo(
    () => createInspectorConfigurationResolver(resolvedConfig),
    [resolvedConfig],
  );

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

  useEffect(() => {
    activeSchemaRef.current = activeSchema;
  }, [activeSchema]);

  const schemaConfig = useMemo(
    () => getSchemaDesignerConfig(activeSchema, designerEngine) || null,
    [activeSchema, designerEngine],
  );

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

  const updateSchemaConfig = useCallback(
    (patch: Partial<SchemaDesignerConfig>) => {
      const currentConfig = getSchemaDesignerConfig(activeSchema, designerEngine) || {};
      const nextSchema = mergeSchemaDesignerConfig(activeSchema, patch, designerEngine);
      const storageKey = getSchemaConfigStorageKey(designerEngine);
      const nextConfig = getSchemaDesignerConfig(nextSchema, designerEngine) || {};
      if (JSON.stringify(currentConfig) === JSON.stringify(nextConfig)) return;
      changeSchemas([{ schemaId: activeSchema.id, key: storageKey, value: nextConfig }]);
    },
    [activeSchema, changeSchemas, designerEngine],
  );

  const propPanelProps = useMemo(
    () => ({
      size,
      schemas,
      schemasList,
      pageSize,
      basePdf,
      changeSchemas,
      activeElements,
      deselectSchema,
      activeSchema,
    }),
    [activeElements, activeSchema, basePdf, changeSchemas, deselectSchema, pageSize, schemas, schemasList, size],
  );

  const widgets = useMemo(
    () =>
      buildDetailWidgets({
        pluginsRegistry,
        options: resolvedConfig.config as unknown as import('@sisad-pdfme/common').UIOptions,
        token,
        typedI18n,
        normalizeColorHex,
        props: {
          ...propPanelProps,
          selectionCommands,
          designerEngine,
          schemaConfig,
          updateSchemaConfig,
        },
      }),
    [
      designerEngine,
      normalizeColorHex,
      pluginsRegistry,
      propPanelProps,
      resolvedConfig.config,
      schemaConfig,
      selectionCommands,
      token,
      typedI18n,
      updateSchemaConfig,
    ],
  );

  const hydrationKey = `${activeSchema.id}:${activeSchema.type}`;

  const clearPendingWatchCommit = useCallback(() => {
    if (pendingWatchTimeoutRef.current !== null) {
      clearTimeout(pendingWatchTimeoutRef.current);
      pendingWatchTimeoutRef.current = null;
    }
    pendingWatchValuesRef.current = null;
  }, []);

  useLayoutEffect(() => {
    if (hydrationKeyRef.current === hydrationKey) return;

    hydrationKeyRef.current = hydrationKey;
    hydratingFormRef.current = true;
    clearPendingWatchCommit();

    const values = createHydrationValues(activeSchema);
    if (typeof form.resetFields === 'function') {
      form.resetFields();
    }
    if (typeof form.setValues === 'function') {
      form.setValues(values);
    }

    if (hydrationClearTimeoutRef.current !== null) {
      clearTimeout(hydrationClearTimeoutRef.current);
    }
    hydrationClearTimeoutRef.current = setTimeout(() => {
      hydratingFormRef.current = false;
      hydrationClearTimeoutRef.current = null;
    }, 0);

    return () => {
      if (hydrationClearTimeoutRef.current !== null) {
        clearTimeout(hydrationClearTimeoutRef.current);
        hydrationClearTimeoutRef.current = null;
      }
    };
  }, [activeSchema, clearPendingWatchCommit, form, hydrationKey]);

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

  const commitWatchValues = useCallback(
    (formValues: Record<string, unknown>) => {
      if (hydratingFormRef.current) return;
      const currentSchema = activeSchemaRef.current;
      let changes = buildChangeSet(formValues, currentSchema);
      if (!changes.length) return;

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
    },
    [changeSchemas, form],
  );

  const handleWatch = useCallback(
    (...args: unknown[]) => {
      if (hydratingFormRef.current) return;
      pendingWatchValuesRef.current = asRecord(args[0]) || {};
      if (pendingWatchTimeoutRef.current !== null) {
        clearTimeout(pendingWatchTimeoutRef.current);
      }
      pendingWatchTimeoutRef.current = setTimeout(() => {
        pendingWatchTimeoutRef.current = null;
        const pendingValues = pendingWatchValuesRef.current || {};
        pendingWatchValuesRef.current = null;
        commitWatchValues(pendingValues);
      }, 180);
    },
    [commitWatchValues],
  );

  useEffect(
    () => () => {
      if (hydrationClearTimeoutRef.current !== null) {
        clearTimeout(hydrationClearTimeoutRef.current);
      }
      clearPendingWatchCommit();
    },
    [clearPendingWatchCommit],
  );

  const activePlugin = useMemo(() => {
    const plugin = pluginsRegistry.findByType(activeSchema.type);
    if (!plugin) {
      throw Error(`[@sisad-pdfme/ui] Failed to find plugin used for ${activeSchema.type}`);
    }
    return plugin;
  }, [activeSchema.type, pluginsRegistry]);

  const defaultSchema: Record<string, unknown> = useMemo(
    () => (isRecord(activePlugin?.propPanel?.defaultSchema) ? { ...activePlugin.propPanel.defaultSchema } : {}),
    [activePlugin],
  );

  const pluginProps = useMemo(() => {
    if (typeof activePlugin.propPanel.schema === 'function') {
      const functionResult = activePlugin.propPanel.schema({
        ...propPanelProps,
        options: resolvedConfig.config as unknown as import('@sisad-pdfme/common').UIOptions,
        theme: token,
        i18n: typedI18n,
      });
      if (isRecord(functionResult)) {
        return functionResult as Record<string, PropPanelSchema>;
      }
      return {};
    }

    if (activePlugin.propPanel.schema && typeof activePlugin.propPanel.schema === 'object') {
      return activePlugin.propPanel.schema as Record<string, PropPanelSchema>;
    }

    return {};
  }, [activePlugin, propPanelProps, resolvedConfig.config, token, typedI18n]);

  const inspectorConfig = useMemo(
    () => (activePlugin.propPanel.inspector || undefined) as PropPanelInspectorConfig | undefined,
    [activePlugin],
  );

  const maxWidth = pageSize.width - paddingLeft - paddingRight;
  const maxHeight = pageSize.height - paddingTop - paddingBottom;
  const visibility = inspectorResolver.visibility as SisadPdfmeVisibilityConfig;
  const sections = useMemo(
    () =>
      buildInspectorSections({
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
      }),
    [
      activeSchema,
      defaultSchema,
      inspectorConfig,
      maxHeight,
      maxWidth,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      pageSize,
      pluginProps,
      schemaConfig,
      typedI18n,
      validatePosition,
      validateUniqueSchemaName,
      visibility,
    ],
  );
  // Resetear el estado de colapso solo al cambiar de schema activo, no en cada
  // modificación de campos. Si no, cualquier cambio de input remonta las
  // secciones y borra la interacción del inspector.
  const detailViewResetToken = `${activeSchema.id}:${activeSchema.type}`;

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
 * Comparador personalizado para React.memo basado en referencias estables de
 * props que afectan al inspector visible.
 */
const propsAreUnchanged = (prevProps: DetailViewProps, nextProps: DetailViewProps) =>
  prevProps.activeSchema === nextProps.activeSchema &&
  prevProps.activeElements === nextProps.activeElements &&
  prevProps.schemas === nextProps.schemas &&
  prevProps.schemasList === nextProps.schemasList &&
  prevProps.pageSize === nextProps.pageSize &&
  prevProps.basePdf === nextProps.basePdf &&
  prevProps.changeSchemas === nextProps.changeSchemas &&
  prevProps.deselectSchema === nextProps.deselectSchema &&
  prevProps.collaborationContext === nextProps.collaborationContext &&
  prevProps.size === nextProps.size &&
  prevProps.selectionCommands === nextProps.selectionCommands;

export default React.memo(DetailView, propsAreUnchanged);
