import { describe, expect, it } from 'vitest';
import {
  isExecutionStageComplete,
  resolveRunnableStages,
  validateExecutionPlan,
  type ExecutionPlan,
} from '@/sisad-pdfme/runtime/executionOrchestration';

const unit = (id: string, userId = id) => ({
  id, userId, documentIds: ['doc-1'], runtimeSessionId: `session-${id}`, isolation: 'isolated-copy' as const,
});

describe('generic execution orchestration', () => {
  it('validates and runs a single execution', () => {
    const plan: ExecutionPlan = { id: 'single', stages: [{ id: 'stage-1', order: 1, executions: [unit('a')], completionPolicy: 'all' }] };
    expect(validateExecutionPlan(plan)).toEqual([]);
    expect(resolveRunnableStages(plan)).toHaveLength(1);
    expect(resolveRunnableStages(plan, { completedExecutionIds: ['a'] })).toEqual([]);
  });

  it('enforces sequential barriers and parallel all completion', () => {
    const plan: ExecutionPlan = {
      id: 'mixed', stages: [
        { id: 'one', order: 1, executions: [unit('a'), unit('b')], completionPolicy: 'all' },
        { id: 'two', order: 2, executions: [unit('c')], completionPolicy: 'all' },
      ],
    };
    expect(resolveRunnableStages(plan).map((stage) => stage.id)).toEqual(['one']);
    expect(resolveRunnableStages(plan, { completedExecutionIds: ['a'] }).map((stage) => stage.id)).toEqual(['one']);
    expect(resolveRunnableStages(plan, { completedExecutionIds: ['a', 'b'] }).map((stage) => stage.id)).toEqual(['two']);
  });

  it('supports host barriers and validates massive fan-out identities', () => {
    const stage = { id: 'host', order: 1, executions: [unit('a')], completionPolicy: 'host' as const };
    expect(isExecutionStageComplete(stage, {})).toBe(false);
    expect(isExecutionStageComplete(stage, { completedStageIds: ['host'] })).toBe(true);
    const ids = new Set(Array.from({ length: 100 }, (_, index) => unit(`execution-${index}`).id));
    expect(ids.size).toBe(100);
  });

  it('supports mixed parallel stages followed by sequential and parallel stages', () => {
    const plan: ExecutionPlan = {
      id: 'mixed-full', stages: [
        { id: 'parallel-a-b', order: 1, executions: [unit('a'), unit('b')], completionPolicy: 'all' },
        { id: 'sequential-c', order: 2, executions: [unit('c')], completionPolicy: 'all' },
        { id: 'parallel-d-e', order: 3, executions: [unit('d'), unit('e')], completionPolicy: 'all' },
      ],
    };
    expect(resolveRunnableStages(plan).map((stage) => stage.id)).toEqual(['parallel-a-b']);
    expect(resolveRunnableStages(plan, { completedExecutionIds: ['a', 'b'] }).map((stage) => stage.id)).toEqual(['sequential-c']);
    expect(resolveRunnableStages(plan, { completedExecutionIds: ['a', 'b', 'c'] }).map((stage) => stage.id)).toEqual(['parallel-d-e']);
  });

  it.each([10, 50, 100])('fans out %i independent executions', (count) => {
    const plan: ExecutionPlan = { id: `massive-${count}`, stages: [{
      id: 'fan-out', order: 1,
      executions: Array.from({ length: count }, (_, index) => unit(`execution-${index}`, `user-${index}`)),
      completionPolicy: 'all',
    }] };
    expect(validateExecutionPlan(plan)).toEqual([]);
    expect(new Set(plan.stages[0].executions.map((execution) => execution.runtimeSessionId)).size).toBe(count);
  });
});
