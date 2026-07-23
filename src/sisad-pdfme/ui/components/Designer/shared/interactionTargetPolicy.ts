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
  resolveInteractionTarget,
  shouldIgnoreForSelecto,
  shouldSelectTarget,
  shouldTransformTarget,
} from './interactionTargetResolver.js';

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
  // Sin target no hay nada que excluir (contrato legacy de los guards).
  if (!(target instanceof Element)) return false;
  const result = resolveInteractionTarget(target);
  return shouldIgnoreForSelecto(result);
};

/** Target (or ancestor) that must be excluded from Moveable transform. */
export const isCanvasTransformExcludedTarget = (target: EventTarget | null | undefined): boolean => {
  if (!(target instanceof Element)) return false;
  const result = resolveInteractionTarget(target);
  return !shouldTransformTarget(result);
};
