# PDF composition manifest

Todo resultado compuesto debe explicar sus fuentes.

```ts
type PdfCompositionManifest = {
  strategy: string;
  sources: Array<{
    artifactId: string;
    runtimeSessionId: string;
    userId?: string;
    documentId: string;
    stageId?: string;
    executionId?: string;
    sourceHash?: string;
    pageRange?: [number, number];
  }>;
  conflictsResolved: Array<Record<string, unknown>>;
  canonicalSnapshotHash?: string;
};
```

No almacenar secretos.
