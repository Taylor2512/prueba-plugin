/**
 * DetailView — inspector principal del schema activo.
 *
 * Orquesta hidratación del formulario, validaciones de posición/nombre,
 * construcción de widgets, generación de secciones y emisión de cambios al
 * canvas. Este componente debe coordinar contratos, pero no manipular DOM del
 * canvas, Moveable ni Selecto.
 */
import React, { useContext, useEffect, useLayoutEffect, useCallback, useMemo, useRef, useState } from 'react';
import type {
  Dict,
  ChangeSchemaItem,
  PropPanelInspectorConfig,
  PropPanelSchema,
  SchemaForUI,
} from '@sisad-pdfme/common';
import { isBlankPdf } from '@sisad-pdfme/common';
import type { SidebarProps } from '@sisad-pdfme/ui/types';
import { I18nContext, PluginsRegistry } from '@sisad-pdfme/ui/contexts';
import { theme } from 'antd';
import { InternalNamePath, ValidateErrorEntity } from 'rc-field-form/es/interface.js';
import type { SelectionCommandSet } from '@sisad-pdfme/ui/components/Designer/shared/selectionCommands';
import { asRecord, isRecord } from '@sisad-pdfme/shared/objectGuards';
import type { SisadPdfmeVisibilityConfig } from '@sisad-pdfme/config/SisadPdfmeConfig';
import {
  resolveDesignerSchemaAccessState,
  type SchemaAccessState,
  type SchemaAccessContext,
} from '@sisad-pdfme/ui/components/Designer/shared/accessPolicy';
import { buildInspectorSections, type DetailInspectorSection } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas';
import buildDetailWidgets, { InspectorWidgetParamsProvider } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry';
import DetailViewContent from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent';
import type { SectionFormInstance } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection';
import { createInspectorConfigurationResolver } from '@sisad-pdfme/config/InspectorConfigurationResolver';
import {
  getSchemaConfigStorageKey,
  getSchemaDesignerConfig,
  mergeSchemaDesignerConfig,
  type SchemaDesignerConfig,
} from '@sisad-pdfme/ui/designerEngine';
import { useSisadPdfmeConfig } from '@sisad-pdfme/react/useSisadPdfmeConfig';
import { normalizeSignatureSchema, type SignatureSchema } from '@sisad-pdfme/schemas/signature/types';

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
 * Cambios particionados por política de commit.
 *
 * Los controles discretos (switches, selects) se persisten al instante; solo
 * los campos de escritura continua pasan por debounce.
 */
type PartitionedChanges = {
  /** Commit inmediato, una sola escritura por interacción. */
  immediate: ChangeSchemaItem[];
  /** Commit con debounce y validación de formulario. */
  deferred: ChangeSchemaItem[];
};

/**
 * Compara valores de formulario contra el schema actual y genera cambios.
 *
 * @param nextValues Valores actuales del formulario.
 * @param currentSchema Schema activo contra el que se calcula el diff.
 * @param immediateKeys Campos del formulario con `commitMode: 'immediate'`.
 * @param touchedKeys Campos que el usuario editó en esta interacción. Sin este
 *   filtro, una edición de `width` reescribe también la `position` que el
 *   formulario tenga cargada, revirtiendo un arrastre hecho en el canvas.
 */
const buildChangeSet = (
  nextValues: Record<string, unknown>,
  currentSchema: SchemaForUI,
  immediateKeys: ReadonlySet<string> = new Set(),
  touchedKeys?: ReadonlySet<string>,
): PartitionedChanges => {
  const ignoredKeys = new Set(['id', 'content']);
  const nullableKeys = new Set(['rotate', 'opacity']);
  const partitioned: PartitionedChanges = { immediate: [], deferred: [] };
  const currentValues = asRecord(currentSchema) || {};

  const valuesDiffer = (formValue: unknown, schemaValue: unknown): boolean => {
    if (typeof formValue === 'object' && formValue !== null) {
      return JSON.stringify(formValue) !== JSON.stringify(schemaValue);
    }
    return formValue !== schemaValue;
  };

  for (const key in nextValues) {
    if (ignoredKeys.has(key)) continue;
    if (touchedKeys && !touchedKeys.has(key)) continue;

    let value = nextValues[key];
    if (!valuesDiffer(value, currentValues[key])) continue;

    if (value === null && nullableKeys.has(key)) {
      value = undefined;
    }

    // El bucket se decide por la clave del formulario, no por la del schema:
    // `editable` es un switch aunque escriba `readOnly`.
    const bucket = immediateKeys.has(key) ? partitioned.immediate : partitioned.deferred;

    if (key === 'editable') {
      const readOnlyValue = !value;
      bucket.push({ key: 'readOnly', value: readOnlyValue, schemaId: currentSchema.id });
      if (readOnlyValue) {
        bucket.push({ key: 'required', value: false, schemaId: currentSchema.id });
      }
      continue;
    }

    bucket.push({ key, value, schemaId: currentSchema.id });
  }

  return partitioned;
};

