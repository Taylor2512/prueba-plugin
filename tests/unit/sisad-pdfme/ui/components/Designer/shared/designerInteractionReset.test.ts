/**
 * TASK-INTERACTION-016 — contrato del reset transitorio:
 * keepSelection nunca limpia activeElements, el modal lock se libera y el blur
 * solo ocurre con foco huérfano (dentro de un modal desmontado/oculto).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resetDesignerTransientInteractionState } from '../../../../../../../src/sisad-pdfme/ui/components/Designer/shared/designerInteractionReset.js';

describe('resetDesignerTransientInteractionState', () => {
  afterEach(() => {
    document.body.style.pointerEvents = '';
    document.body.style.overflow = '';
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('clears transient UI state, releases the modal lock and emits the reset event', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    document.body.style.pointerEvents = 'none';
    document.body.style.overflow = 'hidden';

    const calls: string[] = [];
    resetDesignerTransientInteractionState({
      clearContextMenu: () => calls.push('context'),
      clearInlineEdit: () => calls.push('inline'),
      clearDragState: () => calls.push('drag'),
      clearRegionSelection: () => calls.push('region'),
      clearHoverState: () => calls.push('hover'),
      clearPointerState: () => calls.push('pointer'),
      resumeKeyboardShortcuts: () => calls.push('keys'),
      releaseModalLock: () => calls.push('modal-lock'),
    });

    expect(calls).toEqual(['context', 'inline', 'drag', 'region', 'hover', 'pointer', 'keys', 'modal-lock']);
    expect(document.body.style.pointerEvents).toBe('');
    expect(document.body.style.overflow).toBe('');
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect((dispatchSpy.mock.calls[0]?.[0] as CustomEvent).type).toBe('sisad-pdfme:designer-interaction-reset');
  });

  it('keepSelection (default) NUNCA invoca clearSelection', () => {
    const clearSelection = vi.fn();

    resetDesignerTransientInteractionState({ clearSelection });
    expect(clearSelection).not.toHaveBeenCalled();

    resetDesignerTransientInteractionState({ keepSelection: true, clearSelection });
    expect(clearSelection).not.toHaveBeenCalled();
  });

  it('keepSelection=false es la única vía para limpiar selección', () => {
    const clearSelection = vi.fn();
    resetDesignerTransientInteractionState({ keepSelection: false, clearSelection });
    expect(clearSelection).toHaveBeenCalledTimes(1);
  });

  it('releaseModalLock corre incluso sin otros callbacks (isModalOpen no queda pegado)', () => {
    const releaseModalLock = vi.fn();
    resetDesignerTransientInteractionState({ releaseModalLock });
    expect(releaseModalLock).toHaveBeenCalledTimes(1);
  });

  it('NO hace blur de un input legítimo del diseñador', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    expect(document.activeElement).toBe(input);

    resetDesignerTransientInteractionState();
    expect(document.activeElement).toBe(input);
  });

  it('sí hace blur cuando el foco quedó dentro de un modal oculto', () => {
    const wrap = document.createElement('div');
    wrap.className = 'ant-modal-wrap';
    const button = document.createElement('button');
    wrap.appendChild(button);
    document.body.appendChild(wrap);
    button.focus();
    expect(document.activeElement).toBe(button);

    wrap.style.display = 'none';
    resetDesignerTransientInteractionState();
    expect(document.activeElement).not.toBe(button);
  });
});
