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
