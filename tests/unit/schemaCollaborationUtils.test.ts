import { describe, expect, test } from 'vitest';
import {
  joinRecipientIds,
  normalizeRecipientIds,
  resolveOwnerMode,
  buildStateTag,
} from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.js';

describe('schemaCollaborationUtils', () => {
  test('normalizes and joins recipient ids', () => {
    expect(normalizeRecipientIds([' a ', 'b', 'a'])).toEqual(['a', 'b']);
    expect(joinRecipientIds([' a ', 'b'])).toBe('a, b');
  });

  test('resolves owner mode from recipient cardinality', () => {
    expect(resolveOwnerMode([])).toBeUndefined();
    expect(resolveOwnerMode(['r1'])).toBe('single');
    expect(resolveOwnerMode(['r1', 'r2'])).toBe('multi');
  });

  test('builds semantic state tags', () => {
    expect(buildStateTag('locked')).toEqual({ label: 'Bloqueado', color: 'error' });
    expect(buildStateTag('merged')).toEqual({ label: 'Fusionado', color: 'success' });
    expect(buildStateTag('draft')).toEqual({ label: 'Borrador', color: 'default' });
  });
});
