import { describe, expect, test } from 'vitest';
import {
  validatePersistenceConfig,
  validateFormConfig,
  validateApiConfig,
  getMissingConnectionFields,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation.js';

describe('schemaConnectionsValidation', () => {
  test('validates missing persistence storage key', () => {
    expect(validatePersistenceConfig({ enabled: true })).toEqual(['storageKey']);
    expect(validatePersistenceConfig({ enabled: true, key: 'field_name' })).toEqual([]);
  });

  test('validates form rootKey only when collect is enabled', () => {
    expect(validateFormConfig({ enabled: true, collect: true })).toEqual(['rootKey']);
    expect(validateFormConfig({ enabled: true, collect: true, rootKey: 'payload' })).toEqual([]);
    expect(validateFormConfig({ enabled: true, collect: false })).toEqual([]);
  });

  test('validates api endpoint/baseURL/auth constraints', () => {
    expect(
      validateApiConfig(
        { enabled: true },
        {
          inheritSystem: false,
          auth: { mode: 'manual', type: 'apiKey', headerName: '', headerValue: '' },
        },
      ),
    ).toEqual(expect.arrayContaining(['endpoint', 'baseURL', 'auth']));

    expect(
      validateApiConfig(
        { enabled: true, endpoint: '/api/form' },
        {
          inheritSystem: true,
          auth: { mode: 'inherit' },
        },
      ),
    ).toEqual([]);
  });

  test('aggregates missing fields without duplicates', () => {
    const missing = getMissingConnectionFields(
      { enabled: true },
      { enabled: true },
      { enabled: true, collect: true },
      { inheritSystem: false, auth: { mode: 'manual', type: 'bearer', token: '' } },
    );

    expect(new Set(missing).size).toBe(missing.length);
    expect(missing).toEqual(expect.arrayContaining(['storageKey', 'endpoint', 'baseURL', 'rootKey', 'auth']));
  });
});
