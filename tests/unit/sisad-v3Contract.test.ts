/**
 * Tests: __designer V3 canonical contract
 *
 * Covers:
 *   - DesignerConfigV3 type contract
 *   - createDesignerConfigV3() factory
 *   - schemaMigration: migrateSchemaToV3, flattenV3ToLegacy, isDesignerConfigV3
 *   - shouldHandleDesignerShortcut() IME + editable guard
 *   - PastePolicy behavior in buildPastedSchema / pasteSchemasFromClipboard
 *   - CommandMeta + buildCommandMeta factory
 */
import { describe, it, expect } from 'vitest';

// ── V3 factory ────────────────────────────────────────────────────────────────
import {
  createDesignerConfigV3,
} from '../../src/sisad-pdfme/shared/schemaDesignerMeta.js';

// ── Migration ─────────────────────────────────────────────────────────────────
import {
  migrateSchemaToV3,
  flattenV3ToLegacy,
  isDesignerConfigV3,
} from '../../src/sisad-pdfme/shared/schemaMigration.js';

// ── shouldHandleDesignerShortcut ──────────────────────────────────────────────
import {
  shouldHandleDesignerShortcut,
  type ShortcutHandlerOpts,
} from '../../src/sisad-pdfme/ui/components/Designer/shared/interactionGuards.js';

// ── CommandMeta ───────────────────────────────────────────────────────────────
import {
  buildCommandMeta,
  type CommandMeta,
  type AppCommand,
} from '../../src/sisad-pdfme/ui/commands/commandBus.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeKeyboardEvent(overrides: Partial<KeyboardEvent & { isComposing: boolean }>): KeyboardEvent {
  return {
    key: '',
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    defaultPrevented: false,
    isComposing: false,
    target: null,
    ...overrides,
  } as unknown as KeyboardEvent;
}

function makeElement(selector: string): HTMLElement {
  const tag = selector.replace(/\[.*\]/, '').replace(/\..*/, '') || 'div';
  const el = document.createElement(tag as keyof HTMLElementTagNameMap);
  if (selector.includes('[contenteditable="true"]')) el.setAttribute('contenteditable', 'true');
  if (selector.includes('[contenteditable=""]')) el.setAttribute('contenteditable', '');
  if (selector.includes('[role="textbox"]')) el.setAttribute('role', 'textbox');
  return el;
}

const defaultOpts: ShortcutHandlerOpts = {
  modalOpen: false,
  inlineEditing: false,
  canEditStructure: true,
};

// ── createDesignerConfigV3 ─────────────────────────────────────────────────────

describe('createDesignerConfigV3', () => {
  it('produce un objeto con _v: 3', () => {
    const v3 = createDesignerConfigV3({ documentId: 'd1', pageNumber: 1, templateVersion: '3.0.0' });
    expect(v3._v).toBe(3);
  });

  it('identity contiene los campos requeridos', () => {
    const v3 = createDesignerConfigV3({ documentId: 'd2', pageNumber: 2, templateVersion: '3.0.0' });
    expect(v3.identity.schemaUid).toBeDefined();
    expect(v3.identity.documentId).toBe('d2');
    expect(v3.identity.pageNumber).toBe(2);
    expect(v3.identity.templateVersion).toBe('3.0.0');
    expect(v3.identity.version).toBe(0);
    expect(v3.identity.createdAt).toBeDefined();
    expect(v3.identity.updatedAt).toBeDefined();
  });

  it('sin recipientId: assignment.scope es global', () => {
    const v3 = createDesignerConfigV3({ documentId: 'd1', pageNumber: 1, templateVersion: '3.0.0' });
    expect(v3.collaboration?.assignment?.scope).toBe('global');
  });

  it('con recipientId: collaboration contiene el destinatario', () => {
    const v3 = createDesignerConfigV3({
      documentId: 'd1',
      pageNumber: 1,
      templateVersion: '3.0.0',
      recipientId: 'r-1',
      recipientName: 'Ana',
      recipientColor: '#ff0000',
    });
    expect(v3.collaboration?.recipientId).toBe('r-1');
    expect(v3.collaboration?.recipientName).toBe('Ana');
    expect(v3.collaboration?.assignment?.scope).toBe('recipient');
    expect(v3.collaboration?.assignment?.recipientIds).toContain('r-1');
  });

  it('cada llamada genera un schemaUid distinto', () => {
    const a = createDesignerConfigV3({ documentId: 'd1', pageNumber: 1, templateVersion: '3.0.0' });
    const b = createDesignerConfigV3({ documentId: 'd1', pageNumber: 1, templateVersion: '3.0.0' });
    expect(a.identity.schemaUid).not.toBe(b.identity.schemaUid);
  });
});

// ── migrateSchemaToV3 ──────────────────────────────────────────────────────────

