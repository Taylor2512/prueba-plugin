import { describe, expect, test } from 'vitest';
import {
  joinRecipientIds,
  normalizeRecipientIds,
  resolveOwnerMode,
  buildStateTag,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.js';

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
    // draft (y cualquier estado no bloqueado/fusionado) se muestra como disponible.
    expect(buildStateTag('draft')).toEqual({ label: 'Disponible', color: 'warning' });
    expect(buildStateTag(undefined)).toEqual({ label: 'Disponible', color: 'warning' });
  });
});
