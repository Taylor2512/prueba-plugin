/**
 * Guards for Moveable transform targets.
 *
 * Moveable must only receive schema root elements as targets.
 * Options, overlays, buttons, and popups must NEVER be Moveable targets.
 *
 * Rule: only `.sisad-pdfme-ui-custom-selectable[data-schema-id]` is
 * a valid Moveable target.
 */

import { DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS, buildSelectorList } from './interactionTargetSelectors.js';
import { isSchemaRootElement } from './objectGuards.js';

/** CSS selectors that Moveable must NEVER receive as transform targets. */
export const MOVEABLE_EXCLUDED_SELECTORS = DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS;

const EXCLUDED_SELECTOR = buildSelectorList(MOVEABLE_EXCLUDED_SELECTORS);

/**
 * Returns true when the element is a valid Moveable transform target:
 * a schema root element with selectable class and data-schema-id.
 */
export const isMoveableTarget = (element: Element | null | undefined): boolean => {
  return isSchemaRootElement(element);
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
