import type { PdfExecutionArtifact } from './pdfComposition.js';

export type ExecutionResult = {
  executionId: string;
  runtimeSessionId: string;
  userId?: string;
  documents: Array<{ documentId: string; complete: boolean; snapshot: unknown }>;
  completion: unknown;
  artifacts: PdfExecutionArtifact[];
};

export const createExecutionResult = (input: ExecutionResult): ExecutionResult => ({
  ...input,
  documents: input.documents.map((document) => ({ ...document })),
  artifacts: input.artifacts.map((artifact) => ({ ...artifact })),
});

export const roundTripExecutionResult = (result: ExecutionResult): ExecutionResult =>
  JSON.parse(JSON.stringify(createExecutionResult(result))) as ExecutionResult;
