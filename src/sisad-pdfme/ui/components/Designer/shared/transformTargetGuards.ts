/**
 * Guards for Moveable transform targets.
 *
 * Moveable must only receive schema root elements as targets.
 * Options, overlays, buttons, and popups must NEVER be Moveable targets.
 *
 * Rule: only `.sisad-pdfme-ui-custom-selectable[data-schema-id]` is
 * a valid Moveable target.
 */

import { SELECTABLE_CLASSNAME } from '../../../constants.js';

/** CSS selectors that Moveable must NEVER receive as transform targets. */
export const MOVEABLE_EXCLUDED_SELECTORS = [
  '[data-option-id]',
  '[data-role="group-add-option"]',
  '.sisad-pdfme-option-group__add-button',
  '.sisad-pdfme-option-group-floating-action',
  '.sisad-pdfme-option-group-action-overlay',
  '.moveable-control',
  '.moveable-line',
  '.moveable-control-box',
  '.ant-popover',
  '.ant-select-dropdown',
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
] as const;

const EXCLUDED_SELECTOR = MOVEABLE_EXCLUDED_SELECTORS.join(', ');

/**
 * Returns true when the element is a valid Moveable transform target:
 * a schema root element with selectable class and data-schema-id.
 */
export const isMoveableTarget = (element: Element | null | undefined): boolean => {
  if (!(element instanceof HTMLElement)) return false;
  return (
    element.classList.contains(SELECTABLE_CLASSNAME) &&
    element.hasAttribute('data-schema-id')
  );
};

/**
 * Returns true when the element should be excluded from Moveable
 * target resolution (overlays, options, interactive controls).
 */
export const isMoveableExcludedTarget = (target: EventTarget | null | undefined): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(EXCLUDED_SELECTOR) || target.matches(EXCLUDED_SELECTOR));
};

/**
 * Filters an array of elements to only valid Moveable targets.
 * Used in Canvas.tsx normalizeActiveTargets before passing to Moveable.
 */
export const filterMoveableTargets = (elements: HTMLElement[]): HTMLElement[] =>
  elements.filter(isMoveableTarget);
