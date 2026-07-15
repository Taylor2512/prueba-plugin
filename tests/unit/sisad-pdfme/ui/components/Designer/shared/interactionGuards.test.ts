import { describe, it, expect } from 'vitest';
import {
  isEditableTarget,
  shouldSuppressDesignerShortcuts,
  shouldSuppressCanvasRegionSelection,
  evaluateSchemaMutationPermission,
} from '@/sisad-pdfme/ui/components/Designer/shared/interactionGuards.js';

describe('interactionGuards', () => {
  it('treats editable and option-internal targets as shortcut-suppressing', () => {
    const input = document.createElement('input');
    const option = document.createElement('div');
    option.setAttribute('data-option-id', 'opt_1');

    expect(isEditableTarget(input)).toBe(true);
    expect(shouldSuppressDesignerShortcuts(input)).toBe(true);
    expect(shouldSuppressDesignerShortcuts(option)).toBe(true);
  });

  it('allows the blank paper surface for region selection', () => {
    const paper = document.createElement('div');
    paper.setAttribute('data-paper-page', 'true');

    expect(shouldSuppressCanvasRegionSelection(paper, {})).toBe(false);
  });

  it('blocks region selection on option internals and modal states', () => {
    const option = document.createElement('div');
    option.setAttribute('data-option-id', 'opt_1');

    expect(shouldSuppressCanvasRegionSelection(option, {})).toBe(true);
    expect(shouldSuppressCanvasRegionSelection(document.createElement('div'), { isModalOpen: true })).toBe(true);
  });

  it('evaluates schema mutation permissions by readonly and ownership', () => {
    expect(
      evaluateSchemaMutationPermission({
        schemaId: 'schema-1',
        source: 'canvas',
        canEditStructure: true,
        schemaRecipientId: 'recipient-a',
        activeRecipientId: 'recipient-a',
      }).allowed,
    ).toBe(true);

    expect(
      evaluateSchemaMutationPermission({
        schemaId: 'schema-1',
        source: 'canvas',
        canEditStructure: true,
        schemaRecipientId: 'recipient-a',
        activeRecipientId: 'recipient-b',
      }).allowed,
    ).toBe(false);
  });
});

/**
 * TASK-INTERACTION-016 — los popups AntD montados-pero-ocultos NO cuentan
 * como abiertos (causa raíz del freeze tras el modal Reasignar).
 */
import {
  isAntDPopupOpen,
  isHiddenAntDPopupElement,
} from '@/sisad-pdfme/ui/components/Designer/shared/interactionGuards';

describe('isAntDPopupOpen (visibility-aware)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('ignora un tooltip oculto que quedó montado tras el hover', () => {
    const tooltip = document.createElement('div');
    tooltip.className = 'ant-tooltip ant-tooltip-hidden';
    document.body.appendChild(tooltip);
    expect(isAntDPopupOpen()).toBe(false);
  });

  it('ignora dropdowns y modales cerrados con display:none', () => {
    const dropdown = document.createElement('div');
    dropdown.className = 'ant-dropdown ant-dropdown-hidden';
    const wrap = document.createElement('div');
    wrap.className = 'ant-modal-wrap';
    wrap.style.display = 'none';
    const modal = document.createElement('div');
    modal.className = 'ant-modal';
    wrap.appendChild(modal);
    document.body.append(dropdown, wrap);
    expect(isAntDPopupOpen()).toBe(false);
  });

  it('sí detecta un modal visible como abierto', () => {
    const wrap = document.createElement('div');
    wrap.className = 'ant-modal-wrap';
    const modal = document.createElement('div');
    modal.className = 'ant-modal';
    wrap.appendChild(modal);
    document.body.appendChild(wrap);
    expect(isAntDPopupOpen()).toBe(true);
  });

  it('isHiddenAntDPopupElement cubre clase -hidden, aria-hidden y display none', () => {
    const byClass = document.createElement('div');
    byClass.className = 'ant-tooltip ant-tooltip-hidden';
    expect(isHiddenAntDPopupElement(byClass)).toBe(true);

    const byAria = document.createElement('div');
    byAria.className = 'ant-popover';
    byAria.setAttribute('aria-hidden', 'true');
    expect(isHiddenAntDPopupElement(byAria)).toBe(true);

    const byStyle = document.createElement('div');
    byStyle.className = 'ant-dropdown';
    byStyle.style.display = 'none';
    expect(isHiddenAntDPopupElement(byStyle)).toBe(true);

    const visible = document.createElement('div');
    visible.className = 'ant-modal';
    expect(isHiddenAntDPopupElement(visible)).toBe(false);
  });
});
