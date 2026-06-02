import React from 'react';
import { describe, expect, test, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { DESIGNER_SHORTCUTS } from '@/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.js';
import {
  shouldIgnoreShortcutEvent,
  type UseDesignerKeyboardShortcutsParams,
} from '@/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.js';
import { resolveShortcutByKeyboardEvent } from '@/sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry.js';
import { DESIGNER_CLASSNAME } from '@/sisad-pdfme/ui/constants.js';

const shortcutContext: Pick<UseDesignerKeyboardShortcutsParams, 'isModalOpen' | 'isInlineEditing'> = {
  isModalOpen: false,
  isInlineEditing: false,
};

describe('useDesignerKeyboardShortcuts behavior', () => {
  afterEach(() => {
    cleanup();
  });

  test('resolves selection shortcuts on canvas targets', () => {
    const { getByRole } = render(
      <div className={`${DESIGNER_CLASSNAME}root`}>
        <button type="button">Canvas target</button>
      </div>,
    );
    const target = getByRole('button', { name: 'Canvas target' });
    const isMac = navigator.platform.toLowerCase().includes('mac');

    const duplicateEvent = {
      key: 'd',
      target,
      defaultPrevented: false,
      isComposing: false,
      [isMac ? 'metaKey' : 'ctrlKey']: true,
    } as KeyboardEvent;
    const undoEvent = {
      key: 'z',
      target,
      defaultPrevented: false,
      isComposing: false,
      [isMac ? 'metaKey' : 'ctrlKey']: true,
    } as KeyboardEvent;
    const redoEvent = {
      key: 'z',
      target,
      defaultPrevented: false,
      isComposing: false,
      shiftKey: true,
      [isMac ? 'metaKey' : 'ctrlKey']: true,
    } as KeyboardEvent;

    expect(resolveShortcutByKeyboardEvent(duplicateEvent, DESIGNER_SHORTCUTS)?.id).toBe('duplicate');
    expect(resolveShortcutByKeyboardEvent(undoEvent, DESIGNER_SHORTCUTS)?.id).toBe('undo');
    expect(resolveShortcutByKeyboardEvent(redoEvent, DESIGNER_SHORTCUTS)?.id).toBe('redo');
    expect(
      shouldIgnoreShortcutEvent(duplicateEvent, DESIGNER_SHORTCUTS.find((shortcut) => shortcut.id === 'duplicate')!, shortcutContext),
    ).toBe(false);
  });

  test('suppresses shortcuts while an editable input has focus', () => {
    const { getByRole } = render(
      <div className={`${DESIGNER_CLASSNAME}root`}>
        <input aria-label="Editable target" />
      </div>,
    );
    const input = getByRole('textbox', { name: 'Editable target' });
    const isMac = navigator.platform.toLowerCase().includes('mac');
    const duplicateShortcut = DESIGNER_SHORTCUTS.find((shortcut) => shortcut.id === 'duplicate')!;

    const duplicateEvent = {
      key: 'd',
      target: input,
      defaultPrevented: false,
      isComposing: false,
      [isMac ? 'metaKey' : 'ctrlKey']: true,
    } as KeyboardEvent;

    expect(resolveShortcutByKeyboardEvent(duplicateEvent, DESIGNER_SHORTCUTS)?.id).toBe('duplicate');
    expect(shouldIgnoreShortcutEvent(duplicateEvent, duplicateShortcut, shortcutContext)).toBe(true);
  });
});
