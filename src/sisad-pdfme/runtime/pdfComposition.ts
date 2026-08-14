import { PDFDocument } from 'pdf-lib';

export type PdfExecutionArtifact = {
  artifactId: string;
  runtimeSessionId: string;
  userId?: string;
  documentId: string;
  stageId?: string;
  executionId?: string;
  bytes?: Uint8Array;
  source?: { reference?: string };
  completedAt?: string;
  metadata?: Record<string, unknown>;
};

export type PdfCompositionPlan = {
  mode: 'append' | 'select-latest' | 'custom';
  ordering: 'document' | 'user' | 'stage' | 'execution' | 'explicit';
  artifacts: PdfExecutionArtifact[];
  explicitOrder?: string[];
};

export type PdfCompositionManifest = {
  generatedAt: string;
  strategy: PdfCompositionPlan['mode'];
  sources: Array<{
    artifactId: string;
    runtimeSessionId: string;
    userId?: string;
    documentId: string;
    stageId?: string;
    executionId?: string;
    sourceHash: string;
    pageRange: [number, number];
  }>;
  conflictsResolved: string[];
};

export type PdfCompositionResult = {
  bytes: Uint8Array;
  pages: number;
  includedArtifacts: string[];
  compositionManifest: PdfCompositionManifest;
};

const hashBytes = (bytes: Uint8Array): string => {
  let hash = 2166136261;
  for (const byte of bytes) hash = Math.imul(hash ^ byte, 16777619);
  return (hash >>> 0).toString(16).padStart(8, '0');
};

const orderedArtifacts = (plan: PdfCompositionPlan): PdfExecutionArtifact[] => {
  const artifacts = [...plan.artifacts];
  if (plan.ordering === 'explicit') {
    const order = new Map((plan.explicitOrder ?? []).map((id, index) => [id, index]));
    return artifacts.sort((a, b) => (order.get(a.artifactId) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.artifactId) ?? Number.MAX_SAFE_INTEGER));
  }
  const key = (artifact: PdfExecutionArtifact) => String(
    plan.ordering === 'document' ? artifact.documentId
      : plan.ordering === 'user' ? artifact.userId
        : plan.ordering === 'stage' ? artifact.stageId
          : artifact.executionId,
  );
  return artifacts.sort((a, b) => key(a).localeCompare(key(b)));
};

export const composePdfResults = async (plan: PdfCompositionPlan): Promise<PdfCompositionResult> => {
  const selected = plan.mode === 'select-latest'
    ? orderedArtifacts(plan).slice(-1)
    : orderedArtifacts(plan);
  const output = await PDFDocument.create();
  const sources: PdfCompositionManifest['sources'] = [];
  let pageCursor = 1;
  for (const artifact of selected) {
    if (!artifact.bytes) throw new Error(`pdf-artifact-bytes-required:${artifact.artifactId}`);
    const input = await PDFDocument.load(artifact.bytes);
    const pages = await output.copyPages(input, input.getPageIndices());
    pages.forEach((page) => output.addPage(page));
    sources.push({
      artifactId: artifact.artifactId,
      runtimeSessionId: artifact.runtimeSessionId,
      userId: artifact.userId,
      documentId: artifact.documentId,
      stageId: artifact.stageId,
      executionId: artifact.executionId,
      sourceHash: hashBytes(artifact.bytes),
      pageRange: [pageCursor, pageCursor + pages.length - 1],
    });
    pageCursor += pages.length;
  }
  return {
    bytes: await output.save(),
    pages: output.getPageCount(),
    includedArtifacts: selected.map((artifact) => artifact.artifactId),
    compositionManifest: { generatedAt: new Date().toISOString(), strategy: plan.mode, sources, conflictsResolved: [] },
  };
};
