import { describe, it, expect } from 'vitest';
import {
  MOVEABLE_EXCLUDED_SELECTORS,
  isMoveableTarget,
  isMoveableExcludedTarget,
  filterMoveableTargets,
} from '@/sisad-pdfme/ui/components/Designer/shared/transformTargetGuards.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeSchemaRoot = (id = 'schema-1'): HTMLElement => {
  const el = document.createElement('div');
  el.classList.add('selectable');
  el.setAttribute('data-schema-id', id);
  return el;
};

const makeOptionItem = (): HTMLElement => {
  const el = document.createElement('div');
  el.setAttribute('data-option-id', 'opt-1');
  return el;
};

const makeAddButton = (): HTMLElement => {
  const el = document.createElement('button');
  el.setAttribute('data-role', 'group-add-option');
  return el;
};

// ─── MOVEABLE_EXCLUDED_SELECTORS ─────────────────────────────────────────────

describe('MOVEABLE_EXCLUDED_SELECTORS', () => {
  it('includes data-option-id', () => {
    expect(MOVEABLE_EXCLUDED_SELECTORS).toContain('[data-option-id]');
  });

  it('includes group-add-option role', () => {
    expect(MOVEABLE_EXCLUDED_SELECTORS).toContain('[data-role="group-add-option"]');
  });

  it('includes contenteditable', () => {
    expect(MOVEABLE_EXCLUDED_SELECTORS).toContain('[contenteditable="true"]');
  });
});

// ─── isMoveableTarget ────────────────────────────────────────────────────────

describe('isMoveableTarget', () => {
  it('returns true for schema root element', () => {
    expect(isMoveableTarget(makeSchemaRoot())).toBe(true);
  });

  it('returns false when selectable class is missing', () => {
    const el = document.createElement('div');
    el.setAttribute('data-schema-id', 'x');
    expect(isMoveableTarget(el)).toBe(false);
  });

  it('returns false when data-schema-id is missing', () => {
    const el = document.createElement('div');
    el.classList.add('selectable');
    expect(isMoveableTarget(el)).toBe(false);
  });

  it('returns false for option item', () => {
    expect(isMoveableTarget(makeOptionItem())).toBe(false);
  });

  it('returns false for null', () => {
    expect(isMoveableTarget(null)).toBe(false);
  });
});

// ─── isMoveableExcludedTarget ─────────────────────────────────────────────────

describe('isMoveableExcludedTarget', () => {
  it('returns true for option item', () => {
    expect(isMoveableExcludedTarget(makeOptionItem())).toBe(true);
  });

  it('returns true for add button', () => {
    expect(isMoveableExcludedTarget(makeAddButton())).toBe(true);
  });

  it('returns true for input', () => {
    expect(isMoveableExcludedTarget(document.createElement('input'))).toBe(true);
  });

  it('returns true for child of option item', () => {
    const parent = makeOptionItem();
    const child = document.createElement('span');
    parent.appendChild(child);
    expect(isMoveableExcludedTarget(child)).toBe(true);
  });

  it('returns false for schema root', () => {
    expect(isMoveableExcludedTarget(makeSchemaRoot())).toBe(false);
  });

  it('returns false for null', () => {
    expect(isMoveableExcludedTarget(null)).toBe(false);
  });
});

// ─── filterMoveableTargets ────────────────────────────────────────────────────

describe('filterMoveableTargets', () => {
  it('keeps only schema root elements', () => {
    const schema1 = makeSchemaRoot('a');
    const schema2 = makeSchemaRoot('b');
    const option = makeOptionItem();
    const button = makeAddButton();
    const result = filterMoveableTargets([schema1, option, button, schema2]);
    expect(result).toHaveLength(2);
    expect(result).toContain(schema1);
    expect(result).toContain(schema2);
  });

  it('returns empty array when no valid targets', () => {
    expect(filterMoveableTargets([makeOptionItem(), makeAddButton()])).toHaveLength(0);
  });

  it('returns empty array for empty input', () => {
    expect(filterMoveableTargets([])).toHaveLength(0);
  });
});
