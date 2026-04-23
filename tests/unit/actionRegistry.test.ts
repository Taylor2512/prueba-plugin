import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerAction,
  registerActions,
  getAction,
  getActions,
  getActionsForContext,
  unregisterAction,
  clearActionRegistry,
  type SchemaActionDefinition,
  type ActionContext,
} from '../../src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.js';

// We reset only the test-registered actions using a prefix to avoid touching
// core actions registered at module load time.
const TEST_PREFIX = '__test__';

const makeAction = (overrides: Partial<SchemaActionDefinition> = {}): SchemaActionDefinition => ({
  id: `${TEST_PREFIX}_${Math.random().toString(36).slice(2)}`,
  label: 'Test action',
  ...overrides,
});

const makeContext = (overrides: Partial<ActionContext> = {}): ActionContext => ({
  activeSchemas: [],
  selectionCount: 0,
  canEditStructure: true,
  ...overrides,
});

describe('actionRegistry', () => {
  // Clean up test-registered actions after each test so the core registry is
  // never polluted.
  const testIds: string[] = [];
  beforeEach(() => {
    for (const id of testIds.splice(0)) {
      unregisterAction(id);
    }
  });

  describe('registerAction / getAction', () => {
    it('registers a new action and retrieves it by id', () => {
      const action = makeAction({ id: `${TEST_PREFIX}_reg_1`, label: 'My action' });
      testIds.push(action.id);
      registerAction(action);
      expect(getAction(action.id)).toMatchObject({ id: action.id, label: 'My action' });
    });

    it('overwrites an existing action with the same id', () => {
      const id = `${TEST_PREFIX}_overwrite`;
      testIds.push(id);
      registerAction(makeAction({ id, label: 'First' }));
      registerAction(makeAction({ id, label: 'Second' }));
      expect(getAction(id)?.label).toBe('Second');
    });

    it('returns undefined for an unregistered id', () => {
      expect(getAction('__nonexistent__')).toBeUndefined();
    });
  });

  describe('registerActions (batch)', () => {
    it('registers multiple actions in one call', () => {
      const a1 = makeAction({ id: `${TEST_PREFIX}_batch_a`, label: 'Batch A' });
      const a2 = makeAction({ id: `${TEST_PREFIX}_batch_b`, label: 'Batch B' });
      testIds.push(a1.id, a2.id);
      registerActions([a1, a2]);
      expect(getAction(a1.id)?.label).toBe('Batch A');
      expect(getAction(a2.id)?.label).toBe('Batch B');
    });
  });

  describe('unregisterAction', () => {
    it('removes a registered action', () => {
      const action = makeAction({ id: `${TEST_PREFIX}_remove` });
      registerAction(action);
      expect(unregisterAction(action.id)).toBe(true);
      expect(getAction(action.id)).toBeUndefined();
    });

    it('returns false when the id is not registered', () => {
      expect(unregisterAction('__not_registered__')).toBe(false);
    });
  });

  describe('getActions (filter)', () => {
    it('returns all registered actions when no filter is supplied', () => {
      const all = getActions();
      // At minimum the core actions are present
      expect(all.length).toBeGreaterThan(0);
    });

    it('filters by section', () => {
      const id = `${TEST_PREFIX}_section_filter`;
      testIds.push(id);
      registerAction(makeAction({ id, section: 'custom-section' }));
      const results = getActions({ section: 'custom-section' });
      expect(results.every((a) => a.section === 'custom-section')).toBe(true);
      expect(results.some((a) => a.id === id)).toBe(true);
    });

    it('filters by presentationMode', () => {
      const id = `${TEST_PREFIX}_pm_filter`;
      testIds.push(id);
      registerAction(makeAction({ id, presentationMode: 'modal' }));
      const modals = getActions({ presentationMode: 'modal' });
      expect(modals.every((a) => a.presentationMode === 'modal')).toBe(true);
      expect(modals.some((a) => a.id === id)).toBe(true);
    });

    it('filters by priority', () => {
      const id = `${TEST_PREFIX}_prio_filter`;
      testIds.push(id);
      registerAction(makeAction({ id, priority: 'danger' }));
      const dangers = getActions({ priority: 'danger' });
      expect(dangers.every((a) => a.priority === 'danger')).toBe(true);
      expect(dangers.some((a) => a.id === id)).toBe(true);
    });
  });

  describe('getActionsForContext', () => {
    it('excludes actions whose isVisible returns false', () => {
      const id = `${TEST_PREFIX}_invisible`;
      testIds.push(id);
      registerAction(makeAction({ id, isVisible: () => false }));
      const ctx = makeContext();
      const results = getActionsForContext(ctx);
      expect(results.some((a) => a.id === id)).toBe(false);
    });

    it('includes actions whose isVisible returns true', () => {
      const id = `${TEST_PREFIX}_visible`;
      testIds.push(id);
      registerAction(makeAction({ id, isVisible: () => true }));
      const ctx = makeContext();
      const results = getActionsForContext(ctx);
      expect(results.some((a) => a.id === id)).toBe(true);
    });

    it('excludes actions that do not support the active schema type', () => {
      const id = `${TEST_PREFIX}_type_filter`;
      testIds.push(id);
      registerAction(makeAction({ id, supportsSchemaTypes: ['checkbox'] }));
      const ctx = makeContext({
        activeSchemas: [{ id: 's1', type: 'text', name: 'x', position: { x: 0, y: 0 }, width: 10, height: 10 } as never],
      });
      const results = getActionsForContext(ctx);
      expect(results.some((a) => a.id === id)).toBe(false);
    });

    it('includes actions that support the active schema type', () => {
      const id = `${TEST_PREFIX}_type_match`;
      testIds.push(id);
      registerAction(makeAction({ id, supportsSchemaTypes: ['text'] }));
      const ctx = makeContext({
        activeSchemas: [{ id: 's1', type: 'text', name: 'x', position: { x: 0, y: 0 }, width: 10, height: 10 } as never],
      });
      const results = getActionsForContext(ctx);
      expect(results.some((a) => a.id === id)).toBe(true);
    });

    it('sorts results: primary before secondary before danger', () => {
      const base = `${TEST_PREFIX}_sort`;
      const idP = `${base}_primary`;
      const idS = `${base}_secondary`;
      const idD = `${base}_danger`;
      testIds.push(idP, idS, idD);
      // Register in reverse priority order to confirm sorting
      registerAction(makeAction({ id: idD, priority: 'danger', section: 'sort-test' }));
      registerAction(makeAction({ id: idS, priority: 'secondary', section: 'sort-test' }));
      registerAction(makeAction({ id: idP, priority: 'primary', section: 'sort-test' }));

      const ctx = makeContext();
      const results = getActionsForContext(ctx, { section: 'sort-test' });
      const positions = [idP, idS, idD].map((id) => results.findIndex((a) => a.id === id));
      expect(positions[0]).toBeLessThan(positions[1]);
      expect(positions[1]).toBeLessThan(positions[2]);
    });
  });

  describe('core actions pre-registration', () => {
    it('pre-registers the duplicate action', () => {
      expect(getAction('duplicate')).toMatchObject({ id: 'duplicate', priority: 'primary' });
    });

    it('pre-registers the delete action as danger priority', () => {
      expect(getAction('delete')).toMatchObject({ id: 'delete', priority: 'danger' });
    });

    it('pre-registers addComment action with modal presentationMode', () => {
      expect(getAction('addComment')).toMatchObject({ id: 'addComment', presentationMode: 'modal' });
    });

    it('pre-registers openConnections with modal presentationMode', () => {
      expect(getAction('openConnections')).toMatchObject({ id: 'openConnections', presentationMode: 'modal' });
    });
  });
});
