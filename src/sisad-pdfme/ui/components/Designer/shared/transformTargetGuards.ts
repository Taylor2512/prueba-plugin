/**
 * Guards for Moveable transform targets.
 *
 * Facade over interactionTargetPolicy: the public API stays stable while the
 * criteria live in one shared policy (no drift with selectableTargetGuards).
 *
 * Rule: only `.sisad-pdfme-ui-custom-selectable[data-schema-id]` is a valid
 * Moveable target. Options, overlays, buttons, popups must NEVER be targets.
 */
import { DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS } from '@sisad-pdfme/ui/components/Designer/shared/interactionTargetSelectors';
import {
  isTransformableCanvasTarget,
  isCanvasTransformExcludedTarget,
} from '@sisad-pdfme/ui/components/Designer/shared/interactionTargetPolicy';

/** CSS selectors that Moveable must NEVER receive as transform targets. */
export const MOVEABLE_EXCLUDED_SELECTORS = DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS;

/** Valid Moveable transform target (schema root with class + data-schema-id). */
export const isMoveableTarget = (element: Element | null | undefined): boolean =>
  isTransformableCanvasTarget(element);

/** Element that should be excluded from Moveable target resolution. */
export const isMoveableExcludedTarget = (target: EventTarget | null | undefined): boolean =>
  isCanvasTransformExcludedTarget(target);

/** Filters an array of elements to only valid Moveable targets. */
export const filterMoveableTargets = (elements: HTMLElement[]): HTMLElement[] =>
  elements.filter(isMoveableTarget);
