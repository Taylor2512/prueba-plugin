/**
 * Guards for Selecto region-selection.
 *
 * Selecto must only select schema root elements. These guards define
 * what IS and what is NOT a valid selection target.
 *
 * Rule: only `.sisad-pdfme-ui-custom-selectable[data-schema-id]` is
 * a valid target. Everything else must be excluded.
 */

import { SELECTABLE_CLASSNAME } from '../../../constants.js';

/** CSS selectors that Selecto must NEVER select. */
export const SELECTO_EXCLUDED_SELECTORS = [
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

const EXCLUDED_SELECTOR = SELECTO_EXCLUDED_SELECTORS.join(', ');

/**
 * Returns true when the element is a valid Selecto selection target:
 * a schema root element with the selectable class and data-schema-id.
 */
export const isSelectableTarget = (element: Element | null | undefined): boolean => {
  if (!(element instanceof HTMLElement)) return false;
  return (
    element.classList.contains(SELECTABLE_CLASSNAME) &&
    element.hasAttribute('data-schema-id')
  );
};

/**
 * Returns true when the element or any of its ancestors should cause
 * Selecto to skip region-selection initiation.
 *
 * Used in Selecto `dragCondition` as an extra defensive guard beyond
 * `interactionGuards.shouldSuppressCanvasRegionSelection`.
 */
export const isSelectoExcludedTarget = (target: EventTarget | null | undefined): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(EXCLUDED_SELECTOR) || target.matches(EXCLUDED_SELECTOR));
};

/**
 * Returns the CSS class name that Selecto should use as `selectableTargets`.
 * Centralizing this prevents drift between Canvas.tsx and Selecto config.
 */
export const getSelectoTargetSelector = (): string => `.${SELECTABLE_CLASSNAME}`;
