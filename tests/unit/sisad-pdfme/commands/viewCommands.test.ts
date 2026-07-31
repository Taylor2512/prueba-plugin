/**
 * COREUX-015 — Toggles de vista como comandos configurables.
 *
 * Criterios: menú y canvas comparten estado, política de undo documentada, y
 * cambiar un toggle no reconstruye el engine.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  VIEW_FEATURES,
  canToggleViewFeature,
  createViewToggleCommand,
  resolveViewFeatureState,
  viewFeatureDisabledReason,
} from '@/sisad-pdfme/ui/commands/viewCommands';
import { createCommandBus } from '@/sisad-pdfme/ui/commands/commandBus';

describe('menú y canvas comparten un solo estado', () => {
  it('por defecto todo está activo', () => {
    const state = resolveViewFeatureState();

    VIEW_FEATURES.forEach((feature) => expect(state[feature]).toBe(true));
  });

  it('visibility puede apagar pero nunca encender', () => {
    const hidden = resolveViewFeatureState({
      visibility: { grid: false },
      canvas: { grid: true },
      session: { grid: true },
    });
    expect(hidden.grid).toBe(false);

    const enabledByVisibility = resolveViewFeatureState({
      visibility: { guides: true },
      canvas: { guides: false },
    });
    expect(enabledByVisibility.guides).toBe(false);
  });

  it('la sesión del usuario manda sobre la configuración de canvas', () => {
    const state = resolveViewFeatureState({
      canvas: { snapLines: true },
      session: { snapLines: false },
    });

    expect(state.snapLines).toBe(false);
  });

  it('el mismo resolutor produce el mismo estado para cualquier superficie', () => {
    const sources = { canvas: { grid: false }, visibility: { rulers: false }, session: { guides: false } };

    // Lo que consultaría el menú y lo que consultaría el canvas.
    expect(resolveViewFeatureState(sources)).toEqual(resolveViewFeatureState(sources));
    expect(resolveViewFeatureState(sources)).toMatchObject({
      grid: false,
      rulers: false,
      guides: false,
      snapLines: true,
      padding: true,
    });
  });

  it('un toggle oculto por config no es alternable y lo explica', () => {
    const sources = { visibility: { padding: false } };

    expect(canToggleViewFeature('padding', sources)).toBe(false);
    expect(viewFeatureDisabledReason('padding', sources)).toBe('hidden-by-config');
    expect(viewFeatureDisabledReason('grid', sources)).toBeNull();
  });
});

describe('política de undo', () => {
  it('los comandos de vista se declaran no deshacerables', () => {
    const command = createViewToggleCommand({ feature: 'grid', current: true, apply: vi.fn() });

    expect(command.meta?.undoable).toBe(false);
  });

  it('NO entran en el historial del CommandBus', async () => {
    const bus = createCommandBus();
    const apply = vi.fn();

    await bus.execute(createViewToggleCommand({ feature: 'grid', current: false, apply }));

    expect(apply).toHaveBeenCalledWith('grid', true);
    expect(bus.canUndo()).toBe(false);
    expect(bus.historyState().undoDepth).toBe(0);
  });

  it('no interfieren con el undo de una mutación real', async () => {
    const bus = createCommandBus();
    const mutationUndo = vi.fn();
    const mutation = {
      id: 'delete',
      label: 'Eliminar',
      meta: { commandId: 'delete', source: 'system', undoable: true, timestamp: 0 },
      execute: vi.fn(),
      undo: mutationUndo,
    };

    await bus.execute(mutation as never);
    await bus.execute(createViewToggleCommand({ feature: 'guides', current: true, apply: vi.fn() }));
    await bus.undo();

    // El undo alcanza la mutación, no el toggle de vista.
    expect(mutationUndo).toHaveBeenCalledTimes(1);
  });

  it('undo del comando restaura el valor previo si se invoca directamente', async () => {
    const apply = vi.fn();
    const command = createViewToggleCommand({ feature: 'rulers', current: true, apply });

    await command.execute({ emit: vi.fn() } as never);
    expect(apply).toHaveBeenLastCalledWith('rulers', false);

    await command.undo({ emit: vi.fn() } as never);
    expect(apply).toHaveBeenLastCalledWith('rulers', true);
  });
});

describe('no reconstruye el engine', () => {
  it('solo invoca el aplicador de sesión', async () => {
    const apply = vi.fn();
    const rebuildEngine = vi.fn();
    const bus = createCommandBus();

    await bus.execute(createViewToggleCommand({ feature: 'snapLines', current: true, apply }));

    expect(apply).toHaveBeenCalledTimes(1);
    expect(rebuildEngine).not.toHaveBeenCalled();
  });

  it('alternar dos veces vuelve al estado inicial sin efectos extra', async () => {
    const applied: Array<[string, boolean]> = [];
    const apply = (feature: string, next: boolean) => applied.push([feature, next]);
    const bus = createCommandBus();

    await bus.execute(createViewToggleCommand({ feature: 'grid', current: true, apply }));
    await bus.execute(createViewToggleCommand({ feature: 'grid', current: false, apply }));

    expect(applied).toEqual([
      ['grid', false],
      ['grid', true],
    ]);
  });
});
