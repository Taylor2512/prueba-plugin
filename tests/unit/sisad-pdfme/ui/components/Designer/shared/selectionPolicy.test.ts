import { describe, expect, it } from 'vitest';
import { resolveSelectionIntent } from '@/sisad-pdfme/ui/components/Designer/shared/selectionPolicy';

const makeMouseEvent = (overrides: Partial<MouseEvent> = {}): MouseEvent =>
  ({
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    ...overrides,
  }) as MouseEvent;

describe('selectionPolicy', () => {
  it('uses platform modifiers for click selection and keeps shift out of the default toggle path', () => {
    expect(
      resolveSelectionIntent({
        platform: 'mac',
        event: makeMouseEvent({ metaKey: true }),
        pointerKind: 'click',
      }),
    ).toBe('toggle');

    expect(
      resolveSelectionIntent({
        platform: 'windows',
        event: makeMouseEvent({ ctrlKey: true }),
        pointerKind: 'click',
      }),
    ).toBe('toggle');

    expect(
      resolveSelectionIntent({
        platform: 'mac',
        event: makeMouseEvent({ shiftKey: true }),
        pointerKind: 'click',
      }),
    ).toBe('replace');
  });

  it('keeps region selection additive when modifiers request accumulation', () => {
    expect(
      resolveSelectionIntent({
        platform: 'windows',
        event: makeMouseEvent({ shiftKey: true }),
        pointerKind: 'drag-region',
      }),
    ).toBe('add');
  });
});
