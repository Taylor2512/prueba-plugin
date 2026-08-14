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

/**
 * Endurecimiento de la composición (RTP-505).
 *
 * Antes: `mode: 'custom'` estaba en el tipo pero caía silenciosamente en
 * `append`; no había `AbortSignal`, ni cotas de bytes/páginas/artefactos, ni
 * tratamiento de PDF corrupto, ni forma de impedir publicar con un conflicto
 * canónico sin resolver.
 */
describe('composición acotada y segura', () => {
  it('rechaza un modo no implementado en vez de caer en append', async () => {
    await expect(
      composePdfResults({
        mode: 'custom' as never,
        ordering: 'document',
        artifacts: [{ artifactId: 'a', runtimeSessionId: 's', documentId: 'd', bytes: await pdf(1) }],
      }),
    ).rejects.toMatchObject({ code: 'unsupported-mode' });
  });

  it('no produce resultado final con un conflicto canónico sin resolver', async () => {
    await expect(
      composePdfResults({
        mode: 'append',
        ordering: 'document',
        unresolvedConflicts: ['schema-en-disputa'],
        artifacts: [{ artifactId: 'a', runtimeSessionId: 's', documentId: 'd', bytes: await pdf(1) }],
      }),
    ).rejects.toMatchObject({ code: 'unresolved-conflict' });
  });

  it('honra AbortSignal antes de empezar', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      composePdfResults({
        mode: 'append',
        ordering: 'document',
        signal: controller.signal,
        artifacts: [{ artifactId: 'a', runtimeSessionId: 's', documentId: 'd', bytes: await pdf(1) }],
      }),
    ).rejects.toMatchObject({ code: 'aborted' });
  });

  it('acota número de artefactos, bytes y páginas', async () => {
    const bytes = await pdf(2);
    const artifacts = [
      { artifactId: 'a', runtimeSessionId: 's', documentId: 'd', bytes },
      { artifactId: 'b', runtimeSessionId: 's', documentId: 'd', bytes },
    ];

    await expect(
      composePdfResults({ mode: 'append', ordering: 'document', artifacts, limits: { maxArtifacts: 1 } }),
    ).rejects.toMatchObject({ code: 'artifact-limit-exceeded' });

    await expect(
      composePdfResults({ mode: 'append', ordering: 'document', artifacts, limits: { maxBytes: 10 } }),
    ).rejects.toMatchObject({ code: 'byte-limit-exceeded' });

    await expect(
      composePdfResults({ mode: 'append', ordering: 'document', artifacts, limits: { maxPages: 3 } }),
    ).rejects.toMatchObject({ code: 'page-limit-exceeded' });
  });

  it('trata la entrada malformada en vez de propagar el error crudo', async () => {
    await expect(
      composePdfResults({
        mode: 'append',
        ordering: 'document',
        artifacts: [
          { artifactId: 'roto', runtimeSessionId: 's', documentId: 'd', bytes: new Uint8Array([1, 2, 3, 4]) },
        ],
      }),
    ).rejects.toMatchObject({ code: 'malformed-artifact' });
  });

  it('exige contenido: un artefacto vacío no se compone', async () => {
    await expect(
      composePdfResults({
        mode: 'append',
        ordering: 'document',
        artifacts: [{ artifactId: 'vacio', runtimeSessionId: 's', documentId: 'd' }],
      }),
    ).rejects.toMatchObject({ code: 'artifact-bytes-required' });
  });

  it('el orden es determinista aunque el campo de orden empate', async () => {
    const build = async () => ({
      mode: 'append' as const,
      ordering: 'document' as const,
      artifacts: [
        { artifactId: 'z', runtimeSessionId: 's', documentId: 'mismo', bytes: await pdf(1) },
        { artifactId: 'a', runtimeSessionId: 's', documentId: 'mismo', bytes: await pdf(1) },
      ],
    });
    const first = await composePdfResults(await build());
    const second = await composePdfResults(await build());
    expect(first.includedArtifacts).toEqual(['a', 'z']);
    expect(second.includedArtifacts).toEqual(first.includedArtifacts);
  });

  it('la procedencia se calcula sobre los bytes reales', async () => {
    const bytes = await pdf(1);
    const result = await composePdfResults({
      mode: 'append',
      ordering: 'document',
      artifacts: [{ artifactId: 'a', runtimeSessionId: 's', documentId: 'd', bytes }],
    });
    expect(result.compositionManifest.sources[0].sourceHash).toMatch(/^[0-9a-f]{8}$/);
  });
});