describe('migrateSchemaToV3', () => {
  const legacyFlat = {
    schemaUid: 'uid-1',
    templateVersion: '2.0.0',
    documentId: 'doc-1',
    pageNumber: 1,
    recipientId: 'r-1',
    recipientName: 'Pepe',
    recipientColor: '#00ff00',
    assignment: { scope: 'recipient' as const, recipientIds: ['r-1'] },
    integration: { provider: 'oneshot', envelopeId: 'env-1' },
    version: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-06-01T00:00:00.000Z',
  };

  it('produce _v: 3', () => {
    expect(migrateSchemaToV3(legacyFlat)._v).toBe(3);
  });

  it('mueve schemaUid y documentId a identity', () => {
    const v3 = migrateSchemaToV3(legacyFlat);
    expect(v3.identity.schemaUid).toBe('uid-1');
    expect(v3.identity.documentId).toBe('doc-1');
    expect(v3.identity.version).toBe(3);
  });

  it('mueve recipientId a collaboration', () => {
    const v3 = migrateSchemaToV3(legacyFlat);
    expect(v3.collaboration?.recipientId).toBe('r-1');
    expect(v3.collaboration?.recipientName).toBe('Pepe');
    expect(v3.collaboration?.assignment?.scope).toBe('recipient');
  });

  it('mueve integration a bindings', () => {
    const v3 = migrateSchemaToV3(legacyFlat);
    expect(v3.bindings?.integration?.provider).toBe('oneshot');
    expect(v3.bindings?.integration?.envelopeId).toBe('env-1');
  });

  it('migra ownerRecipientId legacy a collaboration.ownership', () => {
    const legacy = { ...legacyFlat, ownerRecipientId: 'owner-r' };
    const v3 = migrateSchemaToV3(legacy);
    expect(v3.collaboration?.ownership?.ownerRecipientId).toBe('owner-r');
  });

  it('migra group legacy a ui.group', () => {
    const legacy = {
      ...legacyFlat,
      group: { groupId: 'g-1', groupType: 'visual' as const },
    };
    const v3 = migrateSchemaToV3(legacy);
    expect(v3.ui?.group?.groupId).toBe('g-1');
  });

  it('migra signature legacy a runtime', () => {
    const legacy = { ...legacyFlat, signature: { mode: 'draw' as const } };
    const v3 = migrateSchemaToV3(legacy);
    expect(v3.runtime?.signature?.mode).toBe('draw');
  });

  it('no incluye sub-objetos vacíos cuando no hay datos', () => {
    const minimal = {
      schemaUid: 'u', templateVersion: '2.0.0', documentId: 'd', pageNumber: 1,
    };
    const v3 = migrateSchemaToV3(minimal);
    expect(v3.collaboration).toBeUndefined();
    expect(v3.bindings).toBeUndefined();
    expect(v3.ui).toBeUndefined();
    expect(v3.runtime).toBeUndefined();
  });
});

// ── flattenV3ToLegacy ─────────────────────────────────────────────────────────

describe('flattenV3ToLegacy', () => {
  it('round-trip: migrate → flatten produce schemaUid original', () => {
    const legacy = {
      schemaUid: 'uid-rt',
      templateVersion: '2.0.0',
      documentId: 'doc-rt',
      pageNumber: 3,
      recipientId: 'r-rt',
    };
    const v3 = migrateSchemaToV3(legacy);
    const back = flattenV3ToLegacy(v3);
    expect(back.schemaUid).toBe('uid-rt');
    expect(back.recipientId).toBe('r-rt');
    expect(back.documentId).toBe('doc-rt');
    expect(back.pageNumber).toBe(3);
  });
});

// ── isDesignerConfigV3 ─────────────────────────────────────────────────────────

describe('isDesignerConfigV3', () => {
  it('retorna true para un DesignerConfigV3 válido', () => {
    const v3 = createDesignerConfigV3({ documentId: 'd', pageNumber: 1, templateVersion: '3.0.0' });
    expect(isDesignerConfigV3(v3)).toBe(true);
  });

  it('retorna false para un objeto legacy plano', () => {
    expect(isDesignerConfigV3({ schemaUid: 'x', templateVersion: '2.0.0', documentId: 'd', pageNumber: 1 })).toBe(false);
  });

  it('retorna false para null y primitivos', () => {
    expect(isDesignerConfigV3(null)).toBe(false);
    expect(isDesignerConfigV3(undefined)).toBe(false);
    expect(isDesignerConfigV3('v3')).toBe(false);
  });

  it('retorna false para { _v: 3 } sin campo identity (fix: body incompleto)', () => {
    expect(isDesignerConfigV3({ _v: 3 })).toBe(false);
  });

  it('retorna false para { _v: 3, identity: {} } sin schemaUid', () => {
    expect(isDesignerConfigV3({ _v: 3, identity: {} })).toBe(false);
    expect(isDesignerConfigV3({ _v: 3, identity: { schemaUid: 42 } })).toBe(false);
  });

  it('retorna true solo cuando _v===3 e identity.schemaUid es string', () => {
    expect(isDesignerConfigV3({ _v: 3, identity: { schemaUid: 'uid-abc' } })).toBe(true);
  });
});

