import React, { useCallback, useMemo, useState } from 'react';
import type { PropPanelWidgetProps } from '@sisad-pdfme/common';
import { Button, Collapse, Divider, Input, InputNumber, Select, Space, Switch, Tag } from 'antd';
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

type ConfigWidgetProps = PropPanelWidgetProps & {
  schemaConfig?: SchemaDesignerConfig | null;
  designerEngine?: DesignerEngine;
  updateSchemaConfig?: (_patch: Partial<SchemaDesignerConfig>) => void;
};

// Shared UI moved to SchemaConnectionsShared.tsx to keep this widget focused.

const buildAuthTag = (resolvedHttpClient: ReturnType<typeof resolveDesignerHttpClientConfig>) => {
  if (!resolvedHttpClient) return null;

  if (resolvedHttpClient.auth?.mode === 'manual') {
    return { label: `Auth ${resolvedHttpClient.auth.type || 'manual'}`, color: 'warning' as const };
  }

  return { label: 'Auth heredada', color: 'default' as const };
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
    persistence.key ? `key=${persistence.key}` : 'sin clave',
    `ocultos ${describeBoolean(Boolean(persistence.includeHidden))}`,
    `meta ${describeBoolean(Boolean(persistence.includeMeta))}`,
  ].join(' · ');
};

const describeFormJson = (formJson: SchemaFormJsonConfig) => {
  if (!formJson.enabled) return 'Inactivo';
  return [
    formJson.format || 'nested',
    formJson.rootKey ? `root=${formJson.rootKey}` : 'sin raíz',
    `vacíos ${describeBoolean(Boolean(formJson.includeEmpty))}`,
    `ocultos ${describeBoolean(Boolean(formJson.includeHidden))}`,
  ].join(' · ');
};

const describeHttpAuth = (auth?: SchemaHttpAuthConfig) => {
  if (auth?.mode !== 'manual') return 'Auth heredada';
  const header = auth.headerName ? `header=${auth.headerName}` : 'sin header';
  return `${auth.type || 'manual'} · ${header}`;
};

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
      headerName: current?.headerName || 'Authorization',
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
      headerName: current?.headerName || 'Authorization',
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
    headerName: current?.headerName || 'Authorization',
    token: current?.token || current?.headerValue || '',
    headerValue: undefined,
    username: undefined,
    password: undefined,
  };
};

