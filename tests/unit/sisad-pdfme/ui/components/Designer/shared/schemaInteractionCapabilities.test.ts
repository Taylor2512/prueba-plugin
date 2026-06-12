import { describe, it, expect } from 'vitest';
import {
  getSchemaInteractionCapabilities,
  schemaHasGroupFloatingAction,
  schemaIsOptionBased,
} from '@/sisad-pdfme/ui/components/Designer/shared/schemaInteractionCapabilities.js';

// ─── getSchemaInteractionCapabilities ────────────────────────────────────────

describe('getSchemaInteractionCapabilities', () => {
  it('all standard types can drag', () => {
    for (const t of ['text', 'checkboxGroup', 'radioGroup', 'signature', 'image', 'line']) {
      expect(getSchemaInteractionCapabilities(t).canDrag).toBe(true);
    }
  });

  it('all standard types can resize', () => {
    for (const t of ['text', 'checkboxGroup', 'radioGroup', 'signature', 'image']) {
      expect(getSchemaInteractionCapabilities(t).canResize).toBe(true);
    }
  });

  it('attachment cannot rotate', () => {
    expect(getSchemaInteractionCapabilities('attachment').canRotate).toBe(false);
  });

  it('approve and decline cannot rotate', () => {
    expect(getSchemaInteractionCapabilities('approve').canRotate).toBe(false);
    expect(getSchemaInteractionCapabilities('decline').canRotate).toBe(false);
  });

  it('note cannot rotate', () => {
    expect(getSchemaInteractionCapabilities('note').canRotate).toBe(false);
  });

  it('text and multivariabletext can inline edit', () => {
    expect(getSchemaInteractionCapabilities('text').canInlineEdit).toBe(true);
    expect(getSchemaInteractionCapabilities('multivariabletext').canInlineEdit).toBe(true);
  });

  it('non-text types cannot inline edit', () => {
    for (const t of ['signature', 'image', 'checkboxGroup', 'radioGroup']) {
      expect(getSchemaInteractionCapabilities(t).canInlineEdit).toBe(false);
    }
  });

  it('checkboxGroup, radioGroup, select are option-based', () => {
    for (const t of ['checkboxGroup', 'radioGroup', 'select', 'dropdown', 'checkbox']) {
      expect(getSchemaInteractionCapabilities(t).isOptionBased).toBe(true);
    }
  });

  it('text is not option-based', () => {
    expect(getSchemaInteractionCapabilities('text').isOptionBased).toBe(false);
  });

  it('only checkboxGroup and radioGroup have group floating action', () => {
    expect(getSchemaInteractionCapabilities('checkboxGroup').hasGroupFloatingAction).toBe(true);
    expect(getSchemaInteractionCapabilities('radioGroup').hasGroupFloatingAction).toBe(true);
    expect(getSchemaInteractionCapabilities('select').hasGroupFloatingAction).toBe(false);
    expect(getSchemaInteractionCapabilities('checkbox').hasGroupFloatingAction).toBe(false);
  });

  it('signature, initials, stamp require provider', () => {
    for (const t of ['signature', 'initials', 'stamp']) {
      expect(getSchemaInteractionCapabilities(t).requiresProvider).toBe(true);
    }
  });

  it('text does not require provider', () => {
    expect(getSchemaInteractionCapabilities('text').requiresProvider).toBe(false);
  });

  it('line, rectangle, ellipse are shapes', () => {
    for (const t of ['line', 'rectangle', 'ellipse']) {
      expect(getSchemaInteractionCapabilities(t).isShape).toBe(true);
    }
  });

  it('text is not a shape', () => {
    expect(getSchemaInteractionCapabilities('text').isShape).toBe(false);
  });

  it('image and svg are media', () => {
    expect(getSchemaInteractionCapabilities('image').isMedia).toBe(true);
    expect(getSchemaInteractionCapabilities('svg').isMedia).toBe(true);
  });

  it('text is not media', () => {
    expect(getSchemaInteractionCapabilities('text').isMedia).toBe(false);
  });

  it('unknown type gets safe defaults (canDrag=true, canResize=true, canRotate=true)', () => {
    const caps = getSchemaInteractionCapabilities('totally-unknown-xyz');
    expect(caps.canDrag).toBe(true);
    expect(caps.canResize).toBe(true);
    expect(caps.canRotate).toBe(true);
    expect(caps.isOptionBased).toBe(false);
    expect(caps.hasGroupFloatingAction).toBe(false);
  });

  it('empty string gets safe defaults', () => {
    const caps = getSchemaInteractionCapabilities('');
    expect(caps.canDrag).toBe(true);
  });
});

// ─── schemaHasGroupFloatingAction ────────────────────────────────────────────

describe('schemaHasGroupFloatingAction', () => {
  it('returns true for checkboxGroup', () => {
    expect(schemaHasGroupFloatingAction('checkboxGroup')).toBe(true);
  });

  it('returns true for radioGroup', () => {
    expect(schemaHasGroupFloatingAction('radioGroup')).toBe(true);
  });

  it('returns false for select', () => {
    expect(schemaHasGroupFloatingAction('select')).toBe(false);
  });

  it('returns false for text', () => {
    expect(schemaHasGroupFloatingAction('text')).toBe(false);
  });
});

// ─── schemaIsOptionBased ──────────────────────────────────────────────────────

describe('schemaIsOptionBased', () => {
  it('returns true for checkboxGroup', () => {
    expect(schemaIsOptionBased('checkboxGroup')).toBe(true);
  });

  it('returns true for select', () => {
    expect(schemaIsOptionBased('select')).toBe(true);
  });

  it('returns false for text', () => {
    expect(schemaIsOptionBased('text')).toBe(false);
  });

  it('returns false for signature', () => {
    expect(schemaIsOptionBased('signature')).toBe(false);
  });
});
