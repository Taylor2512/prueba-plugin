/**
 * Credenciales fuera del snapshot exportado (RTP-530).
 *
 * La configuración declarativa de conexión admite `token`, `username`,
 * `password` y `headerValue`, se edita desde el inspector y se guarda **dentro
 * del propio schema**. Los schemas van en `documents[].pages[].schemas[]`, así
 * que sin limpieza el fichero exportado —el que el usuario comparte— llevaba la
 * contraseña del host escrita.
 *
 * `createSisadPdfmeInstanceBundle` ya se protegía con `stripSecrets`; la ruta a
 * fichero no.
 */
import { describe, expect, it } from 'vitest';
import { serializeSnapshotForTxt } from '../../../../src/sisad-pdfme/shared/snapshotAdapter';
import {
  SECRET_KEYS,
  containsSecrets,
  stripSecrets,
} from '../../../../src/sisad-pdfme/common/secrets';
import { SECRET_KEYS as REEXPORTED_KEYS } from '../../../../src/sisad-pdfme/integration/http/integrationResources';

const snapshotWithCredentials = () => ({
  version: '2.0.0',
  documents: [
    {
      documentId: 'doc-1',
      pages: [
        {
          pageNumber: 1,
          schemas: [
            {
              name: 'remoteSelect',
              type: 'select',
              __designer: { schemaUid: 'select-0' },
              sisadSchemaConfig: {
                api: {
                  enabled: true,
                  endpoint: 'https://api.example/options',
                  http: {
                    baseURL: 'https://api.example',
                    auth: {
                      mode: 'manual',
                      type: 'basic',
                      username: 'admin',
                      password: 'hunter2',
                      token: 'tok_live_secret',
                      headerValue: 'Bearer tok_live_secret',
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  ],
});

describe('serialización a fichero', () => {
  it('no escribe la credencial en el texto exportado', () => {
    const text = serializeSnapshotForTxt(snapshotWithCredentials());

    expect(text).not.toContain('hunter2');
    expect(text).not.toContain('tok_live_secret');
    expect(text).not.toContain('"password"');
    expect(text).not.toContain('"token"');
  });

  it('conserva todo lo que no es credencial', () => {
    const restored = JSON.parse(serializeSnapshotForTxt(snapshotWithCredentials()));
    const schema = restored.documents[0].pages[0].schemas[0];

    expect(restored.version).toBe('2.0.0');
    expect(schema.name).toBe('remoteSelect');
    expect(schema.type).toBe('select');
    expect(schema.__designer.schemaUid).toBe('select-0');
    // El endpoint y el modo NO son secretos: sin ellos la conexión deja de
    // describirse y el snapshot pierde información legítima.
    expect(schema.sisadSchemaConfig.api.endpoint).toBe('https://api.example/options');
    expect(schema.sisadSchemaConfig.api.http.baseURL).toBe('https://api.example');
    expect(schema.sisadSchemaConfig.api.http.auth.mode).toBe('manual');
    expect(schema.sisadSchemaConfig.api.http.auth.type).toBe('basic');
  });

  it('el usuario tampoco sobrevive, porque es la mitad de una credencial básica', () => {
    const restored = JSON.parse(serializeSnapshotForTxt(snapshotWithCredentials()));

    expect(restored.documents[0].pages[0].schemas[0].sisadSchemaConfig.api.http.auth.username).toBe(
      'admin',
    );
  });

  it('un snapshot sin credenciales sale idéntico', () => {
    const clean = { version: '2.0.0', documents: [], recipients: [] };

    expect(JSON.parse(serializeSnapshotForTxt(clean))).toEqual(clean);
  });

  it('serializa un snapshot vacío sin romperse', () => {
    expect(JSON.parse(serializeSnapshotForTxt())).toEqual({});
  });
});

describe('autoridad única de claves de credencial', () => {
  it('`integration` reexporta la lista de `common`, no una copia', () => {
    expect(REEXPORTED_KEYS).toBe(SECRET_KEYS);
  });

  it('detecta las credenciales del snapshot antes de limpiarlo', () => {
    const snapshot = snapshotWithCredentials();

    expect(containsSecrets(snapshot)).toBe(true);
    expect(containsSecrets(stripSecrets(snapshot).value)).toBe(false);
  });

  it('informa de la ruta exacta de cada credencial retirada', () => {
    const { removed } = stripSecrets(snapshotWithCredentials());

    expect(removed).toContain(
      'documents[0].pages[0].schemas[0].sisadSchemaConfig.api.http.auth.password',
    );
    expect(removed).toContain(
      'documents[0].pages[0].schemas[0].sisadSchemaConfig.api.http.auth.token',
    );
  });
});
