import { describe, expect, it, vi } from 'vitest';
import {
  DesignerEngineBuilder,
  mergeSchemaDesignerConfig,
  getSchemaDesignerConfig,
  resolveDesignerHttpClientConfig,
  createSchemaDataRuntimeAdapter,
} from '../../src/pdfme/ui/src/designerEngine.js';
import type { SchemaForUI } from '@pdfme/common';

describe('designerEngine config', () => {
  const schema = {
    id: 'schema-1',
    name: 'campo-1',
    type: 'text',
  } as SchemaForUI;

  it('merges schema persistence, api and form config without dropping nested fields', () => {
    const engine = new DesignerEngineBuilder()
      .withHttpAxiosConfig({
        baseURL: 'https://system.example.com',
        timeoutMs: 2500,
        headers: { Authorization: 'Bearer system-token' },
        auth: { mode: 'manual', type: 'bearer', token: 'system-token' },
      })
      .build();

    const nextSchema = mergeSchemaDesignerConfig(
      schema,
      {
        persistence: {
          enabled: true,
          mode: 'hybrid',
          key: 'form.campo-1',
          includeHidden: true,
        },
        api: {
          enabled: true,
          endpoint: '/fields/options',
          method: 'POST',
          http: {
            inheritSystem: false,
            baseURL: 'https://custom.example.com',
            headers: { 'X-Flow': 'editor' },
            auth: { mode: 'manual', type: 'apiKey', headerName: 'X-Api-Key', headerValue: 'abc123' },
          },
          params: { page: '1' },
          requestMapping: { value: 'schema.content' },
          responseMapping: { options: 'data.items' },
          timeoutMs: 4000,
        },
        form: {
          enabled: true,
          collect: true,
          format: 'flat',
          rootKey: 'formData',
          includeEmpty: false,
          includeHidden: false,
          includeMeta: true,
        },
      },
      engine,
    );

    const config = getSchemaDesignerConfig(nextSchema, engine);
    expect(config?.persistence?.enabled).toBe(true);
    expect(config?.persistence?.mode).toBe('hybrid');
    expect(config?.api?.enabled).toBe(true);
    expect(config?.api?.http?.baseURL).toBe('https://custom.example.com');
    expect(config?.api?.requestMapping?.value).toBe('schema.content');
    expect(config?.form?.collect).toBe(true);
    expect(config?.form?.format).toBe('flat');
  });

  it('inherits Axios config from the designer engine and merges schema headers/auth', () => {
    const engine = new DesignerEngineBuilder()
      .withHttpAxiosConfig({
        baseURL: 'https://system.example.com',
        timeoutMs: 2500,
        headers: {
          Authorization: 'Bearer system-token',
          'X-Trace': 'system',
        },
        auth: { mode: 'manual', type: 'bearer', token: 'system-token' },
      })
      .build();

    const resolved = resolveDesignerHttpClientConfig(
      {
        api: {
          http: {
            inheritSystem: true,
            headers: {
              'X-Trace': 'schema',
              'X-Flow': 'editor',
            },
            auth: { mode: 'manual', type: 'apiKey', headerName: 'X-Api-Key', headerValue: 'abc123' },
          },
        },
      },
      engine,
    );

    expect(resolved?.baseURL).toBe('https://system.example.com');
    expect(resolved?.timeoutMs).toBe(2500);
    expect(resolved?.headers?.Authorization).toBe('Bearer system-token');
    expect(resolved?.headers?.['X-Trace']).toBe('schema');
    expect(resolved?.headers?.['X-Flow']).toBe('editor');
    expect(resolved?.auth?.type).toBe('apiKey');
    expect(resolved?.auth?.headerName).toBe('X-Api-Key');
    expect(resolved?.auth?.headerValue).toBe('abc123');
  });

  it('builds nested and flat form JSON envelopes from runtime snapshots', () => {
    const engine = new DesignerEngineBuilder().build();
    const nestedSchema = mergeSchemaDesignerConfig(
      {
        id: 'schema-1',
        name: 'customer.name',
        type: 'text',
      } as SchemaForUI,
      {
        form: {
          enabled: true,
          collect: true,
          format: 'nested',
          rootKey: 'formData',
          includeEmpty: false,
          includeHidden: false,
          includeMeta: true,
        },
      },
      engine,
    );
    const flatSchema = mergeSchemaDesignerConfig(
      {
        id: 'schema-2',
        name: 'customer.email',
        type: 'text',
      } as SchemaForUI,
      {
        form: {
          enabled: true,
          collect: true,
          format: 'flat',
          rootKey: 'formData',
          includeEmpty: true,
          includeHidden: true,
          includeMeta: false,
        },
      },
      engine,
    );

    const adapter = createSchemaDataRuntimeAdapter({ engine, now: () => 1700000000000 });
    const envelope = adapter.buildFormJson({
      pageIndex: 1,
      totalPages: 3,
      unitIndex: 0,
      currentInput: {
        'customer.name': 'Ada',
        'customer.email': '',
      },
      fields: [
        { schema: nestedSchema, config: getSchemaDesignerConfig(nestedSchema, engine) || null },
        { schema: flatSchema, config: getSchemaDesignerConfig(flatSchema, engine) || null },
      ],
    });

    expect(envelope?.meta.format).toBe('nested');
    expect(envelope?.meta.rootKey).toBe('formData');
    expect(envelope?.meta.schemaCount).toBe(2);
    expect(envelope?.data.formData).toMatchObject({
      customer: { name: 'Ada' },
    });
    expect(envelope?.data._meta).toMatchObject({
      pageIndex: 1,
      totalPages: 3,
      unitIndex: 0,
      schemaCount: 2,
      generatedAt: 1700000000000,
    });
  });

  it('resolves API requests, merges inherited headers and maps response values', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {
        get: (key: string) => (key === 'content-type' ? 'application/json' : null),
      },
      json: async () => ({ data: { customerName: 'Grace' } }),
      text: async () => '',
    });
    const engine = new DesignerEngineBuilder()
      .withHttpAxiosConfig({
        baseURL: 'https://system.example.com',
        timeoutMs: 2500,
        headers: { Authorization: 'Bearer system-token', 'X-Trace': 'system' },
        auth: { mode: 'manual', type: 'bearer', token: 'system-token' },
      })
      .build();
    const schema = mergeSchemaDesignerConfig(
      {
        id: 'schema-api',
        name: 'customerName',
        type: 'text',
      } as SchemaForUI,
      {
        api: {
          enabled: true,
          endpoint: '/customers',
          method: 'POST',
          requestMode: 'submit',
          http: {
            inheritSystem: true,
            headers: { 'X-Flow': 'editor' },
            auth: { mode: 'manual', type: 'apiKey', headerName: 'X-Api-Key', headerValue: 'abc123' },
          },
          params: { page: '1' },
          requestMapping: { customerName: 'payload.customerName' },
          responseMapping: { 'data.customerName': 'customerName' },
          timeoutMs: 4000,
        },
      },
      engine,
    );

    const adapter = createSchemaDataRuntimeAdapter({ engine, fetchImpl });
    const snapshot = {
      pageIndex: 0,
      totalPages: 1,
      unitIndex: 0,
      currentInput: { customerName: 'Ada' },
      fields: [{ schema, config: getSchemaDesignerConfig(schema, engine) || null }],
    };
    const request = adapter.resolveRequest(snapshot.fields[0], snapshot);

    expect(request?.url).toBe('https://system.example.com/customers?page=1');
    expect(request?.headers.Authorization).toBe('Bearer system-token');
    expect(request?.headers['X-Trace']).toBe('system');
    expect(request?.headers['X-Flow']).toBe('editor');
    expect(request?.headers['X-Api-Key']).toBe('abc123');
    expect(request?.body).toEqual({ payload: { customerName: 'Ada' } });

    const response = await adapter.executeRequest(request!);
    const mapped = adapter.mapResponseToValues(response, snapshot.fields[0], request!, snapshot);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(mapped.customerName).toBe('Grace');
  });

  it('reads and writes persisted values through the adapter storage layer', () => {
    const storage = (() => {
      const store = new Map<string, string>();
      return {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
        removeItem: (key: string) => {
          store.delete(key);
        },
      };
    })();

    const adapter = createSchemaDataRuntimeAdapter({ storage });
    adapter.writePersistedValue('field-1', 'value-1');
    expect(adapter.readPersistedValue('field-1')).toBe('value-1');
  });
});