/**
 * Recolecta las claves de formulario que deben commitearse sin debounce.
 *
 * Un switch o un select producen un valor final por interacción: esperar 180 ms
 * y revalidar el formulario entero solo añade rebote y commits duplicados.
 */
const collectImmediateCommitKeys = (sections: DetailInspectorSection[]): Set<string> => {
  const keys = new Set<string>();

  for (const section of sections) {
    const properties = asRecord(asRecord(section.schema)?.properties) || {};
    for (const [fieldKey, rawField] of Object.entries(properties)) {
      const field = asRecord(rawField);
      if (!field) continue;
      const widget = String(field.widget || '').trim().toLowerCase();
      const isBoolean = field.type === 'boolean' || widget === 'switch' || widget === 'checkbox';
      const isDiscreteChoice =
        widget === 'select' || widget === 'radio' || widget === 'nativecolor' || widget === 'buttongroup';
      if (isBoolean || isDiscreteChoice) keys.add(fieldKey);
    }
  }

  return keys;
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
  const i18n = useContext(I18nContext);
  const pluginsRegistry = useContext(PluginsRegistry);
  const resolvedConfig = useSisadPdfmeConfig();
  const designerEngine = resolvedConfig.designerEngine;
  const activeSchemaRef = useRef(activeSchema);
  const hydratingFormRef = useRef(false);
  const hydrationKeyRef = useRef<string | null>(null);
  const hydrationClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Identifica la hidratación vigente para liberar la bandera sin cancelarla. */
  const hydrationTokenRef = useRef(0);
  const pendingWatchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingWatchValuesRef = useRef<Record<string, unknown> | null>(null);
  /** Formulario de la sección que emitió el último cambio diferido. */
  const pendingWatchFormRef = useRef<SectionFormInstance | null>(null);
  /** Claves tocadas por el usuario durante el debounce en curso. */
  const pendingWatchKeysRef = useRef<Set<string> | null>(null);
  /** Claves con `commitMode: 'immediate'`, derivadas de las secciones activas. */
  const immediateCommitKeysRef = useRef<Set<string>>(new Set());
  const inspectorResolver = useMemo(
    () => createInspectorConfigurationResolver(resolvedConfig),
    [resolvedConfig],
  );

  const runtimeReadonly = resolvedConfig.config?.runtime?.readonly === true;

  // El contexto debe hablar el idioma de `SchemaAccessContext`. Antes se pasaban
  // `actorId`/`isGlobalView`, campos que el resolver no lee, de modo que el
  // inspector resolvía el acceso sin actor: cualquier candado —incluido el
  // propio— se interpretaba como candado ajeno.
  const accessContext = useMemo<SchemaAccessContext>(
    () => ({
      activeActorId: collaborationContext?.actorId || undefined,
      collaborationContext: collaborationContext
        ? {
            isCollaborative: true,
            userId: collaborationContext.actorId || '',
            canEditStructure: collaborationContext.canEditStructure ?? true,
          }
        : undefined,
      canEditStructure: collaborationContext?.canEditStructure ?? true,
      runtimeReadonly,
    }),
    [collaborationContext, runtimeReadonly],
  );

  const accessState = useMemo<SchemaAccessState>(
    () => resolveDesignerSchemaAccessState(activeSchema, accessContext),
    [activeSchema, accessContext],
  );
  const selectionCount = Array.isArray(activeElements) ? activeElements.length : 0;

  // Solo el permiso estructural congela el inspector. Usar `isEditable` incluía
  // `schema.readOnly`, así que activar "Solo lectura" deshabilitaba el propio
  // switch que lo activó y dejaba el campo sin forma de revertirlo.
  const isReadOnly = useMemo(() => !accessState.canEditStructure, [accessState]);

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

  // Lo que los widgets leen en cada render viaja por contexto, no por closure.
  const widgetParams = useMemo(
    () => ({
      pluginsRegistry,
      options: resolvedConfig.config as unknown as import('@sisad-pdfme/common').UIOptions,
      token,
      typedI18n,
      normalizeColorHex,
      accessState,
      props: {
        ...propPanelProps,
        selectionCommands,
        designerEngine,
        schemaConfig,
        updateSchemaConfig,
      },
    }),
    [
      accessState,
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

  // El registro se memoiza por tipo de schema, no por valor: form-render usa
  // cada entrada como tipo de componente, así que recrearlas en cada commit
  // desmontaba el control recién tocado (el switch perdía foco y "rebotaba").
  const widgets = useMemo(
    () => buildDetailWidgets({ pluginsRegistry, activeSchemaType: activeSchema.type }),
    [activeSchema.type, pluginsRegistry],
  );

  const hydrationKey = `${activeSchema.id}:${activeSchema.type}`;

  const clearPendingWatchCommit = useCallback(() => {
    if (pendingWatchTimeoutRef.current !== null) {
      clearTimeout(pendingWatchTimeoutRef.current);
      pendingWatchTimeoutRef.current = null;
    }
    pendingWatchValuesRef.current = null;
    pendingWatchKeysRef.current = null;
  }, []);

  // Snapshot de hidratación: cambia de identidad cuando cambian los valores del
  // schema activo, venga el cambio del inspector o de fuera (arrastre, resize,
  // rotación, alineación, undo/redo, edición programática). Sin esto el
  // formulario conserva valores obsoletos y los reescribe en la siguiente
  // edición, revirtiendo lo hecho en el canvas.
  //
  // No comparte clave con `hydrationKey`: esa marca el cambio de *selección* y
  // arrastra efectos (cancelar commits en vuelo, marcar el form como hidratando)
  // que no deben dispararse en cada cambio de valor. Que la rehidratación no
  // pise al usuario mientras escribe lo resuelve la sección, que conoce su foco.
  const hydrationCandidate = useMemo(() => createHydrationValues(activeSchema), [activeSchema]);
  const hydrationSignature = useMemo(() => {
    // `content` queda fuera de la firma: en imágenes y firmas es un data URI de
    // cientos de KB y esto se recalcula en cada render del designer. Ningún
    // control del inspector lo edita (está en `ignoredKeys` del changeset), así
    // que no perderse sus cambios no afecta a la sincronización.
    const { content: _content, ...signatureValues } = hydrationCandidate;
    return `${hydrationKey}:${JSON.stringify(signatureValues)}`;
  }, [hydrationCandidate, hydrationKey]);
  const [hydrationSnapshot, setHydrationSnapshot] = useState(() => ({
    key: hydrationSignature,
    values: hydrationCandidate,
  }));
  if (hydrationSnapshot.key !== hydrationSignature) {
    setHydrationSnapshot({ key: hydrationSignature, values: hydrationCandidate });
  }
  const hydrationValues = hydrationSnapshot.values;

  useLayoutEffect(() => {
    if (hydrationKeyRef.current === hydrationKey) return;

    hydrationKeyRef.current = hydrationKey;
    hydratingFormRef.current = true;
    clearPendingWatchCommit();

    // La bandera se libera por token, no por cleanup: el efecto depende de
    // `activeSchema`, que cambia de identidad en cada render del designer. Con
    // un cleanup que cancelaba el timeout, bastaba un re-render entre la
    // hidratación y su liberación para dejar `hydratingFormRef` en `true` de
    // forma permanente — y con ella el inspector entero dejaba de persistir
    // cambios, porque `handleWatch` retornaba siempre.
    hydrationTokenRef.current += 1;
    const hydrationToken = hydrationTokenRef.current;
    if (hydrationClearTimeoutRef.current !== null) {
      clearTimeout(hydrationClearTimeoutRef.current);
    }
    hydrationClearTimeoutRef.current = setTimeout(() => {
      hydrationClearTimeoutRef.current = null;
      // Solo la hidratación más reciente libera la bandera.
      if (hydrationTokenRef.current === hydrationToken) {
        hydratingFormRef.current = false;
      }
    }, 0);
  }, [activeSchema, clearPendingWatchCommit, hydrationKey]);

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

  // Los límites se validan contra el schema activo fusionado con lo último que
  // el usuario escribió: cada sección tiene su propio formulario, así que
  // ninguna instancia conoce por sí sola x/y/width/height a la vez.
  const positionBounds = useMemo<PositionBounds>(
    () => ({
      pageWidth: pageSize.width,
      pageHeight: pageSize.height,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    }),
    [pageSize.width, pageSize.height, paddingTop, paddingRight, paddingBottom, paddingLeft],
  );

  // Los límites se comprueban contra el schema activo. Antes se leían de
  // `form.getValues()` del formulario compartido, que nunca recibía valores: el
  // validador salía por el early return y no comprobaba nada.
  const validatePosition = useCallback(
    (rule: unknown, value: number, fieldName: PositionFieldName) =>
      createPositionValidator(() => asRecord(activeSchema) || {}, positionBounds)(rule, value, fieldName),
    [activeSchema, positionBounds],
  );

  const commitWatchValues = useCallback(
    (
      formValues: Record<string, unknown>,
      sectionForm: SectionFormInstance,
      touchedKeys: ReadonlySet<string>,
    ) => {
      if (hydratingFormRef.current) return;
      const currentSchema = activeSchemaRef.current;
      // Las claves inmediatas nunca viajan por esta ruta: ya se persistieron en
      // `handleWatch`. Excluirlas garantiza una sola escritura por interacción
      // aunque el schema todavía no haya vuelto por props.
      let { deferred: changes } = buildChangeSet(
        formValues,
        currentSchema,
        immediateCommitKeysRef.current,
        touchedKeys,
      );
      if (!changes.length) return;

      // Se valida el formulario de la sección que emitió el cambio: es el único
      // que conoce las reglas de sus campos.
      if (typeof sectionForm?.validateFields !== 'function') {
        changeSchemas(changes);
        return;
      }

      sectionForm
        .validateFields()
        .then(() => changeSchemas(changes))
        .catch((reason: ValidateErrorEntity) => {
          if (reason?.errorFields?.length) {
            changes = filterInvalidChanges(changes, reason);
          }
          if (changes.length) {
            changeSchemas(changes);
          }
        });
    },
    [changeSchemas],
  );

  const handleWatch = useCallback(
    (values: Record<string, unknown>, sectionForm: SectionFormInstance, touchedKeys: ReadonlySet<string>) => {
      if (hydratingFormRef.current) return;
      const nextValues = asRecord(values) || {};
      const currentSchema = activeSchemaRef.current;
      const { immediate } = buildChangeSet(
        nextValues,
        currentSchema,
        immediateCommitKeysRef.current,
        touchedKeys,
      );

      // Controles discretos: un clic → una persistencia, sin debounce y sin
      // revalidar el formulario entero (un switch no tiene reglas propias).
      if (immediate.length) {
        changeSchemas(immediate);
      }

      pendingWatchValuesRef.current = nextValues;
      pendingWatchFormRef.current = sectionForm;
      // El debounce agrupa varias pulsaciones: se acumulan las claves tocadas
      // en todas ellas, o el commit final solo vería la última.
      const accumulatedKeys = pendingWatchKeysRef.current || new Set<string>();
      touchedKeys.forEach((key) => accumulatedKeys.add(key));
      pendingWatchKeysRef.current = accumulatedKeys;
      if (pendingWatchTimeoutRef.current !== null) {
        clearTimeout(pendingWatchTimeoutRef.current);
      }
      pendingWatchTimeoutRef.current = setTimeout(() => {
        pendingWatchTimeoutRef.current = null;
        const pendingValues = pendingWatchValuesRef.current || {};
        const pendingForm = pendingWatchFormRef.current;
        const pendingKeys = pendingWatchKeysRef.current || new Set<string>();
        pendingWatchValuesRef.current = null;
        pendingWatchFormRef.current = null;
        pendingWatchKeysRef.current = null;
        commitWatchValues(pendingValues, pendingForm as SectionFormInstance, pendingKeys);
      }, 180);
    },
    [changeSchemas, commitWatchValues],
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

  const defaultSchema: Record<string, unknown> = useMemo(() => {
    // Ensure the inspector always receives a full SchemaForUI baseline.
    try {
      // Import at runtime to avoid top-level cycles.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { normalizePluginDefaultSchema } = require('@sisad-pdfme/schemas/normalizers');
      return normalizePluginDefaultSchema(activePlugin as any, activeSchema.type);
    } catch (e) {
      return isRecord(activePlugin?.propPanel?.defaultSchema) ? { ...activePlugin.propPanel.defaultSchema } : {};
    }
  }, [activePlugin, activeSchema.type]);

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
  useEffect(() => {
    immediateCommitKeysRef.current = collectImmediateCommitKeys(sections);
  }, [sections]);

  // Resetear el estado de colapso solo al cambiar de schema activo, no en cada
  // modificación de campos. Si no, cualquier cambio de input remonta las
  // secciones y borra la interacción del inspector.
  const detailViewResetToken = `${activeSchema.id}:${activeSchema.type}`;

  return (
    <InspectorWidgetParamsProvider value={widgetParams}>
      <DetailViewContent
        activeSchema={activeSchema}
        resetToken={detailViewResetToken}
        schemaConfig={schemaConfig}
        selectionCount={selectionCount}
        deselectSchema={deselectSchema}
        hydrationValues={hydrationValues}
        sections={sections}
        widgets={widgets}
        watchHandler={handleWatch}
        readOnly={isReadOnly}
        accessState={accessState}
        collaborationContext={collaborationContext}
      />
    </InspectorWidgetParamsProvider>
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