const SchemaConnectionsWidget = (props: ConfigWidgetProps) => {
  const { schemaConfig, designerEngine, updateSchemaConfig } = props;
  const [validationState, setValidationState] = useState<'idle' | 'ok' | 'warning'>('idle');
  const [validationMessage, setValidationMessage] = useState('Sin validar');
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
        persistence: {
          ...persistence,
          ...patch,
        },
      });
    },
    [persistence, updateSchemaConfig],
  );

  const updateApi = useCallback(
    (patch: Partial<NonNullable<SchemaDesignerConfig['api']>>) => {
      updateSchemaConfig?.({
        api: {
          ...api,
          ...patch,
        },
      });
    },
    [api, updateSchemaConfig],
  );

  const updateApiHttp = useCallback(
    (patch: Partial<SchemaHttpClientConfig>) => {
      updateApi({
        http: {
          ...api.http,
          ...patch,
        },
      });
    },
    [api.http, updateApi],
  );

  const updateApiAuth = useCallback(
    (patch: Partial<SchemaHttpAuthConfig>) => {
      updateApiHttp({
        auth: {
          ...api.http?.auth,
          ...patch,
        },
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
        form: {
          ...formJson,
          ...patch,
        },
      });
    },
    [formJson, updateSchemaConfig],
  );

  const handleValidateConfig = () => {
    if (!api.enabled) {
      setValidationState('warning');
      setValidationMessage('Activa la API para probar la conexión.');
      return;
    }

    const missing = getMissingConnectionFields(persistence, api, formJson, resolvedHttpClient);

    if (missing.length === 0) {
      setValidationState('ok');
      setValidationMessage('La configuración está lista para usar.');
      return;
    }

    const validationSchema = {
      id: 'schema-connections-validation',
      name: schemaConfig?.identity?.key || 'schemaConnections',
      type: 'text',
    } as unknown as import('@sisad-pdfme/common').SchemaForUI;
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
      });
  };

  const validationTag = useMemo(() => buildValidationTag(validationState), [validationState]);

  const headerTags = runtimeStatusTags.slice(0, 3);
  const persistenceSummary = describePersistence(persistence);
  const formJsonSummary = describeFormJson(formJson);
  const apiSummary = describeApi(api, resolvedHttpClient);

  const items = [
    {
      key: 'persistence',
      label: (
        <SectionHeader
          icon={<DatabaseZap size={14} />}
          title="Persistencia de datos"
          active={Boolean(persistence.enabled)}
          description="Guarda el valor capturado en la configuración del schema."
        />
      ),
      children: (
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-summary`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-summary-text`}>{persistenceSummary}</div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Guardar datos ingresados</span>
            <Switch checked={Boolean(persistence.enabled)} onChange={(checked) => updatePersistence({ enabled: checked })} />
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
                      <Switch checked={Boolean(persistence.includeHidden)} onChange={(checked) => updatePersistence({ includeHidden: checked })} />
                      <span>Incluir ocultos</span>
                    </div>
                    <div>
                      <Switch checked={Boolean(persistence.includeMeta)} onChange={(checked) => updatePersistence({ includeMeta: checked })} />
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
          title="Salida de formulario JSON"
          active={Boolean(formJson.enabled)}
          description="Agrupa todos los campos seleccionados en una estructura generada dinámicamente."
        />
      ),
      children: (
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-summary`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-summary-text`}>{formJsonSummary}</div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Activar salida JSON</span>
            <Switch checked={Boolean(formJson.enabled)} onChange={(checked) => updateFormJson({ enabled: checked })} />
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Recolectar valores</span>
            <Switch checked={Boolean(formJson.collect)} onChange={(checked) => updateFormJson({ collect: checked })} />
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
                      <Switch checked={Boolean(formJson.includeEmpty)} onChange={(checked) => updateFormJson({ includeEmpty: checked })} />
                      <span>Incluir vacíos</span>
                    </div>
                    <div>
                      <Switch checked={Boolean(formJson.includeHidden)} onChange={(checked) => updateFormJson({ includeHidden: checked })} />
                      <span>Incluir ocultos</span>
                    </div>
                    <div>
                      <Switch checked={Boolean(formJson.includeMeta)} onChange={(checked) => updateFormJson({ includeMeta: checked })} />
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
          title="Consulta API / Axios"
          active={Boolean(api.enabled)}
          description="Obtiene valores, opciones o estados desde un endpoint, heredando la configuración global cuando aplique."
        />
      ),
      children: (
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-summary`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-summary-text`}>{apiSummary}</div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Consultar API</span>
            <Switch checked={Boolean(api.enabled)} onChange={(checked) => updateApi({ enabled: checked })} />
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Heredar Axios del sistema</span>
            <Switch
              checked={Boolean(api.http?.inheritSystem ?? true)}
              onChange={(checked) => updateApiHttp({ inheritSystem: checked })}
            />
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <span>Endpoint</span>
              <Input
                size="small"
                value={api.endpoint || ''}
                placeholder="/api/fields/options"
                onChange={(event) => updateApi({ endpoint: event.target.value })}
              />
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <span>Método</span>
              <Select
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
                size="small"
                value={api.http?.baseURL || ''}
                placeholder="https://api.ejemplo.com"
                onChange={(event) => updateApiHttp({ baseURL: event.target.value })}
              />
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <span>Timeout (ms)</span>
              <InputNumber
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
              <span>Tipo de auth</span>
              <Select
                size="small"
                value={api.http?.auth?.mode || 'inherit'}
                onChange={(value) => updateApiAuth({ mode: value })}
                options={[
                  { label: 'Heredada', value: 'inherit' },
                  { label: 'Manual', value: 'manual' },
                ]}
              />
            </div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-inline-checks`}>
            <div>
              <Switch
                checked={Boolean(api.http?.withCredentials)}
                onChange={(checked) => updateApiHttp({ withCredentials: checked })}
              />
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
                          size="small"
                          value={api.http?.auth?.type || 'bearer'}
                          onChange={(value) => updateApiAuthType(value)}
                          options={[
                            { label: 'Bearer', value: 'bearer' },
                            { label: 'Basic', value: 'basic' },
                            { label: 'API Key', value: 'apiKey' },
                            { label: 'Custom', value: 'custom' },
                          ]}
                        />
                      </div>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                        <span>Nombre del header</span>
                        <Input
                          size="small"
                          value={api.http?.auth?.headerName || ''}
                          placeholder="Authorization"
                          onChange={(event) => updateApiAuth({ headerName: event.target.value })}
                        />
                      </div>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                        <span>Valor / token</span>
                        <Input
                          size="small"
                          value={api.http?.auth?.token || api.http?.auth?.headerValue || ''}
                          placeholder="Bearer ..."
                          onChange={(event) => {
                            if ((api.http?.auth?.type || 'bearer') === 'apiKey') {
                              updateApiAuth({ headerValue: event.target.value });
                            } else {
                              updateApiAuth({ token: event.target.value });
                            }
                          }}
                        />
                      </div>
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
                label: 'Encabezados, parámetros y mapeos',
                children: (
                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    <PairEditor
                      title="Encabezados personalizados"
                      description="Se mezclan con los heredados del sistema y pueden sobrescribir valores."
                      values={api.http?.headers}
                      onChange={(next) => updateApiHttp({ headers: next })}
                      placeholderKey="Header"
                      placeholderValue="Valor"
                    />
                    <PairEditor
                      title="Parámetros"
                      description="Parámetros de consulta para la petición."
                      values={api.params}
                      onChange={(next) => updateApi({ params: next })}
                      placeholderKey="Clave"
                      placeholderValue="Valor"
                    />
                    <PairEditor
                      title="Mapeo de entrada"
                      description="Relaciona datos del schema con el body/payload de salida."
                      values={api.requestMapping}
                      onChange={(next) => updateApi({ requestMapping: next })}
                      placeholderKey="Campo"
                      placeholderValue="Ruta"
                    />
                    <PairEditor
                      title="Mapeo de respuesta"
                      description="Extrae o transforma la respuesta para rellenar el schema."
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
      title="Conexiones y persistencia"
      description="Activa guardado, salida JSON y consultas remotas sin ocupar el panel completo."
      summary={validationMessage}
      statusTags={[
        ...headerTags,
        ...(validationTag ? [validationTag] : []),
        ...(api.enabled && !api.endpoint ? [{ label: 'Falta endpoint', color: 'warning' as const }] : []),
        ...(formJson.enabled && formJson.collect && !formJson.rootKey
          ? [{ label: 'Falta raíz JSON', color: 'warning' as const }]
          : []),
      ]}
      quickActions={
        <>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Guardar datos</span>
            <Switch checked={Boolean(persistence.enabled)} onChange={(checked) => updatePersistence({ enabled: checked })} />
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Salida JSON</span>
            <Switch checked={Boolean(formJson.enabled)} onChange={(checked) => updateFormJson({ enabled: checked })} />
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-switch-row`}>
            <span>Consultar API</span>
            <Switch checked={Boolean(api.enabled)} onChange={(checked) => updateApi({ enabled: checked })} />
          </div>
        </>
      }
      footerActions={
        <>
          <Button size="small" type="text" onClick={handleValidateConfig}>
            Validar
          </Button>
        </>
      }
      modalTitle="Configurar conexiones y persistencia"
      modalTriggerLabel="Configuración avanzada"
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
        <Collapse
          ghost
          items={items}
          defaultActiveKey={['persistence']}
          className={`${DESIGNER_CLASSNAME}schema-config-collapse`}
        />
      </div>
    </CompactConfigPanel>
  );
};

export default SchemaConnectionsWidget;
