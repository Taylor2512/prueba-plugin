/**
 * SchemaConnectionsWidget — inspector widget for schema data/runtime connections.
 *
 * This component centralizes the DetailView UI used to configure three runtime
 * concerns for a selected schema:
 *
 * - persistence: how the value is stored locally/remotely;
 * - form JSON output: how the value is collected into an output payload;
 * - API connection: how values/options/states can be read from or submitted to
 *   an endpoint using the designer engine HTTP/runtime adapter.
 *
 * Architectural boundary:
 *
 * - the widget only edits `SchemaDesignerConfig` through `updateSchemaConfig`;
 * - it does not mutate schemas directly;
 * - it does not know Canvas, Moveable, Selecto or document geometry;
 * - shared pair editors and section headers live in `SchemaConnectionsShared`;
 * - validation rules live in `schemaConnectionsValidation`.
 */
import { useCallback, useMemo, useState } from 'react';
import type { PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import { Button, Collapse, Divider, Input, InputNumber, Space, Tag } from 'antd';
import { DatabaseZap, Globe2, FileJson2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import {
  createSchemaDataRuntimeAdapter,
  resolveDesignerHttpClientConfig,
  type DesignerEngine,
  type SchemaDesignerConfig,
  type SchemaHttpAuthConfig,
  type SchemaHttpClientConfig,
  type SchemaFormJsonConfig,
  type SchemaPersistenceConfig,
} from '@sisad-pdfme/ui/designerEngine';
import { PairEditor, SectionHeader, SCHEMA_CONFIG_COLLAPSE, SCHEMA_CONFIG_NESTED_COLLAPSE } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared';
import { getMissingConnectionFields } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation';
import CompactConfigPanel from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel';
import { BooleanSwitchWidget } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives';
import FormSelect from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/FormSelect';

/**
 * Props injected into the schema connections widget by DetailView.
 *
 * `PropPanelWidgetProps` provides the standard pdfme prop-panel contract,
 * while the extra fields connect this widget to SISAD's designer engine
 * metadata model.
 */
type ConfigWidgetProps = PropPanelWidgetProps & {
  /**
   * Current designer-level configuration resolved for the active schema.
   *
   * It may be null when the schema has no saved runtime metadata yet.
   */
  schemaConfig?: SchemaDesignerConfig | null;

  /**
   * Optional engine that provides global runtime settings, HTTP inheritance,
   * recipient/color extensions and data adapters.
   */
  designerEngine?: DesignerEngine;

  /**
   * Persists a partial patch into the active schema's designer config.
   *
   * The parent DetailView owns the actual `changeSchemas` call, so this widget
   * stays declarative and focused on configuration UI.
   */
  updateSchemaConfig?: (_patch: Partial<SchemaDesignerConfig>) => void;
};

// Shared UI moved to SchemaConnectionsShared.tsx to keep this widget focused.

/**
 * Builds a compact status tag describing the effective authentication mode.
 *
 * Manual authentication is highlighted as warning because it usually requires
 * the user to complete token/header/credential fields. Inherited authentication
 * is neutral because it comes from the global designer engine configuration.
 */
const buildAuthTag = (resolvedHttpClient: ReturnType<typeof resolveDesignerHttpClientConfig>) => {
  if (!resolvedHttpClient) return null;

  if (resolvedHttpClient.auth?.mode === 'manual') {
    const authType =
      (resolvedHttpClient.auth.type || 'manual') === 'basic'
        ? 'básica'
        : (resolvedHttpClient.auth.type || 'manual') === 'apiKey'
          ? 'clave API'
          : (resolvedHttpClient.auth.type || 'manual') === 'custom'
            ? 'personalizada'
            : 'manual';
    return { label: `Autenticación ${authType}`, color: 'warning' as const };
  }

  return { label: 'Autenticación heredada', color: 'default' as const };
};

/**
 * Converts the local validation state into an Ant Design-compatible status tag.
 *
 * `idle` intentionally returns null so the compact summary does not show a
 * validation badge before the user runs validation.
 */
const buildValidationTag = (validationState: 'idle' | 'ok' | 'warning') => {
  if (validationState === 'ok') {
    return { label: 'Validación OK', color: 'success' as const };
  }

  if (validationState === 'warning') {
    return { label: 'Validación parcial', color: 'warning' as const };
  }

  return null;
};

/**
 * Formats a boolean flag for compact Spanish summaries.
 */
const describeBoolean = (value?: boolean) => (value ? 'Sí' : 'No');

/**
 * Produces the one-line summary shown for the Persistence section.
 *
 * The output is intentionally compact because it is rendered inside a small
 * inspector panel before the user opens the full modal.
 */
const describePersistence = (persistence: SchemaPersistenceConfig) => {
  if (!persistence.enabled) return 'Inactiva';
  return [
    persistence.mode || 'local',
    persistence.key ? `clave=${persistence.key}` : 'sin clave',
    `ocultos ${describeBoolean(Boolean(persistence.includeHidden))}`,
    `meta ${describeBoolean(Boolean(persistence.includeMeta))}`,
  ].join(' · ');
};

/**
 * Produces the one-line summary shown for the Form JSON output section.
 */
const describeFormJson = (formJson: SchemaFormJsonConfig) => {
  if (!formJson.enabled) return 'Inactivo';
  return [
    formJson.format || 'nested',
    formJson.rootKey ? `raíz=${formJson.rootKey}` : 'sin raíz',
    `vacíos ${describeBoolean(Boolean(formJson.includeEmpty))}`,
    `ocultos ${describeBoolean(Boolean(formJson.includeHidden))}`,
  ].join(' · ');
};

/**
 * Describes the effective HTTP authentication configuration in human terms.
 *
 * This function avoids exposing secrets; it only shows the auth mode, auth type,
 * username/header presence and whether the system configuration is inherited.
 */
const describeHttpAuth = (auth?: SchemaHttpAuthConfig) => {
  if (auth?.mode !== 'manual') return 'Autenticación heredada';
  if ((auth.type || 'bearer') === 'basic') {
    const username = auth.username ? `usuario=${auth.username}` : 'sin credenciales';
    return `básica · ${username}`;
  }
  const header = auth.headerName ? `encabezado=${auth.headerName}` : 'sin encabezado';
  if ((auth.type || 'bearer') === 'apiKey') {
    return `clave API · ${header}`;
  }
  if ((auth.type || 'bearer') === 'custom') {
    return `personalizada · ${header}`;
  }
  return `portador · ${header}`;
};

/**
 * Maps internal validation keys to labels understandable by users.
 */
const CONNECTION_FIELD_LABELS: Record<string, string> = {
  storageKey: 'clave de almacenamiento',
  rootKey: 'raíz JSON',
  endpoint: 'endpoint',
  baseURL: 'URL base',
  auth: 'autenticación manual',
};

/**
 * Formats missing validation keys as a comma-separated Spanish message.
 */
const formatMissingConnectionFields = (missing: string[]) =>
  missing.map((field) => CONNECTION_FIELD_LABELS[field] || field).join(', ');

/**
 * Produces the one-line summary shown for the API connection section.
 *
 * It combines request method, endpoint, Axios inheritance/local mode and the
 * effective authentication description.
 */
const describeApi = (
  api: NonNullable<SchemaDesignerConfig['api']>,
  resolvedHttpClient: ReturnType<typeof resolveDesignerHttpClientConfig>,
) => {
  if (!api.enabled) return 'Inactiva';
  return [
    api.method || 'GET',
    api.endpoint || 'sin endpoint',
    resolvedHttpClient?.inheritSystem === false ? 'Cliente local' : 'Cliente del host',
    describeHttpAuth(resolvedHttpClient?.auth),
  ].join(' · ');
};

/**
 * Creates a safe manual-auth configuration when the user changes auth type.
 *
 * Each preset keeps compatible existing values and clears fields that do not
 * apply to the selected mode, preventing stale bearer/basic/api-key data from
 * leaking across auth modes.
 */
const applyAuthPreset = (
  type: SchemaHttpAuthConfig['type'] | undefined,
  current: SchemaHttpAuthConfig | undefined,
): SchemaHttpAuthConfig => {
  const nextType = type || 'bearer';

  if (nextType === 'basic') {
    return {
      ...current,
      mode: 'manual',
      type: nextType,
      headerName: current?.headerName || 'Autorización',
      token: '',
      headerValue: undefined,
      username: current?.username || '',
      password: current?.password || '',
    };
  }

  if (nextType === 'apiKey') {
    return {
      ...current,
      mode: 'manual',
      type: nextType,
      headerName: current?.headerName || 'X-API-Key',
      headerValue: current?.headerValue || current?.token || '',
      token: undefined,
      username: undefined,
      password: undefined,
    };
  }

  if (nextType === 'custom') {
    return {
      ...current,
      mode: 'manual',
      type: nextType,
      headerName: current?.headerName || 'Autorización',
      headerValue: current?.headerValue || current?.token || '',
      token: undefined,
      username: undefined,
      password: undefined,
    };
  }

  return {
    ...current,
    mode: 'manual',
    type: nextType,
    headerName: current?.headerName || 'Autorización',
    token: current?.token || current?.headerValue || '',
    headerValue: undefined,
    username: undefined,
    password: undefined,
  };
};

/**
 * Shallow-merges a config section patch while preserving unmodified keys.
 *
 * The cast keeps generic section types ergonomic for persistence/api/form
 * config updates without forcing each caller to rebuild the whole section.
 */
const mergeSectionPatch = <T extends Record<string, unknown>>(base: T | undefined, patch: Partial<T>): T =>
  ({
    ...(base || {}),
    ...patch,
  } as T);

const WIDGET_ROOT = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-widget',
  'flex min-h-0 flex-col gap-1.5 rounded-[0.95rem] border border-slate-200/70 bg-white/96 p-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
);

const SUMMARY_ROW = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-summary-row',
  'flex flex-wrap items-center gap-1',
);

