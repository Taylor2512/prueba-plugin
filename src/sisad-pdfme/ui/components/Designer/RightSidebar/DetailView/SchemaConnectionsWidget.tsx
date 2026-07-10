import React, { useCallback, useMemo, useState } from 'react';
import type { PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import { Button, Collapse, Divider, Input, InputNumber, Select, Space, Tag } from 'antd';
import { DatabaseZap, Globe2, FileJson2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import {
  createSchemaDataRuntimeAdapter,
  resolveDesignerHttpClientConfig,
  type DesignerEngine,
  type SchemaDesignerConfig,
  type SchemaHttpAuthConfig,
  type SchemaHttpClientConfig,
  type SchemaFormJsonConfig,
  type SchemaPersistenceConfig,
} from '../../../../designerEngine.js';
import { PairEditor, SectionHeader } from './SchemaConnectionsShared.js';
import { getMissingConnectionFields } from './schemaConnectionsValidation.js';
import CompactConfigPanel from './CompactConfigPanel.js';
import { BooleanSwitchWidget } from './InspectorPrimitives.js';

type ConfigWidgetProps = PropPanelWidgetProps & {
  schemaConfig?: SchemaDesignerConfig | null;
  designerEngine?: DesignerEngine;
  updateSchemaConfig?: (_patch: Partial<SchemaDesignerConfig>) => void;
};

// Shared UI moved to SchemaConnectionsShared.tsx to keep this widget focused.

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

const buildValidationTag = (validationState: 'idle' | 'ok' | 'warning') => {
  if (validationState === 'ok') {
    return { label: 'Validación OK', color: 'success' as const };
  }

  if (validationState === 'warning') {
    return { label: 'Validación parcial', color: 'warning' as const };
  }

  return null;
};

const describeBoolean = (value?: boolean) => (value ? 'Sí' : 'No');

const describePersistence = (persistence: SchemaPersistenceConfig) => {
  if (!persistence.enabled) return 'Inactiva';
  return [
    persistence.mode || 'local',
    persistence.key ? `clave=${persistence.key}` : 'sin clave',
    `ocultos ${describeBoolean(Boolean(persistence.includeHidden))}`,
    `meta ${describeBoolean(Boolean(persistence.includeMeta))}`,
  ].join(' · ');
};

const describeFormJson = (formJson: SchemaFormJsonConfig) => {
  if (!formJson.enabled) return 'Inactivo';
  return [
    formJson.format || 'nested',
    formJson.rootKey ? `raíz=${formJson.rootKey}` : 'sin raíz',
    `vacíos ${describeBoolean(Boolean(formJson.includeEmpty))}`,
    `ocultos ${describeBoolean(Boolean(formJson.includeHidden))}`,
  ].join(' · ');
};

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

const CONNECTION_FIELD_LABELS: Record<string, string> = {
  storageKey: 'clave de almacenamiento',
  rootKey: 'raíz JSON',
  endpoint: 'endpoint',
  baseURL: 'URL base',
  auth: 'autenticación manual',
};

const formatMissingConnectionFields = (missing: string[]) =>
  missing.map((field) => CONNECTION_FIELD_LABELS[field] || field).join(', ');

const describeApi = (
  api: NonNullable<SchemaDesignerConfig['api']>,
  resolvedHttpClient: ReturnType<typeof resolveDesignerHttpClientConfig>,
) => {
  if (!api.enabled) return 'Inactiva';
  return [
    api.method || 'GET',
    api.endpoint || 'sin endpoint',
    resolvedHttpClient?.inheritSystem === false ? 'Axios local' : 'Axios sistema',
    describeHttpAuth(resolvedHttpClient?.auth),
  ].join(' · ');
};

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

const mergeSectionPatch = <T extends Record<string, unknown>>(base: T | undefined, patch: Partial<T>): T =>
  ({
    ...(base || {}),
    ...patch,
  } as T);

const SchemaConnectionsWidget = (props: ConfigWidgetProps) => {
  const { schemaConfig, designerEngine, updateSchemaConfig } = props;
  const [validationState, setValidationState] = useState<'idle' | 'ok' | 'warning'>('idle');
  const [validationMessage, setValidationMessage] = useState('Sin configurar');
  const [isValidating, setIsValidating] = useState(false);
  const persistence = useMemo<SchemaPersistenceConfig>(() => schemaConfig?.persistence || {}, [schemaConfig?.persistence]);
  const api = useMemo(() => schemaConfig?.api || {}, [schemaConfig?.api]);
  const formJson = useMemo<SchemaFormJsonConfig>(() => schemaConfig?.form || {}, [schemaConfig?.form]);
  const resolvedHttpClient = useMemo(
    () => resolveDesignerHttpClientConfig(schemaConfig || undefined, designerEngine),
    [designerEngine, schemaConfig],
  );
  const runtimeAdapter = useMemo(
    () =>
      createSchemaDataRuntimeAdapter({
        engine: designerEngine,
        fetchImpl: typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined,
      }),
    [designerEngine],
  );
  const authTag = useMemo(() => buildAuthTag(resolvedHttpClient), [resolvedHttpClient]);
  const runtimeStatusTags = useMemo(
    () =>
      [
        persistence.enabled ? { label: `Persistencia ${persistence.mode || 'local'}`, color: 'success' as const } : null,
        formJson.enabled ? { label: `JSON ${formJson.format || 'nested'}`, color: 'gold' as const } : null,
        api.enabled
          ? { label: api.endpoint ? 'API activa' : 'API sin endpoint', color: api.endpoint ? 'processing' : 'warning' as const }
          : null,
        resolvedHttpClient ? { label: resolvedHttpClient.inheritSystem ? 'Axios sistema' : 'Axios local', color: 'blue' as const } : null,
        authTag,
      ].filter(Boolean) as Array<{ label: string; color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' }>,
    [api.enabled, api.endpoint, authTag, formJson.enabled, formJson.format, persistence.enabled, persistence.mode, resolvedHttpClient],
  );

  const updatePersistence = useCallback(
    (patch: Partial<SchemaPersistenceConfig>) => {
      updateSchemaConfig?.({
        persistence: mergeSectionPatch(persistence, patch),
      });
    },
    [persistence, updateSchemaConfig],
  );

  const updateApi = useCallback(
    (patch: Partial<NonNullable<SchemaDesignerConfig['api']>>) => {
      updateSchemaConfig?.({
        api: mergeSectionPatch(api, patch),
      });
    },
    [api, updateSchemaConfig],
  );

  const updateApiHttp = useCallback(
    (patch: Partial<SchemaHttpClientConfig>) => {
      updateApi({
        http: mergeSectionPatch(api.http, patch),
      });
    },
    [api.http, updateApi],
  );

  const updateApiAuth = useCallback(
    (patch: Partial<SchemaHttpAuthConfig>) => {
      updateApiHttp({
        auth: mergeSectionPatch(api.http?.auth, patch),
      });
    },
    [api.http?.auth, updateApiHttp],
  );

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

  const updateApiAuthType = useCallback(
    (type: SchemaHttpAuthConfig['type']) => {
      updateApiHttp({
        auth: applyAuthPreset(type, api.http?.auth),
      });
    },
    [api.http?.auth, updateApiHttp],
  );

  const updateFormJson = useCallback(
    (patch: Partial<SchemaFormJsonConfig>) => {
      updateSchemaConfig?.({
        form: mergeSectionPatch(formJson, patch),
      });
    },
    [formJson, updateSchemaConfig],
  );

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

  const validationTag = useMemo(() => buildValidationTag(validationState), [validationState]);
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
          <div className={`${DESIGNER_CLASSNAME}schema-config-summary`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-summary-text`}>{persistenceSummary}</div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Persistir valor</span>
            <BooleanSwitchWidget value={persistence.enabled} onChange={(checked) => updatePersistence({ enabled: checked })} />
          </div>
          <Collapse
            ghost
            className={`${DESIGNER_CLASSNAME}schema-config-collapse schema-config-nested-collapse`}
            defaultActiveKey={[]}
            items={[
              {
                key: 'persistence-basic',
                label: 'Opciones básicas',
                children: (
                  <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <span>Modo</span>
                      <Select
                        id="connections-persistence-mode"
                        name="connections-persistence-mode"
                        size="small"
                        value={persistence.mode || 'local'}
                        onChange={(value) => updatePersistence({ mode: value })}
                        options={[
                          { label: 'Local', value: 'local' },
                          { label: 'Remoto', value: 'remote' },
                          { label: 'Híbrido', value: 'hybrid' },
                        ]}
                      />
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <span>Clave de almacenamiento</span>
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
                  <div className={`${DESIGNER_CLASSNAME}schema-config-inline-checks`}>
                    <div>
                      <BooleanSwitchWidget value={persistence.includeHidden} onChange={(checked) => updatePersistence({ includeHidden: checked })} />
                      <span>Incluir ocultos</span>
                    </div>
                    <div>
                      <BooleanSwitchWidget value={persistence.includeMeta} onChange={(checked) => updatePersistence({ includeMeta: checked })} />
                      <span>Incluir metadatos</span>
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
          <div className={`${DESIGNER_CLASSNAME}schema-config-summary`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-summary-text`}>{formJsonSummary}</div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Activar salida JSON</span>
            <BooleanSwitchWidget value={formJson.enabled} onChange={(checked) => updateFormJson({ enabled: checked })} />
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Recolectar valores</span>
            <BooleanSwitchWidget value={formJson.collect} onChange={(checked) => updateFormJson({ collect: checked })} />
          </div>
          <Collapse
            ghost
            className={`${DESIGNER_CLASSNAME}schema-config-collapse schema-config-nested-collapse`}
            defaultActiveKey={[]}
            items={[
              {
                key: 'form-json-basic',
                label: 'Salida principal',
                children: (
                  <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <span>Formato</span>
                      <Select
                        id="connections-json-format"
                        name="connections-json-format"
                        size="small"
                        value={formJson.format || 'nested'}
                        onChange={(value) => updateFormJson({ format: value })}
                        options={[
                          { label: 'Anidado', value: 'nested' },
                          { label: 'Plano', value: 'flat' },
                        ]}
                      />
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <span>Raíz JSON</span>
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
                  <div className={`${DESIGNER_CLASSNAME}schema-config-inline-checks`}>
                    <div>
                      <BooleanSwitchWidget value={formJson.includeEmpty} onChange={(checked) => updateFormJson({ includeEmpty: checked })} />
                      <span>Incluir vacíos</span>
                    </div>
                    <div>
                      <BooleanSwitchWidget value={formJson.includeHidden} onChange={(checked) => updateFormJson({ includeHidden: checked })} />
                      <span>Incluir ocultos</span>
                    </div>
                    <div>
                      <BooleanSwitchWidget value={formJson.includeMeta} onChange={(checked) => updateFormJson({ includeMeta: checked })} />
                      <span>Incluir meta</span>
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
          <div className={`${DESIGNER_CLASSNAME}schema-config-summary`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-summary-text`}>{apiSummary}</div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Cargar opciones desde API</span>
            <BooleanSwitchWidget value={api.enabled} onChange={(checked) => updateApi({ enabled: checked })} />
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Heredar Axios del sistema</span>
            <BooleanSwitchWidget value={api.http?.inheritSystem ?? true} onChange={(checked) => updateApiHttp({ inheritSystem: checked })} />
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <span>Endpoint</span>
              <Input
                id="connections-api-endpoint"
                name="connections-api-endpoint"
                size="small"
                value={api.endpoint || ''}
                placeholder="/api/fields/options"
                onChange={(event) => updateApi({ endpoint: event.target.value })}
              />
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <span>Método</span>
              <Select
                id="connections-api-method"
                name="connections-api-method"
                size="small"
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
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <span>Base URL</span>
              <Input
                id="connections-api-base-url"
                name="connections-api-base-url"
                size="small"
                value={api.http?.baseURL || ''}
                placeholder="https://api.ejemplo.com"
                onChange={(event) => updateApiHttp({ baseURL: event.target.value })}
              />
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <span>Timeout (ms)</span>
              <InputNumber
                id="connections-api-timeout"
                name="connections-api-timeout"
                size="small"
                min={0}
                className={`${DESIGNER_CLASSNAME}schema-config-number`}
                value={typeof api.http?.timeoutMs === 'number' ? api.http.timeoutMs : undefined}
                onChange={(value) => updateApiHttp({ timeoutMs: typeof value === 'number' ? value : undefined })}
              />
            </div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <span>Modo de ejecución</span>
              <Select
                id="connections-api-request-mode"
                name="connections-api-request-mode"
                size="small"
                value={api.requestMode || 'read'}
                onChange={(value) => updateApi({ requestMode: value })}
                options={[
                  { label: 'Lectura', value: 'read' },
                  { label: 'Escritura', value: 'submit' },
                  { label: 'Sincronización', value: 'sync' },
                  { label: 'Opciones', value: 'options' },
                ]}
              />
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <span>Tipo de autenticación</span>
              <Select
                id="connections-api-auth-mode"
                name="connections-api-auth-mode"
                size="small"
                value={api.http?.auth?.mode || 'inherit'}
                onChange={(value) => updateApiAuthMode(value)}
                options={[
                  { label: 'Heredada', value: 'inherit' },
                  { label: 'Manual', value: 'manual' },
                ]}
              />
            </div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-inline-checks`}>
            <div>
              <BooleanSwitchWidget value={api.http?.withCredentials} onChange={(checked) => updateApiHttp({ withCredentials: checked })} />
              <span>Enviar credenciales</span>
            </div>
          </div>
          {api.http?.auth?.mode === 'manual' ? (
            <Collapse
              ghost
              className={`${DESIGNER_CLASSNAME}schema-config-collapse schema-config-nested-collapse`}
              defaultActiveKey={[]}
              items={[
                {
                  key: 'api-auth',
                  label: 'Autenticación manual',
                  children: (
                    <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                        <span>Tipo de token</span>
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
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                        <span>Nombre del header</span>
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
                          <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                            <span>Usuario</span>
                            <Input
                              id="connections-api-auth-user"
                              name="connections-api-auth-user"
                              size="small"
                              value={api.http?.auth?.username || ''}
                              placeholder="usuario"
                              onChange={(event) => updateApiAuth({ username: event.target.value })}
                            />
                          </div>
                          <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                            <span>Contraseña</span>
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
                        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                          <span>Valor / token</span>
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
          <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />
          <Collapse
            ghost
            className={`${DESIGNER_CLASSNAME}schema-config-collapse schema-config-nested-collapse`}
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
            <div className={`${DESIGNER_CLASSNAME}schema-config-summary`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-summary-text`}>
                {resolvedHttpClient.inheritSystem ? 'Usa la configuración global de Axios' : 'Usa configuración local de Axios'}
              </div>
            </div>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <CompactConfigPanel
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
      <div className={`${DESIGNER_CLASSNAME}schema-config-widget`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-summary-row`}>
          {runtimeStatusTags.map((tag) => (
            <Tag key={tag.label} color={tag.color} className={`${DESIGNER_CLASSNAME}schema-config-summary-tag`}>
              {tag.label}
            </Tag>
          ))}
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-summary`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-summary-text`}>{validationMessage}</div>
        </div>
        <Collapse ghost items={items} defaultActiveKey={['persistence']} className={`${DESIGNER_CLASSNAME}schema-config-collapse`} />
      </div>
    </CompactConfigPanel>
  );
};

export default SchemaConnectionsWidget;
