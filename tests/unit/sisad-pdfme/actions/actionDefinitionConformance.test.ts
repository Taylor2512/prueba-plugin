/**
 * COREUX-011 — Una acción, una definición.
 *
 * La unificación entre `actionConfigRegistry` (config) y `actionRegistry` (UI)
 * ya está implementada; estas pruebas son el gate que impide que vuelvan a
 * divergir, y fijan los tres invariantes de la task-card:
 *
 *   1. cada acción tiene exactamente una definición resoluble;
 *   2. sin handler, la acción no se renderiza;
 *   3. una acción deshabilitada SIEMPRE lleva motivo.
 */
import { describe, expect, it } from 'vitest';
import {
  DESIGNER_ACTION_ALIASES,
  listActionDefinitions,
  resolveActionDefinition,
} from '@/sisad-pdfme/ui/components/Designer/shared/actionRegistry';
import {
  describeDisabledReason,
  getDesignerActionDescriptor,
  resolveDesignerActionState,
} from '@/sisad-pdfme/ui/components/Designer/shared/designerActionState';

const allActionIds = () => listActionDefinitions().map((definition) => definition.id);

describe('una acción tiene una definición', () => {
  it('el registry no está vacío', () => {
    expect(allActionIds().length).toBeGreaterThan(30);
  });

  it('no hay ids duplicados', () => {
    const ids = allActionIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toda acción registrada es resoluble por id', () => {
    allActionIds().forEach((id) => {
      expect(resolveActionDefinition(id), `sin definición: ${id}`).toBeDefined();
    });
  });

  it('todo alias apunta a una definición existente', () => {
    Object.entries(DESIGNER_ACTION_ALIASES).forEach(([alias, target]) => {
      expect(
        resolveActionDefinition(alias) ?? resolveActionDefinition(String(target)),
        `alias huérfano: ${alias} → ${String(target)}`,
      ).toBeDefined();
    });
  });

  it('toda acción expone descriptor con etiqueta', () => {
    allActionIds().forEach((id) => {
      const descriptor = getDesignerActionDescriptor(id);
      expect(descriptor, `sin descriptor: ${id}`).not.toBeNull();
      expect(descriptor?.label, `sin label: ${id}`).toBeTruthy();
    });
  });
});

describe('sin handler no se renderiza', () => {
  it('una acción sin callback queda invisible con motivo', () => {
    const state = resolveDesignerActionState('copy', { hasHandler: false });

    expect(state.visible).toBe(false);
    expect(state.enabled).toBe(false);
    expect(state.reason).toBe('missing-handler');
  });

  it('vale para todas las acciones del registry', () => {
    allActionIds().forEach((id) => {
      const state = resolveDesignerActionState(id, { hasHandler: false });
      expect(state.visible, `visible sin handler: ${id}`).toBe(false);
    });
  });
});

describe('deshabilitado siempre lleva motivo', () => {
  it('ninguna combinación produce disabled sin reason', () => {
    const contexts = [
      { hasHandler: false },
      { visibleByConfig: false },
      { enabledByConfig: false },
      { enabledByConfig: false, disabledReason: 'assignment-off' },
      { selectionCount: 0 },
      { selectionCount: 0, canEditStructure: false },
    ];

    allActionIds().forEach((id) => {
      contexts.forEach((context) => {
        const state = resolveDesignerActionState(id, context as never);
        if (!state.enabled) {
          expect(state.reason, `sin motivo: ${id} / ${JSON.stringify(context)}`).not.toBeNull();
        }
      });
    });
  });

  it('habilitada implica reason null', () => {
    allActionIds().forEach((id) => {
      const state = resolveDesignerActionState(id, { hasHandler: true, selectionCount: 1 } as never);
      if (state.enabled) expect(state.reason, `reason con enabled: ${id}`).toBeNull();
    });
  });

  it('el motivo explícito gana sobre el derivado', () => {
    // La visibilidad se evalúa antes que el enabled, así que la acción tiene
    // que ser visible para que el motivo explícito llegue a aplicarse.
    const state = resolveDesignerActionState('copy', {
      hasHandler: true,
      selectionCount: 1,
      enabledByConfig: false,
      disabledReason: 'clipboard-empty',
    } as never);

    expect(state.visible).toBe(true);
    expect(state.reason).toBe('clipboard-empty');
  });

  it('todo motivo tiene texto legible para tooltip', () => {
    const reasons = [
      'missing-handler',
      'hidden-by-config',
      'hidden-by-rule',
      'disabled-by-config',
      'disabled-by-rule',
    ] as const;

    reasons.forEach((reason) => {
      const text = describeDisabledReason(reason);
      expect(text, `sin texto: ${reason}`).toBeTruthy();
      expect(typeof text).toBe('string');
    });
  });
});

describe('orden de precedencia', () => {
  it('handler ausente gana sobre config visible', () => {
    const state = resolveDesignerActionState('copy', {
      hasHandler: false,
      visibleByConfig: false,
    });

    expect(state.reason).toBe('missing-handler');
  });

  it('config visible gana sobre config enabled', () => {
    const state = resolveDesignerActionState('copy', {
      hasHandler: true,
      selectionCount: 1,
      visibleByConfig: false,
      enabledByConfig: false,
    } as never);

    expect(state.reason).toBe('hidden-by-config');
  });
});
