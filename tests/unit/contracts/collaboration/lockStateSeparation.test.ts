/**
 * QH-013 — `readOnly` y `locked` son mutaciones distintas.
 *
 * Defecto que cubre este contrato: la entrada de menú rotulada "Bloquear
 * posición" estaba cableada a `toggleReadOnly`, así que bloquear la posición
 * marcaba el campo como sólo lectura y dejaba la posición libre. Los dos
 * estados que `resolveRuntimeSchemaAccess` ya distingue compartían una única
 * mutación, y `readOnly` no tenía control propio.
 */
import { describe, expect, it, vi } from 'vitest';
import type { SchemaForUI } from '../../../../src/sisad-pdfme/common';
import { createSelectionCommands } from '../../../../src/sisad-pdfme/ui/components/Designer/shared/selectionCommands';
import { DESIGNER_ACTION_ALIASES } from '../../../../src/sisad-pdfme/ui/components/Designer/shared/actionRegistry';
import { DESIGNER_SHORTCUTS } from '../../../../src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts';

const crearSchema = (overrides: Partial<SchemaForUI> = {}): SchemaForUI =>
  ({
    id: 'schema-1',
    schemaUid: 'schema-1',
    name: 'campo',
    type: 'text',
    position: { x: 0, y: 0 },
    width: 40,
    height: 10,
    ...overrides,
  }) as SchemaForUI;

/** Elemento DOM mínimo con la identidad que leen los comandos. */
const crearElemento = (schemaId: string): HTMLElement => {
  const elemento = document.createElement('div');
  elemento.dataset.schemaId = schemaId;
  elemento.dataset.pageIndex = '0';
  elemento.id = schemaId;
  return elemento;
};

const crearContexto = (schema: SchemaForUI) => {
  const changeSchemas = vi.fn();
  const contexto = {
    activeElements: [crearElemento(schema.id)],
    schemasList: [[schema]],
    pageCursor: 0,
    pageSize: { width: 210, height: 297 },
    changeSchemas,
    commitSchemas: vi.fn(),
    removeSchemas: vi.fn(),
    onOpenProperties: vi.fn(),
    collaborationContext: { canEditStructure: true },
  };
  return { contexto, changeSchemas };
};

describe('QH-013 — separación de readOnly y locked', () => {
  it('el alias visible de Bloquear posición apunta al command de posición', () => {
    expect(DESIGNER_ACTION_ALIASES['lock-position']).toBe('toggleObjectLock');
  });

  it('el shortcut L está registrado como toggleLock', () => {
    const shortcut = DESIGNER_SHORTCUTS.find((entry) => entry.id === 'toggleLock');
    expect(shortcut?.keys).toContain('l');
  });

  it('toggleObjectLock muta `locked`, nunca `readOnly`', () => {
    const schema = crearSchema();
    const { contexto, changeSchemas } = crearContexto(schema);
    createSelectionCommands(contexto as never).toggleObjectLock();

    expect(changeSchemas).toHaveBeenCalledTimes(1);
    const ops = changeSchemas.mock.calls[0][0] as Array<{ key: string; value: unknown }>;
    expect(ops.map((op) => op.key)).toEqual(['locked']);
    expect(ops[0].value).toBe(true);
  });

  it('toggleReadOnly muta `readOnly`, nunca `locked`', () => {
    const schema = crearSchema();
    const { contexto, changeSchemas } = crearContexto(schema);
    createSelectionCommands(contexto as never).toggleReadOnly();

    const ops = changeSchemas.mock.calls[0][0] as Array<{ key: string; value: unknown }>;
    expect(ops.map((op) => op.key)).toEqual(['readOnly']);
    expect(ops[0].value).toBe(true);
  });

  it('bloquear la posición no vuelve el campo de sólo lectura', () => {
    const schema = crearSchema({ readOnly: false });
    const { contexto, changeSchemas } = crearContexto(schema);
    createSelectionCommands(contexto as never).toggleObjectLock();

    const ops = changeSchemas.mock.calls[0][0] as Array<{ key: string }>;
    expect(ops.some((op) => op.key === 'readOnly')).toBe(false);
  });

  it('marcar sólo lectura no bloquea la posición', () => {
    const schema = crearSchema({ locked: false } as Partial<SchemaForUI>);
    const { contexto, changeSchemas } = crearContexto(schema);
    createSelectionCommands(contexto as never).toggleReadOnly();

    const ops = changeSchemas.mock.calls[0][0] as Array<{ key: string }>;
    expect(ops.some((op) => op.key === 'locked')).toBe(false);
  });

  it('cada estado alterna de forma independiente sobre su propio valor previo', () => {
    const yaBloqueado = crearSchema({ locked: true } as Partial<SchemaForUI>);
    const { contexto, changeSchemas } = crearContexto(yaBloqueado);
    createSelectionCommands(contexto as never).toggleObjectLock();

    const ops = changeSchemas.mock.calls[0][0] as Array<{ key: string; value: unknown }>;
    expect(ops[0].value, 'un schema ya bloqueado debe desbloquearse').toBe(false);
  });

  it('sin permiso de estructura ninguno de los dos muta', () => {
    const schema = crearSchema();
    const { contexto, changeSchemas } = crearContexto(schema);
    const sinPermiso = { ...contexto, collaborationContext: { canEditStructure: false } };
    const comandos = createSelectionCommands(sinPermiso as never);

    comandos.toggleObjectLock();
    comandos.toggleReadOnly();
    expect(changeSchemas).not.toHaveBeenCalled();
  });
});
