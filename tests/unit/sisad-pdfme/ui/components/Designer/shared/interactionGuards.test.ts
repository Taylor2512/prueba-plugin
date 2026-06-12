import { describe, it, expect } from 'vitest';
import {
  isEditableTarget,
  shouldSuppressDesignerShortcuts,
  shouldSuppressCanvasRegionSelection,
  shouldHandleDesignerShortcut,
  evaluateSchemaMutationPermission,
  canStartInteraction,
} from '@/sisad-pdfme/ui/components/Designer/shared/interactionGuards.js';

// ─── isEditableTarget ─────────────────────────────────────────────────────────

describe('isEditableTarget', () => {
  const makeEl = (tag: string, attrs: Record<string, string> = {}): HTMLElement => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  };

  it('returns false for null', () => {
    expect(isEditableTarget(null)).toBe(false);
  });

  it('returns true for <input>', () => {
    expect(isEditableTarget(makeEl('input'))).toBe(true);
  });

  it('returns true for <textarea>', () => {
    expect(isEditableTarget(makeEl('textarea'))).toBe(true);
  });

  it('returns true for [contenteditable="true"]', () => {
    expect(isEditableTarget(makeEl('div', { contenteditable: 'true' }))).toBe(true);
  });

  it('returns true for [data-role="group-add-option"]', () => {
    const btn = makeEl('button', { 'data-role': 'group-add-option' });
    expect(isEditableTarget(btn)).toBe(true);
  });

  it('returns true for child of [data-role="group-add-option"]', () => {
    const wrapper = makeEl('div', { 'data-role': 'group-add-option' });
    const span = makeEl('span');
    wrapper.appendChild(span);
    expect(isEditableTarget(span)).toBe(true);
  });

  it('returns true for [data-option-id]', () => {
    const div = makeEl('div', { 'data-option-id': 'opt_1' });
    expect(isEditableTarget(div)).toBe(true);
  });

  it('returns true for [data-schema-interactive-control]', () => {
    const div = makeEl('div', { 'data-schema-interactive-control': '' });
    expect(isEditableTarget(div)).toBe(true);
  });

  it('returns true for .sisad-pdfme-option-group-floating-action child', () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'sisad-pdfme-option-group-floating-action';
    const child = document.createElement('span');
    wrapper.appendChild(child);
    expect(isEditableTarget(child)).toBe(true);
  });

  it('returns false for a plain <div>', () => {
    expect(isEditableTarget(makeEl('div'))).toBe(false);
  });

  it('returns false for a plain <button> (not special-role)', () => {
    expect(isEditableTarget(makeEl('button'))).toBe(false);
  });
});

// ─── shouldSuppressCanvasRegionSelection ────────────────────────────────────

describe('shouldSuppressCanvasRegionSelection', () => {
  it('suppresses when target is group-add-option button', () => {
    const btn = document.createElement('button');
    btn.setAttribute('data-role', 'group-add-option');
    expect(shouldSuppressCanvasRegionSelection(btn, {})).toBe(true);
  });

  it('suppresses when target is an option-id item', () => {
    const div = document.createElement('div');
    div.setAttribute('data-option-id', 'opt_1');
    expect(shouldSuppressCanvasRegionSelection(div, {})).toBe(true);
  });

  it('suppresses when externalSchemaDragActive', () => {
    expect(shouldSuppressCanvasRegionSelection(document.createElement('div'), { externalSchemaDragActive: true })).toBe(true);
  });

  it('suppresses when isSchemaDragging', () => {
    expect(shouldSuppressCanvasRegionSelection(document.createElement('div'), { isSchemaDragging: true })).toBe(true);
  });

  it('suppresses when isResizing', () => {
    expect(shouldSuppressCanvasRegionSelection(document.createElement('div'), { isResizing: true })).toBe(true);
  });

  it('suppresses when isRotating', () => {
    expect(shouldSuppressCanvasRegionSelection(document.createElement('div'), { isRotating: true })).toBe(true);
  });

  it('does not suppress for a plain div in idle mode', () => {
    expect(shouldSuppressCanvasRegionSelection(document.createElement('div'), {})).toBe(false);
  });
});

// ─── shouldSuppressDesignerShortcuts ─────────────────────────────────────────

describe('shouldSuppressDesignerShortcuts', () => {
  it('suppresses when target is an input', () => {
    expect(shouldSuppressDesignerShortcuts(document.createElement('input'), {})).toBe(true);
  });

  it('does not suppress for a canvas div in idle mode', () => {
    expect(shouldSuppressDesignerShortcuts(document.createElement('div'), {})).toBe(false);
  });
});

