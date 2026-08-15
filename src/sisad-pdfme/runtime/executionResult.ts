/**
 * Resultado durable de una ejecución.
 *
 * ## Separación bytes / estado durable (RTP-500)
 *
 * `roundTripExecutionResult` hacía `JSON.parse(JSON.stringify(result))` sobre
 * un objeto que puede contener `Uint8Array` o `Blob` dentro de sus artefactos.
 * `JSON.stringify` de un `Uint8Array` produce `{"0":37,"1":80,…}` —un objeto
 * con índices numéricos— y el `parse` NO lo devuelve como bytes. Es decir: el
 * roundtrip corrompía silenciosamente cualquier artefacto con contenido, y lo
 * hacía además inflando el estado durable con megabytes de PDF.
 *
 * El contrato es explícito: el estado durable NO hace roundtrip de bytes
 * arbitrarios. Aquí se separan:
 *
 * - **referencia durable**: id, procedencia, hash y tamaño — serializable;
 * - **contenido**: se transporta aparte, en un `ArtifactByteStore` que vive en
 *   memoria y no se serializa.
 */
import type { PdfExecutionArtifact } from '@sisad-pdfme/runtime/pdfComposition';

/** Referencia serializable a un artefacto. Nunca contiene bytes. */
export type ExecutionArtifactReference = {
  artifactId: string;
  runtimeSessionId: string;
  userId?: string;
  documentId: string;
  stageId?: string;
  executionId?: string;
  /** Hash del contenido cuando se conoce. Es la prueba de procedencia. */
  contentHash?: string;
  /** Tamaño en bytes cuando se conoce. */
  byteLength?: number;
  source?: { reference?: string };
  completedAt?: string;
  metadata?: Record<string, unknown>;
};

export type ExecutionResult = {
  executionId: string;
  runtimeSessionId: string;
  userId?: string;
  documents: Array<{ documentId: string; complete: boolean; snapshot: unknown }>;
  completion: unknown;
  artifacts: ExecutionArtifactReference[];
};

const fnv1a = (bytes: Uint8Array): string => {
  let hash = 2166136261;
  for (const byte of bytes) hash = Math.imul(hash ^ byte, 16777619);
  return (hash >>> 0).toString(16).padStart(8, '0');
};

/**
 * Convierte un artefacto con contenido en su referencia durable.
 *
 * El hash se calcula aquí, no lo declara el llamador: una procedencia que el
 * emisor puede inventar no es procedencia.
 */
export const toArtifactReference = (artifact: PdfExecutionArtifact): ExecutionArtifactReference => {
  const { bytes, ...rest } = artifact;
  return {
    ...rest,
    ...(bytes
      ? { contentHash: fnv1a(bytes), byteLength: bytes.byteLength }
      : {}),
  };
};

/**
 * Almacén de contenido de artefactos, propiedad de la instancia.
 *
 * No se serializa y no es un singleton: dos ejecuciones en el mismo realm no
 * comparten bytes.
 */
export class ArtifactByteStore {
  private readonly bytes = new Map<string, Uint8Array>();

  put(artifactId: string, content: Uint8Array): ExecutionArtifactReference['contentHash'] {
    this.bytes.set(artifactId, content);
    return fnv1a(content);
  }

  get(artifactId: string): Uint8Array | undefined {
    return this.bytes.get(artifactId);
  }

  has(artifactId: string): boolean {
    return this.bytes.has(artifactId);
  }

  /** Total de bytes retenidos. Permite acotar el uso de memoria. */
  byteLength(): number {
    let total = 0;
    this.bytes.forEach((value) => {
      total += value.byteLength;
    });
    return total;
  }

  delete(artifactId: string): boolean {
    return this.bytes.delete(artifactId);
  }

  clear(): number {
    const size = this.bytes.size;
    this.bytes.clear();
    return size;
  }
}

export const createArtifactByteStore = (): ArtifactByteStore => new ArtifactByteStore();

export const createExecutionResult = (input: ExecutionResult): ExecutionResult => ({
  ...input,
  documents: input.documents.map((document) => ({ ...document })),
  artifacts: input.artifacts.map((artifact) => ({ ...artifact })),
});

/**
 * Roundtrip del estado durable.
 *
 * Es seguro porque `ExecutionArtifactReference` no contiene bytes por
 * construcción. Si alguien cuela un `Uint8Array` en `metadata`, esta función
 * lo detecta en vez de corromperlo en silencio.
 */
export const roundTripExecutionResult = (result: ExecutionResult): ExecutionResult => {
  const durable = createExecutionResult(result);
  durable.artifacts.forEach((artifact) => {
    if (containsBinary(artifact.metadata)) {
      throw new Error(`execution-result-binary-in-metadata:${artifact.artifactId}`);
    }
  });
  return JSON.parse(JSON.stringify(durable)) as ExecutionResult;
};

const containsBinary = (value: unknown, depth = 0): boolean => {
  if (depth > 8 || !value || typeof value !== 'object') return false;
  if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) return true;
  if (typeof Blob !== 'undefined' && value instanceof Blob) return true;
  return Object.values(value as Record<string, unknown>).some((entry) => containsBinary(entry, depth + 1));
};
