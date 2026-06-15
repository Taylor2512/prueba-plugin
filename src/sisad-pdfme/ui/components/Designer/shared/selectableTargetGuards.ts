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
import { DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS, buildSelectorList } from './interactionTargetSelectors.js';
import { isSchemaRootElement } from './objectGuards.js';

/** CSS selectors that Selecto must NEVER select. */
export const SELECTO_EXCLUDED_SELECTORS = DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS;

const EXCLUDED_SELECTOR = buildSelectorList(SELECTO_EXCLUDED_SELECTORS);

/**
 * Returns true when the element is a valid Selecto selection target:
 * a schema root element with the selectable class and data-schema-id.
 */
export const isSelectableTarget = (element: Element | null | undefined): boolean => {
  return isSchemaRootElement(element);
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