// ─── shouldHandleDesignerShortcut ────────────────────────────────────────────

describe('shouldHandleDesignerShortcut', () => {
  const makeEvent = (key: string, target: EventTarget, opts: Partial<KeyboardEvent> = {}): KeyboardEvent => {
    const e = new KeyboardEvent('keydown', { key, bubbles: true, ...opts });
    Object.defineProperty(e, 'target', { value: target });
    return e;
  };

  it('returns true for Delete key on canvas div (idle mode)', () => {
    const div = document.createElement('div');
    const e = makeEvent('Delete', div);
    expect(shouldHandleDesignerShortcut(e, { modalOpen: false, inlineEditing: false, canEditStructure: true })).toBe(true);
  });

  it('returns false when modal is open', () => {
    const div = document.createElement('div');
    const e = makeEvent('Delete', div);
    expect(shouldHandleDesignerShortcut(e, { modalOpen: true, inlineEditing: false, canEditStructure: true })).toBe(false);
  });

  it('returns false when inline editing and key is not Escape/Enter/Tab', () => {
    const div = document.createElement('div');
    const e = makeEvent('a', div);
    expect(shouldHandleDesignerShortcut(e, { modalOpen: false, inlineEditing: true, canEditStructure: true })).toBe(false);
  });

  it('returns true for Escape during inline editing', () => {
    const div = document.createElement('div');
    const e = makeEvent('Escape', div);
    expect(shouldHandleDesignerShortcut(e, { modalOpen: false, inlineEditing: true, canEditStructure: true })).toBe(true);
  });

  it('returns false when target is an input', () => {
    const input = document.createElement('input');
    const e = makeEvent('Delete', input);
    expect(shouldHandleDesignerShortcut(e, { modalOpen: false, inlineEditing: false, canEditStructure: true })).toBe(false);
  });

  it('returns false when event is already default-prevented', () => {
    const div = document.createElement('div');
    const e = makeEvent('Delete', div);
    Object.defineProperty(e, 'defaultPrevented', { value: true });
    expect(shouldHandleDesignerShortcut(e, { modalOpen: false, inlineEditing: false, canEditStructure: true })).toBe(false);
  });
});

// ─── canStartInteraction ────────────────────────────────────────────────────

describe('canStartInteraction', () => {
  const idleState = {
    mode: 'idle' as const,
    activeSchemaIds: [],
    isKeyboardInputFocused: false,
    isDraggingFromPalette: false,
    isOverCanvas: true,
    isOverPage: true,
  };

  it('allows region-selecting from idle', () => {
    expect(canStartInteraction(idleState, 'region-selecting')).toBe(true);
  });

  it('blocks region-selecting when dragging from palette', () => {
    const state = { ...idleState, isDraggingFromPalette: true };
    expect(canStartInteraction(state, 'region-selecting')).toBe(false);
  });

  it('blocks region-selecting when resizing', () => {
    const state = { ...idleState, mode: 'resizing-schema' as const };
    expect(canStartInteraction(state, 'region-selecting')).toBe(false);
  });
});

// ─── evaluateSchemaMutationPermission ────────────────────────────────────────

describe('evaluateSchemaMutationPermission', () => {
  const base = {
    schemaId: 'schema_1',
    source: 'canvas' as const,
    canEditStructure: true,
  };

  it('allows when all conditions pass', () => {
    expect(evaluateSchemaMutationPermission(base).allowed).toBe(true);
  });

  it('blocks when canEditStructure is false', () => {
    expect(evaluateSchemaMutationPermission({ ...base, canEditStructure: false }).allowed).toBe(false);
  });

  it('blocks when readonly', () => {
    expect(evaluateSchemaMutationPermission({ ...base, isReadonly: true }).allowed).toBe(false);
  });

  it('blocks when locked by another user', () => {
    expect(evaluateSchemaMutationPermission({ ...base, isLockedByOtherUser: true }).allowed).toBe(false);
  });

  it('blocks when recipient mismatch', () => {
    expect(evaluateSchemaMutationPermission({ ...base, schemaRecipientId: 'rec_a', activeRecipientId: 'rec_b' }).allowed).toBe(false);
  });

  it('allows when recipients match', () => {
    expect(evaluateSchemaMutationPermission({ ...base, schemaRecipientId: 'rec_a', activeRecipientId: 'rec_a' }).allowed).toBe(true);
  });

  it('allows when schemaRecipientId is null (unassigned field)', () => {
    expect(evaluateSchemaMutationPermission({ ...base, schemaRecipientId: null, activeRecipientId: 'rec_a' }).allowed).toBe(true);
  });
});