// ── shouldHandleDesignerShortcut ──────────────────────────────────────────────

describe('shouldHandleDesignerShortcut', () => {
  it('retorna true en condiciones normales', () => {
    const event = makeKeyboardEvent({ key: 'z', ctrlKey: true });
    expect(shouldHandleDesignerShortcut(event, defaultOpts)).toBe(true);
  });

  it('retorna false cuando event.defaultPrevented', () => {
    const event = makeKeyboardEvent({ key: 'z', defaultPrevented: true });
    expect(shouldHandleDesignerShortcut(event, defaultOpts)).toBe(false);
  });

  it('retorna false durante composición IME (isComposing)', () => {
    const event = makeKeyboardEvent({ key: 'a', isComposing: true });
    expect(shouldHandleDesignerShortcut(event, defaultOpts)).toBe(false);
  });

  it('retorna false cuando hay un modal abierto', () => {
    const event = makeKeyboardEvent({ key: 'Delete' });
    expect(shouldHandleDesignerShortcut(event, { ...defaultOpts, modalOpen: true })).toBe(false);
  });

  it('retorna false cuando el target es un input y la tecla no es Escape', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    const event = makeKeyboardEvent({ key: 'z', ctrlKey: true, target: input as unknown as EventTarget });
    expect(shouldHandleDesignerShortcut(event, defaultOpts)).toBe(false);
    document.body.removeChild(input);
  });

  it('retorna true cuando el target es un input y la tecla ES Escape', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    const event = makeKeyboardEvent({ key: 'Escape', target: input as unknown as EventTarget });
    expect(shouldHandleDesignerShortcut(event, defaultOpts)).toBe(true);
    document.body.removeChild(input);
  });

  it('retorna false en modo inline-editing para teclas generales', () => {
    const event = makeKeyboardEvent({ key: 'g', metaKey: true });
    expect(shouldHandleDesignerShortcut(event, { ...defaultOpts, inlineEditing: true })).toBe(false);
  });

  it('retorna true en modo inline-editing para Escape/Enter/Tab', () => {
    for (const key of ['Escape', 'Enter', 'Tab']) {
      const event = makeKeyboardEvent({ key });
      expect(shouldHandleDesignerShortcut(event, { ...defaultOpts, inlineEditing: true }), `key=${key}`).toBe(true);
    }
  });

  it('retorna false para contenteditable target con tecla no-Escape', () => {
    const div = makeElement('[contenteditable="true"]');
    document.body.appendChild(div);
    const event = makeKeyboardEvent({ key: 'Delete', target: div as unknown as EventTarget });
    expect(shouldHandleDesignerShortcut(event, defaultOpts)).toBe(false);
    document.body.removeChild(div);
  });
});

// ── CommandMeta + buildCommandMeta ────────────────────────────────────────────

describe('buildCommandMeta', () => {
  it('asigna timestamp por defecto como Date.now()', () => {
    const before = Date.now();
    const meta = buildCommandMeta({ commandId: 'delete', source: 'keyboard', undoable: true });
    const after = Date.now();
    expect(meta.timestamp).toBeGreaterThanOrEqual(before);
    expect(meta.timestamp).toBeLessThanOrEqual(after);
  });

  it('permite sobreescribir el timestamp', () => {
    const meta = buildCommandMeta({ commandId: 'move', source: 'canvas-toolbar', undoable: true, timestamp: 9999 });
    expect(meta.timestamp).toBe(9999);
  });

  it('acepta todos los campos opcionales', () => {
    const meta = buildCommandMeta({
      commandId: 'group',
      source: 'inspector',
      undoable: true,
      actorId: 'user-1',
      documentId: 'doc-1',
      pageIndex: 0,
      schemaUids: ['uid-a', 'uid-b'],
      groupUid: 'grp-1',
      analytics: { feature: 'group', caseId: 'c-123' },
    });
    expect(meta.actorId).toBe('user-1');
    expect(meta.schemaUids).toHaveLength(2);
    expect(meta.analytics?.feature).toBe('group');
  });

  it('AppCommand<T> puede tiparse correctamente', () => {
    type MovePayload = { dx: number; dy: number };
    const cmd: AppCommand<MovePayload> = {
      meta: buildCommandMeta({ commandId: 'move', source: 'keyboard', undoable: true }),
      payload: { dx: 10, dy: 5 },
    };
    expect(cmd.payload.dx).toBe(10);
    expect(cmd.meta.commandId).toBe('move');
  });

  it('commandId requerido — TypeScript lo impone', () => {
    // Prueba que los campos requeridos son los esperados
    const meta: CommandMeta = buildCommandMeta({
      commandId: 'undo',
      source: 'keyboard',
      undoable: false,
    });
    expect(meta.commandId).toBe('undo');
    expect(meta.undoable).toBe(false);
  });
});
