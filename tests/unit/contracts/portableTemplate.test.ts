import { describe, expect, it } from 'vitest';
import {
  PORTABLE_TEMPLATE_FORMAT,
  PORTABLE_TEMPLATE_SCHEMA_VERSION,
  ingestPortableTemplate,
  normalizePortableTemplate,
  parsePortableTemplate,
  serializePortableTemplate,
  validateSisadPdfmeTemplate,
} from '@/sisad-pdfme/shared/portableTemplate';

describe('portable Template JSON contract', () => {
  it('keeps schemaVersion inside content and migrates legacy shape', () => {
    const result = normalizePortableTemplate({ schemas: [], basePdf: { width: 100, height: 100 } });
    expect(result.valid).toBe(true);
    expect(result.migrated).toBe(true);
    expect(result.outcome).toBe('MIGRATED');
    expect(result.template?.format).toBe(PORTABLE_TEMPLATE_FORMAT);
    expect(result.template?.schemaVersion).toBe(PORTABLE_TEMPLATE_SCHEMA_VERSION);
  });

  it('rejects unsupported versions and runtime values', () => {
    const unsupported = normalizePortableTemplate({
      format: PORTABLE_TEMPLATE_FORMAT,
      schemaVersion: 9,
      template: { id: 't1', name: 'x' },
      documents: [],
      users: [],
      schemas: [],
      assignments: [],
      settings: {},
    });
    expect(unsupported.valid).toBe(false);
    expect(unsupported.outcome).toBe('UNSUPPORTED');

    const invalidJson = normalizePortableTemplate({
      format: PORTABLE_TEMPLATE_FORMAT,
      schemaVersion: PORTABLE_TEMPLATE_SCHEMA_VERSION,
      template: { id: 't1', name: 'x', bad: () => 1 },
      documents: [],
      users: [],
      schemas: [],
      assignments: [],
      settings: {},
    });
    expect(invalidJson.valid).toBe(false);
    expect(invalidJson.issues).toContain('Template payload contains non JSON-safe values.');
  });

  it('serializes deterministically and parses back', () => {
    const first = serializePortableTemplate({
      z: 1,
      a: { y: true, x: 2 },
      format: PORTABLE_TEMPLATE_FORMAT,
      schemaVersion: PORTABLE_TEMPLATE_SCHEMA_VERSION,
      template: { id: 't1', name: 'Contrato' },
      documents: [],
      users: [],
      schemas: [],
      assignments: [],
      settings: {},
    });
    const second = serializePortableTemplate({
      a: { x: 2, y: true },
      z: 1,
      settings: {},
      assignments: [],
      schemas: [],
      users: [],
      documents: [],
      template: { name: 'Contrato', id: 't1' },
      schemaVersion: PORTABLE_TEMPLATE_SCHEMA_VERSION,
      format: PORTABLE_TEMPLATE_FORMAT,
    });
    expect(first).toBe(second);
    expect(parsePortableTemplate(first).valid).toBe(true);
  });

  it('returns structured orphan-reference issues in validator', () => {
    const validation = validateSisadPdfmeTemplate({
      format: PORTABLE_TEMPLATE_FORMAT,
      schemaVersion: PORTABLE_TEMPLATE_SCHEMA_VERSION,
      template: { id: 't1', name: 'Contrato' },
      documents: [{ id: 'd1', name: 'Doc', order: 0 }],
      users: [{ id: 'u1', displayName: 'Alice' }],
      schemas: [{ schemaUid: 's1', documentId: 'missing' }],
      assignments: [{ id: 'a1', schemaUid: 'missing-schema', userIds: ['missing-user'] }],
      settings: {},
    });
    expect(validation.valid).toBe(false);
    expect(validation.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['ORPHAN_REFERENCE']),
    );
  });

  it('rejects duplicate schemaUid and invalid schema page/type shape', () => {
    const validation = validateSisadPdfmeTemplate({
      format: PORTABLE_TEMPLATE_FORMAT,
      schemaVersion: PORTABLE_TEMPLATE_SCHEMA_VERSION,
      template: { id: 't1', name: 'Contrato' },
      documents: [{ id: 'd1', name: 'Doc', order: 0 }],
      users: [{ id: 'u1', displayName: 'Alice' }],
      schemas: [
        { schemaUid: 's1', type: 'text', pageIndex: 0, documentId: 'd1' },
        { schemaUid: 's1', type: '', pageIndex: -1, documentId: 'd1' },
      ],
      assignments: [],
      settings: {},
    });
    expect(validation.valid).toBe(false);
    expect(validation.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['DUPLICATE_ID', 'INVALID_ENTITY_SHAPE']),
    );
  });

  it('fails closed for schema types unknown to the live registry', () => {
    const validation = validateSisadPdfmeTemplate({
      format: PORTABLE_TEMPLATE_FORMAT,
      schemaVersion: PORTABLE_TEMPLATE_SCHEMA_VERSION,
      template: { id: 't1', name: 'Contrato' },
      documents: [{ id: 'd1', name: 'Doc', order: 0 }],
      users: [{ id: 'u1', displayName: 'Alice' }],
      schemas: [{ schemaUid: 's1', type: 'not-registered', pageIndex: 0, documentId: 'd1' }],
      assignments: [],
      settings: {},
    });
    expect(validation.valid).toBe(false);
    expect(validation.issues.map((issue) => issue.code)).toContain('UNSUPPORTED_SCHEMA_TYPE');
  });

  it('runs fail-closed ingest pipeline with hydration trace', () => {
    const result = ingestPortableTemplate({
      format: PORTABLE_TEMPLATE_FORMAT,
      schemaVersion: PORTABLE_TEMPLATE_SCHEMA_VERSION,
      template: { id: 't1', name: 'Contrato' },
      documents: [{ id: 'd1', name: 'Doc', order: 0 }],
      users: [{ id: 'u1', displayName: 'Alice' }],
      schemas: [{ schemaUid: 's1', type: 'text', pageIndex: 0, documentId: 'd1' }],
      assignments: [{ id: 'a1', schemaUid: 's1', userIds: ['u1'] }],
      settings: {},
    });

    expect(result.valid).toBe(true);
    expect(result.outcome).toBe('VALID');
    expect(result.hydrated?.schemas[0]?.schemaUid).toBe('s1');
    expect(result.trace.map((step) => `${step.stage}:${step.status}`)).toEqual([
      'parse:skipped',
      'identify:ok',
      'migrate:skipped',
      'validate:ok',
      'hydrate:ok',
    ]);
  });

  it('marks hydrate skipped for unsupported or malformed ingest payload', () => {
    const unsupported = ingestPortableTemplate({
      format: PORTABLE_TEMPLATE_FORMAT,
      schemaVersion: 99,
      template: { id: 't1', name: 'Contrato' },
      documents: [],
      users: [],
      schemas: [],
      assignments: [],
      settings: {},
    });
    expect(unsupported.valid).toBe(false);
    expect(unsupported.outcome).toBe('UNSUPPORTED');
    expect(unsupported.hydrated).toBeNull();
    expect(unsupported.trace.find((step) => step.stage === 'hydrate')?.status).toBe('skipped');

    const malformed = ingestPortableTemplate('{ bad json');
    expect(malformed.valid).toBe(false);
    expect(malformed.hydrated).toBeNull();
    expect(malformed.trace.find((step) => step.stage === 'parse')?.status).toBe('failed');
  });
});
