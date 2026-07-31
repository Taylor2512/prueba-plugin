/**
 * TASK-RUNTIME-015 — el mapa consolidado de UI responde por visibility,
 * permisos y acciones sin que cada componente recalcule reglas.
 */
import { describe, expect, it } from 'vitest';
import { buildDesignerUiMap } from '@/sisad-pdfme/ui/components/Designer/shared/designerUiConfig';

const baseOptions = {
  assignment: { enabled: true },
  collaboration: { canEditStructure: true },
  visibility: {
    actions: { reassign: true, duplicate: true, delete: false },
    modals: { assignment: true, comments: false },
    sidebars: { right: { panels: { fields: true, detail: true, comments: false, documents: true } } },
  },
};

describe('buildDesignerUiMap', () => {
  it('expone features derivadas de la config sin recalcular en componentes', () => {
    const map = buildDesignerUiMap(baseOptions);
    expect(map.features.assignmentEnabled).toBe(true);
    expect(map.features.reassignVisible).toBe(true);
    expect(map.features.commentsPanelVisible).toBe(false);
    expect(map.features.documentsPanelVisible).toBe(true);
    expect(map.permissions.canEditStructure).toBe(true);
  });

  it('resolveAction respeta visibility.actions (delete apagado)', () => {
    const map = buildDesignerUiMap(baseOptions);
    const deleteState = map.resolveAction('delete-schema', { hasHandler: true, selectionCount: 1 });
    expect(deleteState.visible).toBe(false);
    expect(deleteState.reason).toBe('hidden-by-config');

    const duplicateState = map.resolveAction('duplicate-schema', { hasHandler: true, selectionCount: 1 });
    expect(duplicateState.visible).toBe(true);
    expect(duplicateState.enabled).toBe(true);
  });

  it('reassign obedece assignment.enabled y permisos estructurales', () => {
    const disabledAssignment = buildDesignerUiMap({
      ...baseOptions,
      assignment: { enabled: false },
    });
    const state = disabledAssignment.resolveAction('reassign-recipient', {
      hasHandler: true,
      selectionCount: 2,
    });
    // assignment.enabled=false apaga reassignVisible → oculto por config.
    expect(state.visible).toBe(false);

    const noPermission = buildDesignerUiMap({
      ...baseOptions,
      collaboration: { canEditStructure: false },
    });
    const denied = noPermission.resolveAction('reassign-recipient', {
      hasHandler: true,
      selectionCount: 2,
    });
    expect(denied.enabled).toBe(false);
  });

  it('paneles y comentarios obedecen config (switch-right-panel-*)', () => {
    const map = buildDesignerUiMap(baseOptions);
    expect(map.resolveAction('switch-right-panel-comments', { hasHandler: true }).visible).toBe(false);
    expect(map.resolveAction('switch-right-panel-documents', { hasHandler: true }).visible).toBe(true);
    expect(map.resolveAction('add-comment', { hasHandler: true }).visible).toBe(false);
  });

  it('config vacía deja todo visible/habilitado por defecto', () => {
    const map = buildDesignerUiMap(undefined);
    expect(map.permissions.canEditStructure).toBe(true);
    expect(map.resolveAction('duplicate-schema', { hasHandler: true, selectionCount: 1 }).enabled).toBe(true);
    // assignment.enabled exige `true` explícito (misma regla que el toolbar).
    expect(map.features.assignmentEnabled).toBe(false);
  });
});
