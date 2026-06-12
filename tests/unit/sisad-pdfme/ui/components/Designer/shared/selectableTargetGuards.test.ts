import { describe, it, expect } from 'vitest';
import {
  SELECTO_EXCLUDED_SELECTORS,
  isSelectableTarget,
  isSelectoExcludedTarget,
  getSelectoTargetSelector,
} from '@/sisad-pdfme/ui/components/Designer/shared/selectableTargetGuards.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeSelectable = (): HTMLElement => {
  const el = document.createElement('div');
  el.classList.add('selectable');
  el.setAttribute('data-schema-id', 'schema-1');
  return el;
};

// ─── SELECTO_EXCLUDED_SELECTORS ───────────────────────────────────────────────

describe('SELECTO_EXCLUDED_SELECTORS', () => {
  it('includes data-option-id', () => {
    expect(SELECTO_EXCLUDED_SELECTORS).toContain('[data-option-id]');
  });

  it('includes group-add-option role', () => {
    expect(SELECTO_EXCLUDED_SELECTORS).toContain('[data-role="group-add-option"]');
  });

  it('includes moveable control selectors', () => {
    expect(SELECTO_EXCLUDED_SELECTORS).toContain('.moveable-control-box');
  });

  it('includes input and textarea', () => {
    expect(SELECTO_EXCLUDED_SELECTORS).toContain('input');
    expect(SELECTO_EXCLUDED_SELECTORS).toContain('textarea');
  });
});

// ─── isSelectableTarget ────────────────────────────────────────────────────────

describe('isSelectableTarget', () => {
  it('returns true for element with selectable class and data-schema-id', () => {
    expect(isSelectableTarget(makeSelectable())).toBe(true);
  });

  it('returns false when data-schema-id is missing', () => {
    const el = document.createElement('div');
    el.classList.add('selectable');
    expect(isSelectableTarget(el)).toBe(false);
  });

  it('returns false when selectable class is missing', () => {
    const el = document.createElement('div');
    el.setAttribute('data-schema-id', 'x');
    expect(isSelectableTarget(el)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isSelectableTarget(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isSelectableTarget(undefined)).toBe(false);
  });
});

// ─── isSelectoExcludedTarget ──────────────────────────────────────────────────

describe('isSelectoExcludedTarget', () => {
  it('returns true for element with data-option-id', () => {
    const el = document.createElement('div');
    el.setAttribute('data-option-id', 'opt-1');
    expect(isSelectoExcludedTarget(el)).toBe(true);
  });

  it('returns true for element with data-role=group-add-option', () => {
    const el = document.createElement('button');
    el.setAttribute('data-role', 'group-add-option');
    expect(isSelectoExcludedTarget(el)).toBe(true);
  });

  it('returns true for input element', () => {
    const el = document.createElement('input');
    expect(isSelectoExcludedTarget(el)).toBe(true);
  });

  it('returns true for child nested inside excluded ancestor', () => {
    const parent = document.createElement('div');
    parent.setAttribute('data-option-id', 'opt-1');
    const child = document.createElement('span');
    parent.appendChild(child);
    expect(isSelectoExcludedTarget(child)).toBe(true);
  });

  it('returns false for a regular schema div', () => {
    expect(isSelectoExcludedTarget(makeSelectable())).toBe(false);
  });

  it('returns false for null', () => {
    expect(isSelectoExcludedTarget(null)).toBe(false);
  });
});

// ─── getSelectoTargetSelector ─────────────────────────────────────────────────

describe('getSelectoTargetSelector', () => {
  it('returns a non-empty CSS selector string', () => {
    const sel = getSelectoTargetSelector();
    expect(typeof sel).toBe('string');
    expect(sel.length).toBeGreaterThan(0);
  });

  it('selector starts with a dot (class selector)', () => {
    expect(getSelectoTargetSelector()).toMatch(/^\./);
  });
});
