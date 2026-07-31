/**
 * COREUX-016 — Comandos de estructura de página.
 *
 * Criterios: insert/duplicate/remove deshacerables, no se elimina la última
 * página, y el snapshot hace round-trip exacto.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  applyPageStructure,
  createPageStructureCommand,
} from '@/sisad-pdfme/ui/commands/designerCommands';
import { createCommandBus } from '@/sisad-pdfme/ui/commands/commandBus';

const pages = () => [
  [{ id: 'a1', schemaUid: 'a1', name: 'campo-a', type: 'text' }],
  [{ id: 'b1', schemaUid: 'b1', name: 'campo-b', type: 'text' }],
];

describe('operación pura', () => {
  it('insert añade una página vacía después del índice', () => {
    const result = applyPageStructure(pages(), 'insert', 0);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.pages).toHaveLength(3);
    expect(result.pages[1]).toEqual([]);
    expect(result.pages[2][0].id).toBe('b1');
  });

  it('duplicate copia la página con ids únicos', () => {
    const result = applyPageStructure(pages(), 'duplicate', 0);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.pages).toHaveLength(3);

    const ids = result.pages.flat().map((schema) => schema.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(result.pages[1][0].id).not.toBe('a1');
  });

  it('remove elimina la página indicada', () => {
    const result = applyPageStructure(pages(), 'remove', 0);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0][0].id).toBe('b1');
  });

  it('no muta la entrada', () => {
    const source = pages();
    const snapshot = JSON.parse(JSON.stringify(source));

    applyPageStructure(source, 'duplicate', 0);
    applyPageStructure(source, 'remove', 1);

    expect(source).toEqual(snapshot);
  });
});

describe('no se elimina la última página', () => {
  it('rechaza remove con una sola página', () => {
    const result = applyPageStructure([[{ id: 'a1' }]], 'remove', 0);

    expect(result).toEqual({ ok: false, reason: 'last-page' });
  });

  it('rechaza índices fuera de rango con motivo propio', () => {
    expect(applyPageStructure(pages(), 'insert', 5)).toEqual({
      ok: false,
      reason: 'index-out-of-range',
    });
    expect(applyPageStructure(pages(), 'remove', -1)).toEqual({
      ok: false,
      reason: 'index-out-of-range',
    });
  });

  it('el comando devuelve la razón en vez de un comando inerte', () => {
    const result = createPageStructureCommand({
      operation: 'remove',
      pageIndex: 0,
      pages: [[{ id: 'a1' }]],
      applyPages: vi.fn(),
    });

    expect(result).toEqual({ rejection: 'last-page' });
  });
});

describe('deshacerable con round-trip exacto', () => {
  const runCommand = async (operation: 'insert' | 'duplicate' | 'remove') => {
    const bus = createCommandBus();
    let current = pages();
    const original = JSON.parse(JSON.stringify(current));

    const result = createPageStructureCommand({
      operation,
      pageIndex: 0,
      pages: current,
      applyPages: (next) => {
        current = next as typeof current;
      },
    });
    if (!('command' in result)) throw new Error('comando rechazado');

    await bus.execute(result.command);
    return { bus, get current() { return current; }, original };
  };

  (['insert', 'duplicate', 'remove'] as const).forEach((operation) => {
    it(`${operation} se deshace devolviendo el estado original`, async () => {
      const context = await runCommand(operation);

      expect(context.current).not.toEqual(context.original);
      expect(context.bus.canUndo()).toBe(true);

      await context.bus.undo();
      expect(context.current).toEqual(context.original);
    });

    it(`${operation} se rehace de forma idéntica`, async () => {
      const context = await runCommand(operation);
      const afterExecute = JSON.parse(JSON.stringify(context.current));

      await context.bus.undo();
      await context.bus.redo();

      expect(context.current).toEqual(afterExecute);
    });
  });

  it('el comando entra al historial como deshacerable', async () => {
    const context = await runCommand('insert');
    expect(context.bus.historyState()).toMatchObject({ canUndo: true, undoDepth: 1 });
  });

  it('undo/redo repetidos no acumulan deriva', async () => {
    const context = await runCommand('duplicate');
    const afterExecute = JSON.parse(JSON.stringify(context.current));

    for (let i = 0; i < 3; i += 1) {
      await context.bus.undo();
      await context.bus.redo();
    }

    expect(context.current).toEqual(afterExecute);
  });
});
