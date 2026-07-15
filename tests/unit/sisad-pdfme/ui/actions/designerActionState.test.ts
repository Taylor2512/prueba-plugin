/**
 * TASK-ACTIONS-002 / TASK-QA-015 — contrato único de estado de acciones:
 * sin handler no se renderiza; deshabilitado siempre con razón; Reasignar usa
 * el mismo estado en todas las superficies.
 */
import { describe, expect, it } from 'vitest';
import {
  describeDisabledReason,
  getDesignerActionDescriptor,
  resolveDesignerActionState,
} from '@/sisad-pdfme/ui/components/Designer/shared/designerActionState';

describe('resolveDesignerActionState', () => {
  it('un botón sin handler no puede renderizarse', () => {
    const state = resolveDesignerActionState('save', { hasHandler: false });
    expect(state.visible).toBe(false);
    expect(state.enabled).toBe(false);
    expect(state.reason).toBe('missing-handler');
  });

  it('la config puede ocultar una acción (visibility.actions)', () => {
    const state = resolveDesignerActionState('reassign-recipient', {
      hasHandler: true,
      visibleByConfig: false,
      selectionCount: 2,
    });
    expect(state.visible).toBe(false);
    expect(state.reason).toBe('hidden-by-config');
  });

  it('reassign-recipient exige selección y permiso estructural', () => {
    expect(
      resolveDesignerActionState('reassign-recipient', { hasHandler: true, selectionCount: 0 }),
    ).toMatchObject({ visible: false, reason: 'hidden-by-rule' });

    expect(
      resolveDesignerActionState('reassign-recipient', {
        hasHandler: true,
        selectionCount: 2,
        canEditStructure: false,
      }),
    ).toMatchObject({ visible: true, enabled: false, reason: 'disabled-by-rule' });

    expect(
      resolveDesignerActionState('reassign-recipient', {
        hasHandler: true,
        selectionCount: 2,
        canEditStructure: true,
      }),
    ).toMatchObject({ visible: true, enabled: true, reason: null });
  });

  it('enabledByConfig=false deja el botón visible pero deshabilitado con razón', () => {
    const state = resolveDesignerActionState('reassign-recipient', {
      hasHandler: true,
      selectionCount: 1,
      enabledByConfig: false,
      disabledReason: 'assignment.enabled=false',
    });
    expect(state.visible).toBe(true);
    expect(state.enabled).toBe(false);
    expect(state.reason).toBe('assignment.enabled=false');
  });

  it('resuelve alias kebab-case hacia definiciones legacy del registry', () => {
    expect(getDesignerActionDescriptor('duplicate-schema')?.id).toBe('duplicate');
    expect(getDesignerActionDescriptor('fit-to-page')?.id).toBe('fitPage');
    expect(getDesignerActionDescriptor('lock-position')?.label).toBe('Bloquear posición');

    const duplicate = resolveDesignerActionState('duplicate-schema', {
      hasHandler: true,
      canEditStructure: false,
    });
    expect(duplicate.enabled).toBe(false);
    expect(duplicate.reason).toBe('disabled-by-rule');
  });

  it('acciones de chrome quedan registradas (save/undo/redo/panel switcher)', () => {
    ['save', 'more', 'undo', 'redo', 'set-zoom', 'toggle-left-sidebar', 'toggle-right-sidebar',
      'switch-right-panel-fields', 'switch-right-panel-detail', 'unlock-position', 'release-edit']
      .forEach((id) => {
        expect(getDesignerActionDescriptor(id), id).not.toBeNull();
      });
  });

  it('describeDisabledReason produce texto legible', () => {
    expect(describeDisabledReason('missing-handler')).toBe('Acción no disponible');
    expect(describeDisabledReason('disabled-by-config')).toBe('Deshabilitado por configuración');
    expect(describeDisabledReason(null)).toBe('');
  });
});
