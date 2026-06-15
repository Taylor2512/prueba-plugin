/**
 * Guards for Selecto region-selection.
 *
 * Facade over interactionTargetPolicy: keeps the public API stable while the
 * actual criteria live in one shared policy (no drift with transformTargetGuards).
 *
 * Rule: only `.sisad-pdfme-ui-custom-selectable[data-schema-id]` is selectable.
 */
import { SELECTABLE_CLASSNAME } from '../../../constants.js';
import { DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS } from './interactionTargetSelectors.js';
import {
  isSelectableCanvasTarget,
  isCanvasSelectionExcludedTarget,
} from './interactionTargetPolicy.js';

/** CSS selectors that Selecto must NEVER select. */
export const SELECTO_EXCLUDED_SELECTORS = DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS;

/** Valid Selecto selection target (schema root with class + data-schema-id). */
export const isSelectableTarget = (element: Element | null | undefined): boolean =>
  isSelectableCanvasTarget(element);

/**
 * Element (or ancestor) that should cause Selecto to skip region-selection.
 * Defensive guard beyond interactionGuards.shouldSuppressCanvasRegionSelection.
 */
export const isSelectoExcludedTarget = (target: EventTarget | null | undefined): boolean =>
  isCanvasSelectionExcludedTarget(target);

/**
 * CSS class name Selecto uses as `selectableTargets`. Centralized to prevent
 * drift between Canvas.tsx and Selecto config.
 */
export const getSelectoTargetSelector = (): string => `.${SELECTABLE_CLASSNAME}`;