const SUMMARY_TAG = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-summary-tag',
  'm-0 inline-flex h-5 max-w-full items-center rounded-full border border-slate-200/70 bg-white px-1.5 text-[10px] leading-none shadow-none',
);

const SUMMARY = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-summary',
  'relative overflow-hidden rounded-lg border border-slate-200/70 bg-slate-50/80 px-2 py-1 pl-2.5',
);

const SUMMARY_TEXT = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-summary-text',
  'text-[0.6875rem] leading-[1.35] text-slate-600',
);

const SWITCH_ROW = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-switch-row',
  'flex min-h-7 items-center justify-between gap-2 rounded-lg border border-slate-200/70 bg-white/90 px-2 py-1 text-[0.75rem] text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50',
);

const GRID_2 = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-grid-2',
  'grid grid-cols-2 gap-1 max-[820px]:grid-cols-1',
);

const FIELD = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-field',
  'flex min-w-0 flex-col gap-0.5 text-[0.6875rem] text-slate-500 [&_.ant-select-selector]:min-h-[2rem] [&_.ant-select-selector]:rounded-md [&_.ant-select-selector]:border-slate-200 [&_.ant-select-selector]:bg-white [&_.ant-select-selector]:text-[0.6875rem] [&_.ant-select-selector]:shadow-none',
);

