import { describe, expect, it } from 'vitest';
import {
  getMissingConnectionFields,
  validateApiConfig,
  validateFormConfig,
  validatePersistenceConfig,
} from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation.js';

describe('schemaConnectionsValidation', () => {
  it('flags missing persistence, api and form-json fields independently', () => {
    expect(validatePersistenceConfig({ enabled: true, key: '' })).toEqual(['storageKey']);
    expect(validateFormConfig({ enabled: true, collect: true, rootKey: '' })).toEqual(['rootKey']);
    expect(
      validateApiConfig(
        {
          enabled: true,
          endpoint: '',
          http: {
            inheritSystem: false,
            baseURL: '',
            auth: {
              mode: 'manual',
              type: 'bearer',
              headerName: '',
              token: '',
            },
          },
        },
        { inheritSystem: false, baseURL: '', auth: { mode: 'manual', headerName: '', token: '' } },
      ),
    ).toEqual(['endpoint', 'baseURL', 'auth']);
  });

  it('deduplicates connection validation issues across the combined helper', () => {
    expect(
      getMissingConnectionFields(
        { enabled: true, key: '   ' },
        { enabled: true, endpoint: '   ' },
        { enabled: true, collect: true, rootKey: '   ' },
        { inheritSystem: false, baseURL: '   ', auth: { mode: 'manual', headerName: '', token: '' } },
      ),
    ).toEqual(['storageKey', 'rootKey', 'endpoint', 'baseURL', 'auth']);
  });
});
