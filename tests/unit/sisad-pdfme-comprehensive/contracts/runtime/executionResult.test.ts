/**
 * Estado durable de ejecución (RTP-500).
 *
 * `roundTripExecutionResult` hacía `JSON.parse(JSON.stringify(...))` sobre un
 * objeto que podía contener `Uint8Array`. `JSON.stringify` de un `Uint8Array`
 * produce un objeto con índices numéricos y el `parse` NO lo devuelve como
 * bytes: el roundtrip corrompía el artefacto en silencio y además inflaba el
 * estado durable con el PDF entero.
 */
import { describe, expect, it } from 'vitest';
import {
  createArtifactByteStore,
  roundTripExecutionResult,
  toArtifactReference,
  type ExecutionResult,
} from '@/sisad-pdfme/runtime/executionResult';

const baseResult = (artifacts: ExecutionResult['artifacts']): ExecutionResult => ({
  executionId: 'exec-1',
  runtimeSessionId: 'session-1',
  userId: 'user-a',
  documents: [{ documentId: 'doc-1', complete: true, snapshot: { values: { field: 'A' } } }],
  completion: { complete: true },
  artifacts,
});

describe('estado durable de ejecución', () => {
  it('hace roundtrip de snapshot, completitud y procedencia', () => {
    const result = roundTripExecutionResult(
      baseResult([
        {
          artifactId: 'pdf-1',
          runtimeSessionId: 'session-1',
          userId: 'user-a',
          documentId: 'doc-1',
          source: { reference: 'memory' },
        },
      ]),
    );
    expect(result.documents[0].snapshot).toEqual({ values: { field: 'A' } });
    expect(result.completion).toEqual({ complete: true });
    expect(result.artifacts[0].artifactId).toBe('pdf-1');
  });

  it('la referencia durable lleva hash y tamaño, nunca los bytes', () => {
    const bytes = new Uint8Array([37, 80, 68, 70]);
    const reference = toArtifactReference({
      artifactId: 'pdf-1',
      runtimeSessionId: 'session-1',
      documentId: 'doc-1',
      bytes,
    });
    expect(reference).not.toHaveProperty('bytes');
    expect(reference.byteLength).toBe(4);
    expect(reference.contentHash).toMatch(/^[0-9a-f]{8}$/);

    const roundTripped = roundTripExecutionResult(baseResult([reference]));
    expect(roundTripped.artifacts[0].contentHash).toBe(reference.contentHash);
    expect(roundTripped.artifacts[0].byteLength).toBe(4);
  });

  it('el hash lo calcula el runtime, no lo declara el emisor', () => {
    const left = toArtifactReference({
      artifactId: 'a',
      runtimeSessionId: 's',
      documentId: 'd',
      bytes: new Uint8Array([1, 2, 3]),
    });
    const right = toArtifactReference({
      artifactId: 'b',
      runtimeSessionId: 's',
      documentId: 'd',
      bytes: new Uint8Array([1, 2, 3]),
    });
    const otro = toArtifactReference({
      artifactId: 'c',
      runtimeSessionId: 's',
      documentId: 'd',
      bytes: new Uint8Array([9, 9, 9]),
    });
    expect(left.contentHash).toBe(right.contentHash);
    expect(left.contentHash).not.toBe(otro.contentHash);
  });

  it('detecta binario colado en metadata en vez de corromperlo', () => {
    const result = baseResult([
      {
        artifactId: 'pdf-1',
        runtimeSessionId: 'session-1',
        documentId: 'doc-1',
        metadata: { raw: new Uint8Array([1, 2, 3]) },
      },
    ]);
    expect(() => roundTripExecutionResult(result)).toThrow(/binary-in-metadata/);
  });
});

describe('almacén de bytes de artefacto', () => {
  it('guarda el contenido fuera del estado durable', () => {
    const store = createArtifactByteStore();
    const bytes = new Uint8Array([37, 80, 68, 70]);
    const hash = store.put('pdf-1', bytes);
    expect(store.get('pdf-1')).toBe(bytes);
    expect(store.byteLength()).toBe(4);
    expect(hash).toMatch(/^[0-9a-f]{8}$/);
  });

  it('no comparte contenido entre instancias', () => {
    const first = createArtifactByteStore();
    const second = createArtifactByteStore();
    first.put('pdf-1', new Uint8Array([1]));
    expect(second.has('pdf-1')).toBe(false);
  });

  it('permite liberar memoria', () => {
    const store = createArtifactByteStore();
    store.put('a', new Uint8Array([1, 2]));
    store.put('b', new Uint8Array([3]));
    expect(store.byteLength()).toBe(3);
    expect(store.delete('a')).toBe(true);
    expect(store.byteLength()).toBe(1);
    expect(store.clear()).toBe(1);
    expect(store.byteLength()).toBe(0);
  });
});
