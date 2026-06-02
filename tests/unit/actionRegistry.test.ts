import { describe, expect, test } from 'vitest';
import type { SchemaForUI } from '@/sisad-pdfme/common/index.js';
import {
  getAction,
  getActionsForContext,
  registerAction,
  unregisterAction,
  type ActionContext,
} from '@/sisad-pdfme/ui/components/Designer/shared/actionRegistry.js';

const baseContext: ActionContext = {
  activeSchemas: [{ id: 'a1', type: 'text', name: 'Campo', content: 'Hola' } as unknown as SchemaForUI],
  selectionCount: 1,
  canEditStructure: true,
  isLocked: false,
};

describe('actionRegistry', () => {
  test('contains core inline action editText for text schema', () => {
    const action = getAction('editText');
    expect(action).toBeDefined();
    expect(action?.presentationMode).toBe('inline');
  });

  test('returns context-aware sorted actions', () => {
    const actions = getActionsForContext(baseContext, { section: 'structure' });
    expect(actions.length).toBeGreaterThan(0);
    // primary should appear before danger in sorted result
    const firstDangerIndex = actions.findIndex((a) => a.priority === 'danger');
    const firstPrimaryIndex = actions.findIndex((a) => a.priority === 'primary');
    expect(firstPrimaryIndex).toBeGreaterThanOrEqual(0);
    if (firstDangerIndex >= 0) {
      expect(firstPrimaryIndex).toBeLessThan(firstDangerIndex);
    }
  });

  test('supports dynamic register/unregister', () => {
    registerAction({
      id: 'test.custom.action',
      label: 'Custom',
      section: 'view',
      priority: 'secondary',
      presentationMode: 'hidden',
    });
    expect(getAction('test.custom.action')).toBeDefined();
    expect(unregisterAction('test.custom.action')).toBe(true);
    expect(getAction('test.custom.action')).toBeUndefined();
  });
});
