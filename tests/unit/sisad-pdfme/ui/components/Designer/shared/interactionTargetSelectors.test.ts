/**
 * TASK-INTERACTION-016 — la familia completa de modal/controles debe estar en
 * los selectores excluidos que consumen Selecto/Moveable.
 */
import { describe, expect, it } from 'vitest';
import {
  DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS,
  buildSelectorList,
} from '@/sisad-pdfme/ui/components/Designer/shared/interactionTargetSelectors';
import { SELECTO_EXCLUDED_SELECTORS } from '@/sisad-pdfme/ui/components/Designer/shared/selectableTargetGuards';
import { DESIGNER_INTERACTION_EXCLUSION_SELECTOR } from '@/sisad-pdfme/ui/components/Designer/shared/interactionExclusions';

const REQUIRED_MODAL_FAMILY = [
  '[data-interaction-exclusion="true"]',
  '[data-designer-control="true"]',
  '[data-designer-modal="true"]',
  '.ant-modal-root',
  '.ant-modal-mask',
  '.ant-modal-wrap',
  '.ant-modal',
  '.ant-modal-content',
  '.ant-dropdown',
  '.ant-dropdown-menu',
  '[role="dialog"]',
  '[role="button"]',
  'button',
];

describe('interaction excluded selectors (modal family)', () => {
  it('DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS incluye toda la familia modal', () => {
    REQUIRED_MODAL_FAMILY.forEach((selector) => {
      expect(DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS, selector).toContain(selector);
    });
  });

  it('SELECTO_EXCLUDED_SELECTORS hereda la misma lista (sin drift)', () => {
    expect(SELECTO_EXCLUDED_SELECTORS).toBe(DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS);
  });

  it('el selector de exclusión del diseñador cubre los markers del modal', () => {
    ['[data-designer-modal="true"]', '[data-interaction-exclusion="true"]', '.ant-modal-mask'].forEach(
      (selector) => {
        expect(DESIGNER_INTERACTION_EXCLUSION_SELECTOR).toContain(selector);
      },
    );
  });

  it('un elemento dentro del modal matchea la lista de exclusión', () => {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="ant-modal-wrap">
        <div class="ant-modal">
          <div class="ant-modal-content"><button type="button">Reasignar</button></div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
    const button = wrap.querySelector('button') as HTMLElement;
    const selectorList = buildSelectorList(DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS);
    expect(Boolean(button.closest(selectorList))).toBe(true);
    wrap.remove();
  });
});
