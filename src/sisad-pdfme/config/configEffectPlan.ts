/**
 * Plan de efectos de un cambio de configuración (RTP-445).
 *
 * `classifySisadPdfmeConfigChange` responde a granularidad de clave raíz:
 * «cambió algo bajo `canvas`». Eso basta para decidir si hay que reconstruir
 * recursos, pero no para que una superficie sepa QUÉ tiene que repintar. El
 * resultado era que cualquier cambio de configuración obligaba a re-resolver
 * todo, o —peor— a repintar de más «por si acaso».
 *
 * Este módulo eleva el diff al nivel de capability: qué capabilities cambiaron
 * de estado, en qué dimensiones concretas, y qué efectos exige ese cambio.
 *
 * No sustituye a `configChangeImpact`: lo consume. La clasificación estructural
 * sigue siendo la autoridad sobre reconstrucción de recursos.
 */
import { classifySisadPdfmeConfigChange, type SisadPdfmeConfigChangeImpact } from './configChangeImpact.js';
import { createCapabilityGraph, type CapabilityResolutionContext, type CapabilityState } from './capabilityGraph.js';
import type { CapabilityId } from './capabilityInventory.js';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeGlobalConfig } from './SisadPdfmeConfig.js';

/** Dimensiones comparables de un estado de capability. */
export const CAPABILITY_FLAGS = [
  'registered',
  'supported',
  'enabled',
  'visible',
  'permitted',
  'available',
  'active',
  'executable',
] as const;

export type CapabilityFlag = (typeof CAPABILITY_FLAGS)[number];

export type CapabilityTransition = {
  capabilityId: CapabilityId;
  /** Dimensiones que cambiaron. Nunca vacío en una transición reportada. */
  changedFlags: CapabilityFlag[];
  previous: CapabilityState;
  next: CapabilityState;
};

/**
 * Efectos que exige un cambio.
 *
 * - `rebuild-resources`: hay que reconstruir engine/adapters/eventHub.
 * - `recompute-capabilities`: alguna capability cambió de estado.
 * - `repaint-presentation`: cambió presentación sin tocar política.
 */
export type ConfigEffectKind = 'rebuild-resources' | 'recompute-capabilities' | 'repaint-presentation';

export type ConfigChangeSet = {
  fromRevision: number | null;
  toRevision: number | null;
  fromHash: string | null;
  toHash: string | null;
  /** `true` si el hash semántico no cambió: el plan es un no-op. */
  unchanged: boolean;
  touchedPaths: string[];
  transitions: CapabilityTransition[];
  effects: ConfigEffectKind[];
  impact: SisadPdfmeConfigChangeImpact;
};

const diffCapability = (previous: CapabilityState, next: CapabilityState): CapabilityFlag[] =>
  CAPABILITY_FLAGS.filter((flag) => previous[flag] !== next[flag]);

export type PlanConfigChangeInput = {
  previous: ResolvedSisadPdfmeConfig;
  next: ResolvedSisadPdfmeConfig;
  /** Raw previo. Por defecto se toma `previous.raw`. */
  previousRaw?: SisadPdfmeGlobalConfig;
  /** Raw siguiente. Por defecto se toma `next.raw`. */
  nextRaw?: SisadPdfmeGlobalConfig;
  /**
   * Contexto de resolución. Debe ser el MISMO para ambos lados: un plan
   * comparando contextos distintos mide el contexto, no el cambio.
   */
  context?: CapabilityResolutionContext;
};

export const planConfigChange = ({
  previous,
  next,
  previousRaw,
  nextRaw,
  context = {},
}: PlanConfigChangeInput): ConfigChangeSet => {
  const impact = classifySisadPdfmeConfigChange(previousRaw ?? previous.raw ?? {}, nextRaw ?? next.raw ?? {});

  const fromHash = previous.hash ?? null;
  const toHash = next.hash ?? null;
  const unchanged = fromHash !== null && toHash !== null && fromHash === toHash;

  const previousStates = createCapabilityGraph(previous).resolveAll(context);
  const nextStates = createCapabilityGraph(next).resolveAll(context);

  const transitions: CapabilityTransition[] = [];
  Object.entries(nextStates).forEach(([id, nextState]) => {
    const previousState = previousStates[id];
    if (!previousState) return;
    const changedFlags = diffCapability(previousState, nextState);
    if (changedFlags.length) {
      transitions.push({ capabilityId: id, changedFlags, previous: previousState, next: nextState });
    }
  });

  const effects: ConfigEffectKind[] = [];
  if (impact.rebuildResources) effects.push('rebuild-resources');
  if (transitions.length) effects.push('recompute-capabilities');
  // Sólo se declara repintado de presentación cuando el cambio NO movió
  // ninguna capability: si las movió, recomputar ya implica repintar.
  if (impact.presentationOnly && !transitions.length && impact.touchedPaths.length) {
    effects.push('repaint-presentation');
  }

  return {
    fromRevision: previous.revision ?? null,
    toRevision: next.revision ?? null,
    fromHash,
    toHash,
    unchanged,
    touchedPaths: impact.touchedPaths,
    transitions,
    effects,
    impact,
  };
};

/** Capabilities que dejaron de ser ejecutables con este cambio. */
export const disabledCapabilities = (changeSet: ConfigChangeSet): CapabilityId[] =>
  changeSet.transitions
    .filter((transition) => transition.previous.executable && !transition.next.executable)
    .map((transition) => transition.capabilityId);

/** Capabilities que pasaron a ser ejecutables con este cambio. */
export const enabledCapabilities = (changeSet: ConfigChangeSet): CapabilityId[] =>
  changeSet.transitions
    .filter((transition) => !transition.previous.executable && transition.next.executable)
    .map((transition) => transition.capabilityId);
