import { describe, it, expect } from 'vitest';
import {
  resolveInteractionTarget,
  shouldIgnoreForSelecto,
  shouldSelectTarget,
  shouldTransformTarget,
} from '@/sisad-pdfme/ui/components/Designer/shared/interactionTargetResolver.js';

const makeSchemaRoot = (): HTMLElement => {
  const el = document.createElement('div');
  el.classList.add('selectable');
  el.setAttribute('data-schema-id', 'schema-1');
  return el;
};

describe('resolveInteractionTarget', () => {
  it('classifies a paper surface as canvas-empty', () => {
    const paper = document.createElement('div');
    paper.setAttribute('data-paper-page', 'true');

    const result = resolveInteractionTarget(paper);

    expect(result.kind).toBe('canvas-empty');
    expect(shouldSelectTarget(result)).toBe(true);
    expect(shouldIgnoreForSelecto(result)).toBe(false);
  });

  it('prefers schema-root over paper surface when nested', () => {
    const paper = document.createElement('div');
    paper.setAttribute('data-paper-page', 'true');
    const schema = makeSchemaRoot();
    paper.appendChild(schema);

    const result = resolveInteractionTarget(schema);

    expect(result.kind).toBe('schema-root');
    expect(shouldSelectTarget(result)).toBe(true);
    expect(shouldTransformTarget(result)).toBe(true);
  });

  it('keeps interactive controls excluded', () => {
    const button = document.createElement('button');
    button.setAttribute('data-role', 'group-add-option');

    const result = resolveInteractionTarget(button);

    expect(result.kind).toBe('group-add-option');
    expect(shouldIgnoreForSelecto(result)).toBe(true);
  });
});