const FIELD_LABEL = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-field-label',
  'inline-flex min-h-3.5 items-center font-medium text-slate-500',
);

const INLINE_CHECKS = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-inline-checks',
  'flex flex-wrap gap-x-1 gap-y-1',
);

const INLINE_CHECK = 'inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white px-1.5 py-[0.125rem] text-[0.6875rem] text-slate-700';

const DIVIDER = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-divider',
  'my-1.5 border-slate-200/70',
);

const NUMBER_INPUT = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-number',
  'h-8 rounded-md border border-slate-200/80 bg-white text-[0.71875rem] shadow-none',
);

/**
 * DetailView widget for configuring data/runtime connections of a schema.
 *
 * Render model:
 *
 * - compact `CompactConfigPanel` summary in the inspector;
 * - modal with three collapsible groups: Persistence, JSON output and API;
 * - validation action that checks required fields and optionally performs a
 *   runtime request through `createSchemaDataRuntimeAdapter`.
 */
const SchemaConnectionsWidget = (props: ConfigWidgetProps) => {
  const { schemaConfig, designerEngine, updateSchemaConfig } = props;

  /**
   * Local validation state for the compact panel and modal summary.
   *
   * It is intentionally local because validation is an inspector aid, not a
   * persisted schema property.
   */
  const [validationState, setValidationState] = useState<'idle' | 'ok' | 'warning'>('idle');
  const [validationMessage, setValidationMessage] = useState('Sin configurar');
  const [isValidating, setIsValidating] = useState(false);
  /**
   * Effective persistence configuration for the active schema.
   */
  const persistence = useMemo<SchemaPersistenceConfig>(() => schemaConfig?.persistence || {}, [schemaConfig?.persistence]);
  /**
   * Effective API configuration for the active schema.
   */
  const api = useMemo(() => schemaConfig?.api || {}, [schemaConfig?.api]);
  /**
   * Effective Form JSON output configuration for the active schema.
   */
  const formJson = useMemo<SchemaFormJsonConfig>(() => schemaConfig?.form || {}, [schemaConfig?.form]);
  /**
   * Effective HTTP client after applying designer engine inheritance rules.
   */
  const resolvedHttpClient = useMemo(
    () => resolveDesignerHttpClientConfig(schemaConfig || undefined, designerEngine),
    [designerEngine, schemaConfig],
  );
  /**
   * Runtime adapter used only by the validation action to resolve/execute a
   * synthetic request without coupling this UI to fetch/Axios directly.
   */
  const runtimeAdapter = useMemo(
    () =>
      createSchemaDataRuntimeAdapter({
        engine: designerEngine,
        fetchImpl: typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined,
      }),
    [designerEngine],
  );
  const authTag = useMemo(() => buildAuthTag(resolvedHttpClient), [resolvedHttpClient]);
  /**
   * Compact status tags shown above the full configuration form.
   */
  const runtimeStatusTags = useMemo(
    () =>
      [
        persistence.enabled ? { label: `Persistencia ${persistence.mode || 'local'}`, color: 'success' as const } : null,
        formJson.enabled ? { label: `JSON ${formJson.format || 'nested'}`, color: 'gold' as const } : null,
        api.enabled
          ? { label: api.endpoint ? 'API activa' : 'API sin endpoint', color: api.endpoint ? 'processing' : 'warning' as const }
          : null,
        resolvedHttpClient ? { label: resolvedHttpClient.inheritSystem ? 'Cliente del host' : 'Cliente local', color: 'blue' as const } : null,
        authTag,
      ].filter(Boolean) as Array<{ label: string; color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' }>,
    [api.enabled, api.endpoint, authTag, formJson.enabled, formJson.format, persistence.enabled, persistence.mode, resolvedHttpClient],
  );

  /**
   * Patches the persistence section while preserving its existing keys.
   */
  const updatePersistence = useCallback(
    (patch: Partial<SchemaPersistenceConfig>) => {
      updateSchemaConfig?.({
        persistence: mergeSectionPatch(persistence, patch),
      });
    },
    [persistence, updateSchemaConfig],
  );

  /**
   * Patches the API section while preserving its existing keys.
   */
  const updateApi = useCallback(
    (patch: Partial<NonNullable<SchemaDesignerConfig['api']>>) => {
      updateSchemaConfig?.({
        api: mergeSectionPatch(api, patch),
      });
    },
    [api, updateSchemaConfig],
  );

  /**
   * Patches the nested API HTTP-client configuration.
   */
  const updateApiHttp = useCallback(
    (patch: Partial<SchemaHttpClientConfig>) => {
      updateApi({
        http: mergeSectionPatch(api.http, patch),
      });
    },
    [api.http, updateApi],
  );

  /**
   * Patches the nested manual/inherited authentication configuration.
   */
  const updateApiAuth = useCallback(
    (patch: Partial<SchemaHttpAuthConfig>) => {
      updateApiHttp({
        auth: mergeSectionPatch(api.http?.auth, patch),
      });
    },
    [api.http?.auth, updateApiHttp],
  );

  /**
   * Switches between inherited system authentication and manual auth.
   *
   * When moving to manual mode, it applies a preset so required fields exist
   * for the selected auth type.
   */
  const updateApiAuthMode = useCallback(
    (mode: 'inherit' | 'manual') => {
      if (mode === 'inherit') {
        updateApiHttp({
          auth: {
            ...api.http?.auth,
            mode: 'inherit',
          },
        });
        return;
      }

      updateApiHttp({
        auth: applyAuthPreset(api.http?.auth?.type || 'bearer', {
          ...api.http?.auth,
          mode: 'manual',
        }),
      });
    },
    [api.http?.auth, updateApiHttp],
  );

  /**
   * Changes the manual authentication type and normalizes compatible fields.
   */
  const updateApiAuthType = useCallback(
    (type: SchemaHttpAuthConfig['type']) => {
      updateApiHttp({
        auth: applyAuthPreset(type, api.http?.auth),
      });
    },
    [api.http?.auth, updateApiHttp],
  );

  /**
   * Patches the Form JSON output section while preserving existing keys.
   */
  const updateFormJson = useCallback(
    (patch: Partial<SchemaFormJsonConfig>) => {
      updateSchemaConfig?.({
        form: mergeSectionPatch(formJson, patch),
      });
    },
    [formJson, updateSchemaConfig],
  );

  /**
   * Validates the current connection configuration.
   *
   * Validation has two levels:
   *
   * 1. static required-field validation through `getMissingConnectionFields`;
   * 2. optional runtime API validation by resolving a synthetic request and
   *    executing it through the schema data runtime adapter.
   */
  const handleValidateConfig = () => {
    const enabledSections = [persistence.enabled, formJson.enabled, api.enabled].filter(Boolean).length;
    if (enabledSections === 0) {
      setValidationState('warning');
      setValidationMessage('Activa persistencia, salida JSON o API para empezar a configurar este bloque.');
      return;
    }

    const missing = getMissingConnectionFields(persistence, api, formJson, resolvedHttpClient);

    if (missing.length > 0) {
      setValidationState('warning');
      setValidationMessage(`Completa: ${formatMissingConnectionFields(missing)}.`);
      return;
    }

    if (!api.enabled) {
      setValidationState('ok');
      setValidationMessage('La configuración local está lista. Activa API si quieres probar una conexión remota.');
      return;
    }

    const validationSchema: SchemaForUI = {
      id: 'schema-connections-validation',
      name: schemaConfig?.identity?.key || 'schemaConnections',
      type: 'text',
    } as SchemaForUI;
    const validationField = { schema: validationSchema, config: schemaConfig || null };
    const snapshot = {
      pageIndex: 0,
      totalPages: 1,
      unitIndex: 0,
      currentInput: {},
      fields: [validationField],
    };
    const request = runtimeAdapter.resolveRequest(validationField, snapshot);

    if (!request) {
      setValidationState('warning');
      setValidationMessage('No se pudo resolver la petición con la configuración actual.');
      return;
    }

    setValidationState('idle');
    setIsValidating(true);
    setValidationMessage('Validando conexión...');
    void runtimeAdapter
      .executeRequest(request)
      .then(() => {
        setValidationState('ok');
        setValidationMessage('La conexión respondió correctamente.');
      })
      .catch((error) => {
        setValidationState('warning');
        setValidationMessage(`Validación fallida: ${error instanceof Error ? error.message : 'error desconocido'}`);
      })
      .finally(() => {
        setIsValidating(false);
      });
  };

  /**
   * Derived validation tag used in the compact panel.
   */
  const validationTag = useMemo(() => buildValidationTag(validationState), [validationState]);
  /**
   * Overall compact state tag for the inspector card.
   */
  const compactStateTag = useMemo(() => {
    if (validationState === 'warning') {
      return { label: 'Error', color: 'warning' as const };
    }

    if (persistence.enabled || formJson.enabled || api.enabled) {
      return { label: 'Activo', color: 'success' as const };
    }

    return { label: 'Sin configurar', color: 'default' as const };
  }, [api.enabled, formJson.enabled, persistence.enabled, validationState]);
  const persistenceSummary = describePersistence(persistence);
  const formJsonSummary = describeFormJson(formJson);
  const apiSummary = describeApi(api, resolvedHttpClient);

  /**
   * Collapse items that make up the full modal configuration form.
   *
   * Each item owns one runtime concern and delegates repeated key/value editing
   * to `PairEditor`.
   */
  const items = [
    {
      key: 'persistence',
      label: (
        <SectionHeader
          icon={<DatabaseZap size={14} />}
          title="Persistencia"
          active={Boolean(persistence.enabled)}
          description="Guarda el valor capturado."
        />
      ),
      children: (
        <Space direction="vertical" size={8} className="w-full">
          <div className={SUMMARY}>
            <div className={SUMMARY_TEXT}>{persistenceSummary}</div>
          </div>
          <div className={SWITCH_ROW}>
            <span className="font-semibold text-slate-700">Persistir valor</span>
            <BooleanSwitchWidget value={persistence.enabled} onChange={(checked) => updatePersistence({ enabled: checked })} />
          </div>
          <Collapse
            ghost
            className={SCHEMA_CONFIG_NESTED_COLLAPSE}
            defaultActiveKey={[]}
            items={[
              {
                key: 'persistence-basic',
                label: 'Opciones básicas',
                children: (
                  <div className={GRID_2}>
                    <div className={FIELD}>
                      <span className={FIELD_LABEL}>Modo</span>
                      <FormSelect
                        id="connections-persistence-mode"
                        name="connections-persistence-mode"
                        value={persistence.mode || 'local'}
                        onChange={(value) => updatePersistence({ mode: value as SchemaPersistenceConfig['mode'] })}
                        options={[
                          { label: 'Local', value: 'local' },
                          { label: 'Remoto', value: 'remote' },
                          { label: 'Híbrido', value: 'hybrid' },
                        ]}
                      />
                    </div>
                    <div className={FIELD}>
                      <span className={FIELD_LABEL}>Clave de almacenamiento</span>
                      <Input
                        id="connections-persistence-key"
                        name="connections-persistence-key"
                        size="small"
                        value={persistence.key || ''}
                        placeholder="campo.identificador"
                        onChange={(event) => updatePersistence({ key: event.target.value })}
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: 'persistence-advanced',
                label: 'Opciones avanzadas',
                children: (
                  <div className={INLINE_CHECKS}>
                    <div>
                      <BooleanSwitchWidget value={persistence.includeHidden} onChange={(checked) => updatePersistence({ includeHidden: checked })} />
                      <span className={INLINE_CHECK}>Incluir ocultos</span>
                    </div>
                    <div>
                      <BooleanSwitchWidget value={persistence.includeMeta} onChange={(checked) => updatePersistence({ includeMeta: checked })} />
                      <span className={INLINE_CHECK}>Incluir metadatos</span>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </Space>
      ),
    },
    {
      key: 'form-json',
      label: (
        <SectionHeader
          icon={<FileJson2 size={14} />}
          title="Salida JSON"
          active={Boolean(formJson.enabled)}
          description="Agrupa campos seleccionados."
        />
      ),
      children: (
        <Space direction="vertical" size={8} className="w-full">
          <div className={SUMMARY}>
            <div className={SUMMARY_TEXT}>{formJsonSummary}</div>
          </div>
          <div className={SWITCH_ROW}>
            <span className="font-semibold text-slate-700">Activar salida JSON</span>
            <BooleanSwitchWidget value={formJson.enabled} onChange={(checked) => updateFormJson({ enabled: checked })} />
          </div>
          <div className={SWITCH_ROW}>
            <span className="font-semibold text-slate-700">Recolectar valores</span>
            <BooleanSwitchWidget value={formJson.collect} onChange={(checked) => updateFormJson({ collect: checked })} />
          </div>
          <Collapse
            ghost
            className={SCHEMA_CONFIG_NESTED_COLLAPSE}
            defaultActiveKey={[]}
            items={[
              {
                key: 'form-json-basic',
                label: 'Salida principal',
                children: (
                  <div className={GRID_2}>
                    <div className={FIELD}>
                      <span className={FIELD_LABEL}>Formato</span>
                      <FormSelect
                        id="connections-json-format"
                        name="connections-json-format"
                        value={formJson.format || 'nested'}
                        onChange={(value) => updateFormJson({ format: value as SchemaFormJsonConfig['format'] })}
                        options={[
                          { label: 'Anidado', value: 'nested' },
                          { label: 'Plano', value: 'flat' },
                        ]}
                      />
                    </div>
                    <div className={FIELD}>
                      <span className={FIELD_LABEL}>Raíz JSON</span>
                      <Input
                        id="connections-json-root"
                        name="connections-json-root"
                        size="small"
                        value={formJson.rootKey || ''}
                        placeholder="formData"
                        onChange={(event) => updateFormJson({ rootKey: event.target.value })}
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: 'form-json-advanced',
                label: 'Opciones avanzadas',
                children: (
                  <div className={INLINE_CHECKS}>
                    <div>
                      <BooleanSwitchWidget value={formJson.includeEmpty} onChange={(checked) => updateFormJson({ includeEmpty: checked })} />
                      <span className={INLINE_CHECK}>Incluir vacíos</span>
                    </div>
                    <div>
                      <BooleanSwitchWidget value={formJson.includeHidden} onChange={(checked) => updateFormJson({ includeHidden: checked })} />
                      <span className={INLINE_CHECK}>Incluir ocultos</span>
                    </div>
                    <div>
                      <BooleanSwitchWidget value={formJson.includeMeta} onChange={(checked) => updateFormJson({ includeMeta: checked })} />
                      <span className={INLINE_CHECK}>Incluir meta</span>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </Space>
      ),
    },
    {
      key: 'api',
      label: (
        <SectionHeader
          icon={<Globe2 size={14} />}
          title="Consulta API"
          active={Boolean(api.enabled)}
          description="Obtiene valores, opciones o estados desde un endpoint."
        />
      ),
      children: (
        <Space direction="vertical" size={8} className="w-full">
          <div className={SUMMARY}>
            <div className={SUMMARY_TEXT}>{apiSummary}</div>
          </div>
          <div className={SWITCH_ROW}>
            <span className="font-semibold text-slate-700">Cargar opciones desde API</span>
            <BooleanSwitchWidget value={api.enabled} onChange={(checked) => updateApi({ enabled: checked })} />
          </div>
          <div className={SWITCH_ROW}>
            <span className="font-semibold text-slate-700">Heredar el cliente HTTP del host</span>
            <BooleanSwitchWidget value={api.http?.inheritSystem ?? true} onChange={(checked) => updateApiHttp({ inheritSystem: checked })} />
          </div>
          <div className={GRID_2}>
            <div className={FIELD}>
              <span className={FIELD_LABEL}>Endpoint</span>
              <Input
                id="connections-api-endpoint"
                name="connections-api-endpoint"
                size="small"
                value={api.endpoint || ''}
                placeholder="/api/fields/options"
                onChange={(event) => updateApi({ endpoint: event.target.value })}
              />
            </div>
            <div className={FIELD}>
              <span className={FIELD_LABEL}>Método</span>
                      <FormSelect
                        id="connections-api-method"
                        name="connections-api-method"
                        value={api.method || 'GET'}
                        onChange={(value) => updateApi({ method: value })}
                        options={[
                          { label: 'GET', value: 'GET' },
                          { label: 'POST', value: 'POST' },
                          { label: 'PUT', value: 'PUT' },
                          { label: 'PATCH', value: 'PATCH' },
                          { label: 'DELETE', value: 'DELETE' },
                        ]}
                      />
            </div>
            <div className={FIELD}>
              <span className={FIELD_LABEL}>Base URL</span>
              <Input
                id="connections-api-base-url"
                name="connections-api-base-url"
                size="small"
                value={api.http?.baseURL || ''}
                placeholder="https://api.ejemplo.com"
                onChange={(event) => updateApiHttp({ baseURL: event.target.value })}
              />
            </div>
            <div className={FIELD}>
              <span className={FIELD_LABEL}>Timeout (ms)</span>
              <InputNumber
                id="connections-api-timeout"
                name="connections-api-timeout"
                size="small"
                min={0}
                className={NUMBER_INPUT}
                value={typeof api.http?.timeoutMs === 'number' ? api.http.timeoutMs : undefined}
                onChange={(value) => updateApiHttp({ timeoutMs: typeof value === 'number' ? value : undefined })}
              />
            </div>
          </div>
              <div className={GRID_2}>
            <div className={FIELD}>
              <span className={FIELD_LABEL}>Modo de ejecución</span>
              <FormSelect
                id="connections-api-request-mode"
                name="connections-api-request-mode"
                value={api.requestMode || 'read'}
                onChange={(value) => updateApi({ requestMode: value as any })}
                options={[
                  { label: 'Lectura', value: 'read' },
                  { label: 'Escritura', value: 'submit' },
                  { label: 'Sincronización', value: 'sync' },
                  { label: 'Opciones', value: 'options' },
                ]}
              />
            </div>
            <div className={FIELD}>
              <span className={FIELD_LABEL}>Tipo de autenticación</span>
              <FormSelect
                id="connections-api-auth-mode"
                name="connections-api-auth-mode"
                value={api.http?.auth?.mode || 'inherit'}
                onChange={(value) => updateApiAuthMode(value as any)}
                options={[
                  { label: 'Heredada', value: 'inherit' },
                  { label: 'Manual', value: 'manual' },
                ]}
              />
            </div>
          </div>
          <div className={INLINE_CHECKS}>
            <div>
              <BooleanSwitchWidget value={api.http?.withCredentials} onChange={(checked) => updateApiHttp({ withCredentials: checked })} />
              <span className={INLINE_CHECK}>Enviar credenciales</span>
            </div>
          </div>
          {api.http?.auth?.mode === 'manual' ? (
            <Collapse
              ghost
              className={SCHEMA_CONFIG_NESTED_COLLAPSE}
              defaultActiveKey={[]}
              items={[
                {
                  key: 'api-auth',
                  label: 'Autenticación manual',
                  children: (
                    <div className={GRID_2}>
                      <div className={FIELD}>
                        <span className={FIELD_LABEL}>Tipo de token</span>
                        <Select
                          id="connections-api-auth-type"
                          name="connections-api-auth-type"
                          size="small"
                          value={api.http?.auth?.type || 'bearer'}
                          onChange={(value) => updateApiAuthType(value)}
                          options={[
                            { label: 'Token portador', value: 'bearer' },
                            { label: 'Básico', value: 'basic' },
                            { label: 'Clave API', value: 'apiKey' },
                            { label: 'Personalizado', value: 'custom' },
                          ]}
                        />
                      </div>
                      <div className={FIELD}>
                        <span className={FIELD_LABEL}>Nombre del header</span>
                        <Input
                          id="connections-api-auth-header"
                          name="connections-api-auth-header"
                          size="small"
                          value={api.http?.auth?.headerName || ''}
                        placeholder="Autorización"
                          onChange={(event) => updateApiAuth({ headerName: event.target.value })}
                        />
                      </div>
                      {(api.http?.auth?.type || 'bearer') === 'basic' ? (
                        <>
                      <div className={FIELD}>
                            <span className={FIELD_LABEL}>Usuario</span>
                            <Input
                              id="connections-api-auth-user"
                              name="connections-api-auth-user"
                              size="small"
                              value={api.http?.auth?.username || ''}
                              placeholder="usuario"
                              onChange={(event) => updateApiAuth({ username: event.target.value })}
                            />
                          </div>
                          <div className={FIELD}>
                            <span className={FIELD_LABEL}>Contraseña</span>
                            <Input.Password
                              id="connections-api-auth-password"
                              name="connections-api-auth-password"
                              size="small"
                              value={api.http?.auth?.password || ''}
                              placeholder="••••••••"
                              onChange={(event) => updateApiAuth({ password: event.target.value })}
                            />
                          </div>
                        </>
                      ) : (
                        <div className={FIELD}>
                          <span className={FIELD_LABEL}>Valor / token</span>
                          <Input
                            id="connections-api-auth-token"
                            name="connections-api-auth-token"
                            size="small"
                            value={api.http?.auth?.token || api.http?.auth?.headerValue || ''}
                        placeholder={(api.http?.auth?.type || 'bearer') === 'apiKey' ? 'clave-api' : 'token...'}
                            onChange={(event) => {
                              if ((api.http?.auth?.type || 'bearer') === 'apiKey' || (api.http?.auth?.type || 'bearer') === 'custom') {
                                updateApiAuth({ headerValue: event.target.value, token: undefined });
                              } else {
                                updateApiAuth({ token: event.target.value, headerValue: undefined });
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          ) : null}
          <Divider className={DIVIDER} />
          <Collapse
            ghost
            className={SCHEMA_CONFIG_NESTED_COLLAPSE}
            defaultActiveKey={[]}
            items={[
              {
                key: 'api-advanced',
                label: 'Avanzado',
                children: (
                  <Space direction="vertical" size={10} className="w-full">
                    <PairEditor
                      title="Encabezados personalizados"
                      description="Se combinan con los heredados del sistema."
                      values={api.http?.headers}
                      onChange={(next) => updateApiHttp({ headers: next })}
                      placeholderKey="Header"
                      placeholderValue="Valor"
                    />
                    <PairEditor
                      title="Parámetros"
                      description="Parámetros de consulta."
                      values={api.params}
                      onChange={(next) => updateApi({ params: next })}
                      placeholderKey="Clave"
                      placeholderValue="Valor"
                    />
                    <PairEditor
                      title="Mapeo de entrada"
                      description="Relaciona datos del schema con la salida."
                      values={api.requestMapping}
                      onChange={(next) => updateApi({ requestMapping: next })}
                      placeholderKey="Campo"
                      placeholderValue="Ruta"
                    />
                    <PairEditor
                      title="Mapeo de respuesta"
                      description="Extrae o transforma la respuesta."
                      values={api.responseMapping}
                      onChange={(next) => updateApi({ responseMapping: next })}
                      placeholderKey="Ruta"
                      placeholderValue="Campo"
                    />
                  </Space>
                ),
              },
            ]}
          />
          {resolvedHttpClient ? (
              <div className={SUMMARY}>
                <div className={SUMMARY_TEXT}>
                  {resolvedHttpClient.inheritSystem
                    ? 'Usa el cliente HTTP que inyecta la aplicación anfitriona'
                    : 'Usa una configuración de transporte local'}
                </div>
              </div>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <CompactConfigPanel
      // Ya vive dentro de la sección «Datos y conexiones»: repetir el título
      // aquí producía dos cabeceras seguidas diciendo lo mismo (duplicación D5).
      embedded
      title="Datos y conexión"
      description="Persistencia, JSON y API."
      summary={validationMessage}
      statusTags={[
        compactStateTag,
        ...(validationTag && validationState === 'warning' ? [validationTag] : []),
      ]}
      footerActions={
        <Button size="small" type="text" loading={isValidating} onClick={handleValidateConfig}>
          Validar
        </Button>
      }
      modalTitle="Configurar datos y conexión"
      modalTriggerLabel="Configurar conexión"
    >
      <div className={WIDGET_ROOT}>
        <div className={SUMMARY_ROW}>
          {runtimeStatusTags.map((tag) => (
            <Tag key={tag.label} color={tag.color} className={SUMMARY_TAG}>
              {tag.label}
            </Tag>
          ))}
        </div>
        <Collapse ghost items={items} defaultActiveKey={['persistence']} className={SCHEMA_CONFIG_COLLAPSE} />
      </div>
    </CompactConfigPanel>
  );
};

export default SchemaConnectionsWidget;
