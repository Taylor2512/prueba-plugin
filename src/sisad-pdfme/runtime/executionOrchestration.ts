export type ExecutionIsolation = 'isolated-copy' | 'shared-document';
export type ExecutionCompletionPolicy = 'all' | 'any' | 'host';

export type ExecutionUnit = {
  id: string;
  userId: string;
  documentIds: string[];
  runtimeSessionId: string;
  isolation: ExecutionIsolation;
  metadata?: Record<string, unknown>;
};

export type ExecutionStage = {
  id: string;
  order: number;
  executions: ExecutionUnit[];
  completionPolicy: ExecutionCompletionPolicy;
};

export type ExecutionPlan = { id: string; stages: ExecutionStage[] };

export type ExecutionOrchestrationState = {
  completedExecutionIds?: Iterable<string>;
  completedStageIds?: Iterable<string>;
};

export const validateExecutionPlan = (plan: ExecutionPlan): string[] => {
  const errors: string[] = [];
  if (!plan.id.trim()) errors.push('plan-id-required');
  const stageIds = new Set<string>();
  const executionIds = new Set<string>();
  for (const stage of plan.stages) {
    if (stageIds.has(stage.id)) errors.push(`duplicate-stage:${stage.id}`);
    stageIds.add(stage.id);
    for (const execution of stage.executions) {
      if (executionIds.has(execution.id)) errors.push(`duplicate-execution:${execution.id}`);
      executionIds.add(execution.id);
      if (!execution.userId) errors.push(`execution-user-required:${execution.id}`);
      if (!execution.runtimeSessionId) errors.push(`execution-session-required:${execution.id}`);
      if (execution.documentIds.length === 0) errors.push(`execution-document-required:${execution.id}`);
    }
  }
  return errors;
};

export const isExecutionStageComplete = (
  stage: ExecutionStage,
  state: ExecutionOrchestrationState,
): boolean => {
  if (stage.completionPolicy === 'host') return new Set(state.completedStageIds ?? []).has(stage.id);
  const completed = new Set(state.completedExecutionIds ?? []);
  const count = stage.executions.filter((execution) => completed.has(execution.id)).length;
  return stage.completionPolicy === 'all'
    ? count === stage.executions.length
    : count > 0;
};

/** Returns runnable stages; scheduling remains outside Form and schemas. */
export const resolveRunnableStages = (
  plan: ExecutionPlan,
  state: ExecutionOrchestrationState = {},
): ExecutionStage[] => {
  const ordered = [...plan.stages].sort((a, b) => a.order - b.order);
  return ordered.filter((stage, index) => {
    if (index === 0) return true;
    return ordered.slice(0, index).every((previous) => isExecutionStageComplete(previous, state));
  }).filter((stage) => !isExecutionStageComplete(stage, state));
};

export const fanOutExecutionUnits = (
  plan: ExecutionPlan,
  units: ExecutionUnit[],
): ExecutionPlan => ({
  ...plan,
  stages: plan.stages.map((stage) => ({
    ...stage,
    executions: [...stage.executions, ...units.filter((unit) => !stage.executions.some((existing) => existing.id === unit.id))],
  })),
});
