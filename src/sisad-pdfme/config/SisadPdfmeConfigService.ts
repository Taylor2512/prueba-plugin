import { cloneDeep } from '@sisad-pdfme/common';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeGlobalConfig } from './SisadPdfmeConfig.js';
import { createSisadPdfmeConfig } from './createSisadPdfmeConfig.js';
import { classifySisadPdfmeConfigChange, type SisadPdfmeConfigChangeImpact } from './configChangeImpact.js';
import { migrateSisadPdfmeConfig, type SisadPdfmeConfigMigrationIssue } from './configMigration.js';
import { validateSisadPdfmeConfig, type SisadPdfmeConfigIssue } from './configValidation.js';
import {
  createSisadPdfmeConfigSelectors,
  selectActionState,
  selectComponentState,
  selectFeatureState,
  type SisadPdfmeConfigSelectors,
} from './configSelectors.js';
import type { ActionContext, ActionId, SisadPdfmeActionState } from './actionConfigRegistry.js';
import type { ComponentContext, ComponentId, SisadPdfmeComponentState } from './componentRegistry.js';
import type { FeatureContext, FeatureId, SisadPdfmeFeatureState } from './featureRegistry.js';

export type SisadPdfmeConfigChange = {
  previous: ResolvedSisadPdfmeConfig;
  next: ResolvedSisadPdfmeConfig;
  impact: SisadPdfmeConfigChangeImpact;
  issues: SisadPdfmeConfigIssue[];
  migrationIssues: SisadPdfmeConfigMigrationIssue[];
};

export type SisadPdfmeConfigServiceListener = (change: SisadPdfmeConfigChange) => void;

export interface SisadPdfmeConfigService {
  getRawConfig(): SisadPdfmeGlobalConfig;
  getResolvedConfig(): ResolvedSisadPdfmeConfig;
  getIssues(): SisadPdfmeConfigIssue[];
  getMigrationIssues(): SisadPdfmeConfigMigrationIssue[];
  getSelectors(): SisadPdfmeConfigSelectors;
  selectFeatureState(featureId: FeatureId, context?: FeatureContext): SisadPdfmeFeatureState;
  selectActionState(actionId: ActionId, context?: ActionContext): SisadPdfmeActionState;
  selectComponentState(componentId: ComponentId, context?: ComponentContext): SisadPdfmeComponentState;
  replace(next: SisadPdfmeGlobalConfig): SisadPdfmeConfigChange;
  update(patch: Partial<SisadPdfmeGlobalConfig>): SisadPdfmeConfigChange;
  reset(): SisadPdfmeConfigChange;
  transaction<T>(run: (service: SisadPdfmeConfigService) => T): T;
  subscribe(listener: SisadPdfmeConfigServiceListener): () => void;
  explain(): {
    raw: SisadPdfmeGlobalConfig;
    issues: SisadPdfmeConfigIssue[];
    migrationIssues: SisadPdfmeConfigMigrationIssue[];
    selectors: SisadPdfmeConfigSelectors;
  };
}

const isResolvedConfigValue = (value: unknown): value is ResolvedSisadPdfmeConfig =>
  Boolean(value && typeof value === 'object' && 'config' in value && 'runtimeOptions' in value && 'designerEngine' in value);

const isRecordLike = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const mergeConfigRecord = <T extends Record<string, unknown>>(base: T, patch?: Record<string, unknown>): T => {
  if (!isRecordLike(patch)) return { ...base };
  const next = { ...base } as Record<string, unknown>;
  Object.entries(patch).forEach(([key, value]) => {
    const current = next[key];
    if (isRecordLike(current) && isRecordLike(value)) {
      next[key] = mergeConfigRecord(current, value);
      return;
    }
    if (Array.isArray(value)) {
      next[key] = value.slice();
      return;
    }
    next[key] = value;
  });
  return next as T;
};

class SisadPdfmeConfigServiceImpl implements SisadPdfmeConfigService {
  private readonly initialRaw: SisadPdfmeGlobalConfig;
  private raw: SisadPdfmeGlobalConfig;
  private resolved: ResolvedSisadPdfmeConfig;
  private issues: SisadPdfmeConfigIssue[] = [];
  private migrationIssues: SisadPdfmeConfigMigrationIssue[] = [];
  private listeners = new Set<SisadPdfmeConfigServiceListener>();
  private pendingRaw: SisadPdfmeGlobalConfig | null = null;
  private transactionDepth = 0;

  constructor(initial: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig = {}) {
    if (isResolvedConfigValue(initial)) {
      this.initialRaw = cloneDeep(initial.raw || {});
      this.raw = cloneDeep(initial.raw || {});
      this.resolved = initial;
      this.syncDiagnostics(true);
    } else {
      this.initialRaw = cloneDeep(initial || {});
      this.raw = cloneDeep(initial || {});
      this.resolved = createSisadPdfmeConfig(this.raw);
      this.syncDiagnostics(false);
    }
  }

