# PDF composition contract

```ts
type PdfExecutionArtifact = {
  artifactId: string;
  runtimeSessionId: string;
  userId?: string;
  documentId: string;
  stageId?: string;
  executionId?: string;
  bytes?: Uint8Array;
  source?: unknown;
  metadata?: Record<string, unknown>;
};

type PdfCompositionPlan = {
  mode: 'append' | 'canonical-merge' | 'select-latest' | 'custom';
  ordering: 'document' | 'user' | 'stage' | 'execution' | 'explicit';
  artifacts: PdfExecutionArtifact[];
  explicitOrder?: string[];
};

type PdfCompositionResult = {
  bytes: Uint8Array;
  pages: number;
  includedArtifacts: string[];
  manifest: PdfCompositionManifest;
};
```

El composer no persiste, no envía y no conoce lifecycle del host.
