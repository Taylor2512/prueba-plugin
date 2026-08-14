import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { composePdfResults } from '@/sisad-pdfme/runtime/pdfComposition';

const pdf = async (pages: number) => {
  const document = await PDFDocument.create();
  for (let index = 0; index < pages; index += 1) document.addPage();
  return document.save();
};

describe('PDF composition', () => {
  it('appends PDFs and records provenance/page ranges', async () => {
    const result = await composePdfResults({
      mode: 'append', ordering: 'explicit', explicitOrder: ['b', 'a'], artifacts: [
        { artifactId: 'a', runtimeSessionId: 's-a', documentId: 'd-a', bytes: await pdf(1) },
        { artifactId: 'b', runtimeSessionId: 's-b', documentId: 'd-b', bytes: await pdf(2) },
      ],
    });
    expect(result.pages).toBe(3);
    expect(result.includedArtifacts).toEqual(['b', 'a']);
    expect(result.compositionManifest.sources.map((source) => source.pageRange)).toEqual([[1, 2], [3, 3]]);
  });

  it('selects the latest ordered artifact without persisting anything', async () => {
    const result = await composePdfResults({
      mode: 'select-latest', ordering: 'execution', artifacts: [
        { artifactId: 'old', executionId: '001', runtimeSessionId: 's', documentId: 'd', bytes: await pdf(1) },
        { artifactId: 'new', executionId: '002', runtimeSessionId: 's', documentId: 'd', bytes: await pdf(1) },
      ],
    });
    expect(result.includedArtifacts).toEqual(['new']);
  });
});
