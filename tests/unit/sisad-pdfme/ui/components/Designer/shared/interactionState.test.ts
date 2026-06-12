import { describe, it, expect } from 'vitest';
import { deriveInteractionState } from '@/sisad-pdfme/ui/components/Designer/shared/interactionState.js';
import type { InteractionStateInput } from '@/sisad-pdfme/ui/components/Designer/shared/interactionState.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const elem = () => document.createElement('div') as HTMLElement;

const base = (): InteractionStateInput => ({
  activeElements: [],
  hoveringSchemaId: null,
  editing: false,
  isDragging: false,
  isResizing: false,
  isRotating: false,
});

// ─── Phase derivation ────────────────────────────────────────────────────────

describe('deriveInteractionState — phase', () => {
  it('idle when nothing is active', () => {
    expect(deriveInteractionState(base()).phase).toBe('idle');
  });

  it('hover when hoveringSchemaId set and no selection', () => {
    expect(deriveInteractionState({ ...base(), hoveringSchemaId: 'schema-1' }).phase).toBe('hover');
  });

  it('hover does NOT fire when selection is active', () => {
    const state = deriveInteractionState({ ...base(), activeElements: [elem()], hoveringSchemaId: 'schema-1' });
    expect(state.phase).toBe('selected-single');
  });

  it('selected-single when exactly one element selected', () => {
    expect(deriveInteractionState({ ...base(), activeElements: [elem()] }).phase).toBe('selected-single');
  });

  it('selected-multi when more than one element selected', () => {
    expect(deriveInteractionState({ ...base(), activeElements: [elem(), elem()] }).phase).toBe('selected-multi');
  });

  it('editing when editing=true and selection present', () => {
    expect(deriveInteractionState({ ...base(), editing: true, activeElements: [elem()] }).phase).toBe('editing');
  });

  it('dragging takes priority over selection', () => {
    expect(deriveInteractionState({ ...base(), isDragging: true, activeElements: [elem()] }).phase).toBe('dragging');
  });

  it('resizing takes priority over selection', () => {
    expect(deriveInteractionState({ ...base(), isResizing: true, activeElements: [elem()] }).phase).toBe('resizing');
  });

  it('rotating takes priority over selection', () => {
    expect(deriveInteractionState({ ...base(), isRotating: true, activeElements: [elem()] }).phase).toBe('rotating');
  });

  it('dragging takes priority over resizing', () => {
    expect(deriveInteractionState({ ...base(), isDragging: true, isResizing: true }).phase).toBe('dragging');
  });
});

// ─── Derived flags ────────────────────────────────────────────────────────────

describe('deriveInteractionState — flags', () => {
  it('hasSelection is true when activeElements is non-empty', () => {
    expect(deriveInteractionState({ ...base(), activeElements: [elem()] }).hasSelection).toBe(true);
  });

  it('hasSelection is false when no active elements', () => {
    expect(deriveInteractionState(base()).hasSelection).toBe(false);
  });

  it('selectionCount matches activeElements.length', () => {
    const three = [elem(), elem(), elem()];
    expect(deriveInteractionState({ ...base(), activeElements: three }).selectionCount).toBe(3);
  });

  it('isHovering is true only when hoveringSchemaId set without selection', () => {
    expect(deriveInteractionState({ ...base(), hoveringSchemaId: 'x' }).isHovering).toBe(true);
    expect(deriveInteractionState({ ...base(), hoveringSchemaId: 'x', activeElements: [elem()] }).isHovering).toBe(false);
  });

  it('isDragging / isResizing / isRotating pass through from input', () => {
    const s = deriveInteractionState({ ...base(), isDragging: true, isResizing: true, isRotating: false });
    expect(s.isDragging).toBe(true);
    expect(s.isResizing).toBe(true);
    expect(s.isRotating).toBe(false);
  });
});
