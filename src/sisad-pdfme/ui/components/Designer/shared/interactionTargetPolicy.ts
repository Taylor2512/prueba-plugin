/**
 * interactionTargetPolicy
 *
 * Single source of truth for deciding which DOM targets may participate in
 * canvas interactions (Selecto region/click selection and Moveable transforms).
 *
 * Selecto and Moveable must agree on the SAME base criteria, otherwise the two
 * guard modules drift. This Policy/Strategy object owns the criteria; the
 * selectable/transform guard modules become thin facades over it.
 *
 * SRP: only target classification. OCP: new exclusions are added here once,
 * never in two guard files.
 */
import {
  DESIGNER_INTERACTIVE_CONTROL_SELECTORS,
  buildSelectorList,
} from './interactionTargetSelectors.js';
import { isDesignerInteractionExcluded } from './interactionExclusions.js';
import { isSchemaRootElement } from './objectGuards.js';
import {
  resolveInteractionTarget,
  shouldIgnoreForSelecto,
  shouldSelectTarget,
  shouldTransformTarget,
} from './interactionTargetResolver.js';

/** Everything Selecto/Moveable must NEVER treat as an interaction target. */
const OPTION_INTERNAL_SELECTOR = '[data-option-id]';
const GROUP_ADD_OPTION_SELECTOR = '[data-role="group-add-option"]';
const INTERACTIVE_CONTROL_SELECTOR = buildSelectorList(DESIGNER_INTERACTIVE_CONTROL_SELECTORS);

const matchesSelector = (target: EventTarget | null | undefined, selector: string): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(selector) || target.matches(selector));
};

/** Valid schema root = `.sisad-pdfme-ui-custom-selectable[data-schema-id]`. */
export const isSchemaRootTarget = (element: Element | null | undefined): boolean =>
  isSchemaRootElement(element);

/** In-schema interactive control (group "+" button, toggle, etc.). */
export const isDesignerInteractiveTarget = (target: EventTarget | null | undefined): boolean =>
  matchesSelector(target, INTERACTIVE_CONTROL_SELECTOR) || isDesignerInteractionExcluded(target);

/** Internal option of a checkbox/radio group (carries data-option-id). */
export const isOptionInternalTarget = (target: EventTarget | null | undefined): boolean =>
  matchesSelector(target, OPTION_INTERNAL_SELECTOR);

/** The floating "+" add-option button. */
export const isGroupAddOptionTarget = (target: EventTarget | null | undefined): boolean =>
  matchesSelector(target, GROUP_ADD_OPTION_SELECTOR);

/** Selecto may select this element (schema root only). */
export const isSelectableCanvasTarget = (element: Element | null | undefined): boolean => {
  const result = resolveInteractionTarget(element);
  return shouldSelectTarget(result) && result.kind === 'schema-root';
};

/** Moveable may transform this element (schema root only). */
export const isTransformableCanvasTarget = (element: Element | null | undefined): boolean => {
  const result = resolveInteractionTarget(element);
  return shouldTransformTarget(result) && result.kind === 'schema-root';
};

/** Target (or ancestor) that must suppress Selecto region/click selection. */
export const isCanvasSelectionExcludedTarget = (target: EventTarget | null | undefined): boolean => {
  const result = resolveInteractionTarget(target);
  return shouldIgnoreForSelecto(result);
};

/** Target (or ancestor) that must be excluded from Moveable transform. */
export const isCanvasTransformExcludedTarget = (target: EventTarget | null | undefined): boolean => {
  const result = resolveInteractionTarget(target);
  return !shouldTransformTarget(result);
};
