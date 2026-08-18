/**
 * El bundle portable no puede llevar recursos vivos ni credenciales (RTP-470).
 *
 * `SchemaHttpAuthConfig` admite `token`, `username`, `password` y
 * `headerValue` dentro de la configuración declarativa de conexión, que SÍ es
 * portable y se edita desde el inspector. Sin limpieza, exportar un bundle se
 * llevaba credenciales del host dentro de la plantilla.
 */
import { describe, expect, it } from 'vitest';
import {
  createSisadPdfmeInstanceBundle,
  serializeSisadPdfmeInstanceBundle,
} from '../../../../src/sisad-pdfme/integration/SisadPdfmeInstanceBundle';
import {
  NON_PORTABLE_RESOURCE_KEYS,
  containsSecrets,
  stripSecrets,
} from '../../../../src/sisad-pdfme/integration/http/integrationResources';
import { createMissingHttpClientAdapter } from '../../../../src/sisad-pdfme/integration/http/httpClient';

const definition = { id: 'inst-1', mode: 'designer' } as never;

describe('stripSecrets', () => {
  it('elimina claves de credencial en profundidad', () => {
    const { value, removed } = stripSecrets({
      http: { baseURL: '/api', auth: { type: 'bearer', token: 'SECRETO', username: 'u', password: 'P' } },
      safe: { tenant: 'acme' },
    });
    expect(JSON.stringify(value)).not.toContain('SECRETO');
    expect(JSON.stringify(value)).not.toContain('P');
    expect(value).toMatchObject({ http: { baseURL: '/api', auth: { type: 'bearer' } }, safe: { tenant: 'acme' } });
    expect(removed).toEqual(expect.arrayContaining(['http.auth.token', 'http.auth.password']));
  });

  it('elimina funciones, que nunca son portables', () => {
    const { value, removed } = stripSecrets({ onThing: () => undefined, keep: 1 });
    expect(value).toEqual({ keep: 1 });
    expect(removed).toEqual(['onThing']);
  });

  it('no confunde una clave inocente con un secreto', () => {
    expect(containsSecrets({ tokenCount: 3, description: 'x' })).toBe(false);
  });

  it('soporta ciclos sin lanzar', () => {
    const value: Record<string, unknown> = { a: 1 };
    value.self = value;
    expect(() => stripSecrets(value)).not.toThrow();
  });
});

describe('bundle portable', () => {
  it('declara las dos ramas no serializables', () => {
    expect([...NON_PORTABLE_RESOURCE_KEYS]).toEqual(['adapters', 'integrations']);
  });

  it('no exporta el cliente HTTP ni las fuentes de datos', () => {
    const bundle = createSisadPdfmeInstanceBundle({
      definition,
      resources: {
        template: { schemas: [] },
        adapters: { toRecipient: () => ({}) } as never,
        integrations: {
          httpClient: createMissingHttpClientAdapter(),
          dataSources: { pokemon: { query: () => [] } },
        },
      },
    });
    expect(bundle.resources).not.toHaveProperty('integrations');
    expect(bundle.resources).not.toHaveProperty('adapters');
    expect(bundle.resources).toHaveProperty('template');
  });

  it('el bundle serializado no contiene credenciales', () => {
    const bundle = createSisadPdfmeInstanceBundle({
      definition,
      resources: {
        templates: {
          principal: {
            connections: {
              http: { baseURL: '/api', auth: { type: 'bearer', token: 'TOKEN-DEL-HOST' } },
            },
          },
        },
        integrations: { httpClient: createMissingHttpClientAdapter() },
      },
    });
    const serialized = serializeSisadPdfmeInstanceBundle(bundle);
    expect(serialized).not.toContain('TOKEN-DEL-HOST');
    expect(serialized).toContain('/api');
  });

  it('el bundle es serializable: no quedan funciones dentro', () => {
    const bundle = createSisadPdfmeInstanceBundle({
      definition,
      resources: {
        templates: { principal: { onLoad: () => undefined, titulo: 'x' } },
        integrations: { httpClient: createMissingHttpClientAdapter() },
      },
    });
    expect(() => serializeSisadPdfmeInstanceBundle(bundle)).not.toThrow();
    expect(containsSecrets(bundle.resources)).toBe(false);
  });
});