  getRawConfig(): SisadPdfmeGlobalConfig {
    return this.raw;
  }

  getResolvedConfig(): ResolvedSisadPdfmeConfig {
    return this.resolved;
  }

  getIssues(): SisadPdfmeConfigIssue[] {
    return this.issues;
  }

  getMigrationIssues(): SisadPdfmeConfigMigrationIssue[] {
    return this.migrationIssues;
  }

  getSelectors(): SisadPdfmeConfigSelectors {
    return createSisadPdfmeConfigSelectors(this.resolved);
  }

  selectFeatureState(featureId: FeatureId, context: FeatureContext = {}): SisadPdfmeFeatureState {
    return selectFeatureState(this.resolved, featureId, context);
  }

  selectActionState(actionId: ActionId, context: ActionContext = {}): SisadPdfmeActionState {
    return selectActionState(this.resolved, actionId, context);
  }

  selectComponentState(componentId: ComponentId, context: ComponentContext = {}): SisadPdfmeComponentState {
    return selectComponentState(this.resolved, componentId, context);
  }

  replace(next: SisadPdfmeGlobalConfig): SisadPdfmeConfigChange {
    return this.commit(next);
  }

  update(patch: Partial<SisadPdfmeGlobalConfig>): SisadPdfmeConfigChange {
    const baseRaw = this.pendingRaw ?? this.raw;
    const next = mergeConfigRecord(cloneDeep(baseRaw || {}) as Record<string, unknown>, patch as Record<string, unknown>);
    return this.commit(next as SisadPdfmeGlobalConfig);
  }

  reset(): SisadPdfmeConfigChange {
    return this.commit(cloneDeep(this.initialRaw));
  }

  transaction<T>(run: (service: SisadPdfmeConfigService) => T): T {
    this.transactionDepth += 1;
    try {
      return run(this);
    } finally {
      this.transactionDepth -= 1;
      if (this.transactionDepth === 0 && this.pendingRaw) {
        this.commit(this.pendingRaw);
        this.pendingRaw = null;
      }
    }
  }

  subscribe(listener: SisadPdfmeConfigServiceListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  explain() {
    return {
      raw: this.raw,
      issues: this.issues,
      migrationIssues: this.migrationIssues,
      selectors: this.getSelectors(),
    };
  }

  private syncDiagnostics(preserveResolved = false) {
    const migration = migrateSisadPdfmeConfig(this.raw);
    this.migrationIssues = migration.issues;
    this.issues = validateSisadPdfmeConfig(this.raw);
    this.raw = migration.config;
    if (!preserveResolved) {
      this.resolved = createSisadPdfmeConfig(this.raw);
    }
  }

  private commit(nextRaw: SisadPdfmeGlobalConfig): SisadPdfmeConfigChange {
    if (this.transactionDepth > 0) {
      this.pendingRaw = cloneDeep(nextRaw);
      return this.buildChange(this.resolved, this.resolved, { touchedPaths: [], presentationOnly: false, rebuildResources: false });
    }

    const previous = this.resolved;
    const normalizedNextRaw = cloneDeep(nextRaw || {});
    const migration = migrateSisadPdfmeConfig(normalizedNextRaw);
    const impact = classifySisadPdfmeConfigChange(this.raw, migration.config);
    const nextResolved = createSisadPdfmeConfig(migration.config);

    if (!impact.rebuildResources) {
      nextResolved.designerEngine = previous.designerEngine;
      nextResolved.eventHub = previous.eventHub;
      nextResolved.adapters = previous.adapters;
    }

    this.raw = migration.config;
    this.resolved = nextResolved;
    this.migrationIssues = migration.issues;
    this.issues = validateSisadPdfmeConfig(this.raw);

    const change = this.buildChange(previous, nextResolved, impact);
    this.notify(change);
    return change;
  }

  private buildChange(
    previous: ResolvedSisadPdfmeConfig,
    next: ResolvedSisadPdfmeConfig,
    impact: SisadPdfmeConfigChangeImpact,
  ): SisadPdfmeConfigChange {
    return {
      previous,
      next,
      impact,
      issues: this.issues,
      migrationIssues: this.migrationIssues,
    };
  }

  private notify(change: SisadPdfmeConfigChange) {
    this.listeners.forEach((listener) => listener(change));
  }
}

export const createSisadPdfmeConfigService = (
  initial: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig = {},
): SisadPdfmeConfigService => new SisadPdfmeConfigServiceImpl(initial);
