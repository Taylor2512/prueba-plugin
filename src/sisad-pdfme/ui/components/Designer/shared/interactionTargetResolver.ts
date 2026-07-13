/**
 * interactionTargetResolver
 *
 * Consolidates DOM target identification for designer interactions.
 * Replaces fragmented guards with a structured result.
 */
import { SELECTABLE_CLASSNAME } from '../../../constants.js';
import { isDesignerInteractionExcluded } from './interactionExclusions.js';

export type InteractionTargetKind =
  | 'schema-root'
  | 'option-internal'
  | 'group-add-option'
  | 'interactive-control'
  | 'moveable-control'
  | 'selection-toolbar'
  | 'canvas-empty'
  | 'unknown';

export type InteractionTargetResult = {
  kind: InteractionTargetKind;
  element: HTMLElement | null;
  schemaRoot: HTMLElement | null;
  schemaUid: string | null;
  optionId: string | null;
};

/** Precise check for schema root element. */
const isSchemaRoot = (element: Element | null | undefined): element is HTMLElement => {
  if (!(element instanceof HTMLElement)) return false;
  return element.classList.contains(SELECTABLE_CLASSNAME) && element.hasAttribute('data-schema-id');
};

export function resolveInteractionTarget(target: EventTarget | null): InteractionTargetResult {
  if (!(target instanceof HTMLElement)) {
    return { kind: 'unknown', element: null, schemaRoot: null, schemaUid: null, optionId: null };
  }

  if (isDesignerInteractionExcluded(target)) {
    return { kind: 'selection-toolbar', element: target, schemaRoot: null, schemaUid: null, optionId: null };
  }

  // 1. Moveable controls (highest priority as they live over everything)
  if (target.closest('.moveable-control, .moveable-line, .moveable-control-box')) {
    return { kind: 'moveable-control', element: target, schemaRoot: null, schemaUid: null, optionId: null };
  }

  // 2. Selection toolbar
  if (target.closest('.sisad-pdfme-ui-selection-context-toolbar')) {
    return { kind: 'selection-toolbar', element: target, schemaRoot: null, schemaUid: null, optionId: null };
  }

  // 3. Option internal
  const optionEl = target.closest('[data-option-id]') as HTMLElement | null;
  if (optionEl) {
    const root = target.closest(`.${SELECTABLE_CLASSNAME}[data-schema-id]`) as HTMLElement | null;
    return {
      kind: 'option-internal',
      element: optionEl,
      schemaRoot: root,
      schemaUid: root?.getAttribute('data-schema-id') || null,
      optionId: optionEl.getAttribute('data-option-id'),
    };
  }

  // 4. Group add option
  const addOptionEl = target.closest('[data-role="group-add-option"]') as HTMLElement | null;
  if (addOptionEl) {
    const root = target.closest(`.${SELECTABLE_CLASSNAME}[data-schema-id]`) as HTMLElement | null;
    return {
      kind: 'group-add-option',
      element: addOptionEl,
      schemaRoot: root,
      schemaUid: root?.getAttribute('data-schema-id') || null,
      optionId: null,
    };
  }

  // 5. Interactive controls
  const interactiveEl = target.closest('[data-schema-interactive-control]') as HTMLElement | null;
  if (interactiveEl) {
    const root = target.closest(`.${SELECTABLE_CLASSNAME}[data-schema-id]`) as HTMLElement | null;
    return {
      kind: 'interactive-control',
      element: interactiveEl,
      schemaRoot: root,
      schemaUid: root?.getAttribute('data-schema-id') || null,
      optionId: null,
    };
  }

  // 6. Schema root
  const rootEl = target.closest(`.${SELECTABLE_CLASSNAME}[data-schema-id]`) as HTMLElement | null;
  if (rootEl && isSchemaRoot(rootEl)) {
    return {
      kind: 'schema-root',
      element: rootEl,
      schemaRoot: rootEl,
      schemaUid: rootEl.getAttribute('data-schema-id'),
      optionId: null,
    };
  }

  // 7. Canvas empty / page surface.
  // The real PDF page is a valid region-selection surface even when the user
  // starts the drag on blank paper rather than directly on the canvas shell.
  if (
    target.closest('[data-paper-page="true"]') ||
    target.closest('.sisad-pdfme-designer-canvas-stage, .sisad-pdfme-canvas-provider')
  ) {
    return { kind: 'canvas-empty', element: target, schemaRoot: null, schemaUid: null, optionId: null };
  }

  return { kind: 'unknown', element: target, schemaRoot: null, schemaUid: null, optionId: null };
}

/** Should this interaction start a selection? */
export function shouldSelectTarget(result: InteractionTargetResult): boolean {
  return result.kind === 'schema-root' || result.kind === 'canvas-empty';
}

/** Should this interaction start a transformation (Moveable)? */
export function shouldTransformTarget(result: InteractionTargetResult): boolean {
  return result.kind === 'schema-root' || result.kind === 'moveable-control';
}

/** Should Selecto ignore this target to avoid stealing events? */
export function shouldIgnoreForSelecto(result: InteractionTargetResult): boolean {
  return (
    result.kind === 'moveable-control' ||
    result.kind === 'selection-toolbar' ||
    result.kind === 'option-internal' ||
    result.kind === 'group-add-option' ||
    result.kind === 'interactive-control'
  );
}
