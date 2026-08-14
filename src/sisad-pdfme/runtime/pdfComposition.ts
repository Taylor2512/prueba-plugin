/**
 * Composición de PDFs de una ejecución.
 *
 * ## Endurecimiento (RTP-505)
 *
 * La versión anterior aceptaba cualquier plan y cargaba cualquier cantidad de
 * bytes sin límite ni cancelación:
 *
 * - `mode: 'custom'` estaba declarado en el tipo pero **no implementado**: caía
 *   en la rama de `append` sin decirlo, así que un llamador creía estar usando
 *   una estrategia propia y obtenía concatenación;
 * - sin `AbortSignal`, una composición larga no se podía cancelar;
 * - sin cotas de bytes/páginas/artefactos, un plan hostil o simplemente grande
 *   agotaba la memoria de la pestaña;
 * - un PDF corrupto propagaba el error crudo de `pdf-lib`;
 * - `conflictsResolved` era siempre `[]` aunque hubiera conflictos sin
 *   resolver, y no había forma de impedir la publicación de un resultado en
 *   disputa.
 *
 * El contrato ahora: **sólo modos implementados**, orden determinista,
 * procedencia real cuando se declara, `AbortSignal`, cotas explícitas, entrada
 * malformada tratada, sin persistencia, y sin resultado final cuando queda un
 * conflicto sin resolver.
 */
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

/** Modos realmente implementados. No hay `custom`. */
export const PDF_COMPOSITION_MODES = ['append', 'select-latest'] as const;
export type PdfCompositionMode = (typeof PDF_COMPOSITION_MODES)[number];

export const PDF_COMPOSITION_ORDERINGS = ['document', 'user', 'stage', 'execution', 'explicit'] as const;
export type PdfCompositionOrdering = (typeof PDF_COMPOSITION_ORDERINGS)[number];

/** Cotas por defecto. Conservadoras a propósito: es memoria de pestaña. */
export const DEFAULT_COMPOSITION_LIMITS = {
  maxArtifacts: 64,
  maxPages: 2000,
  maxBytes: 128 * 1024 * 1024,
} as const;

export type PdfCompositionLimits = {
  maxArtifacts?: number;
  maxPages?: number;
  maxBytes?: number;
};

export type PdfCompositionPlan = {
  mode: PdfCompositionMode;
  ordering: PdfCompositionOrdering;
  artifacts: PdfExecutionArtifact[];
  explicitOrder?: string[];
  /** Conflictos canónicos sin resolver. Si hay alguno, no se compone nada. */
  unresolvedConflicts?: string[];
  limits?: PdfCompositionLimits;
  signal?: AbortSignal;
};

export type PdfCompositionManifest = {
  generatedAt: string;
  strategy: PdfCompositionMode;
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

export class PdfCompositionError extends Error {
  constructor(
    public readonly code:
      | 'unsupported-mode'
      | 'unsupported-ordering'
      | 'unresolved-conflict'
      | 'artifact-bytes-required'
      | 'artifact-limit-exceeded'
      | 'byte-limit-exceeded'
      | 'page-limit-exceeded'
      | 'malformed-artifact'
      | 'aborted',
    message: string,
  ) {
    super(message);
    this.name = 'PdfCompositionError';
  }
}

const hashBytes = (bytes: Uint8Array): string => {
  let hash = 2166136261;
  for (const byte of bytes) hash = Math.imul(hash ^ byte, 16777619);
  return (hash >>> 0).toString(16).padStart(8, '0');
};

const throwIfAborted = (signal?: AbortSignal) => {
  if (signal?.aborted) {
    throw new PdfCompositionError('aborted', 'composición cancelada');
  }
};

/**
 * Orden determinista.
 *
 * Los comparadores de campo se desempatan siempre por `artifactId`: sin eso,
 * dos artefactos del mismo documento quedaban en orden de inserción y la
 * composición dejaba de ser reproducible.
 */
const orderedArtifacts = (plan: PdfCompositionPlan): PdfExecutionArtifact[] => {
  const artifacts = [...plan.artifacts];
  if (plan.ordering === 'explicit') {
    const order = new Map((plan.explicitOrder ?? []).map((id, index) => [id, index]));
    return artifacts.sort((left, right) => {
      const a = order.get(left.artifactId) ?? Number.MAX_SAFE_INTEGER;
      const b = order.get(right.artifactId) ?? Number.MAX_SAFE_INTEGER;
      return a === b ? left.artifactId.localeCompare(right.artifactId) : a - b;
    });
  }
  const key = (artifact: PdfExecutionArtifact) =>
    String(
      plan.ordering === 'document'
        ? artifact.documentId
        : plan.ordering === 'user'
          ? artifact.userId
          : plan.ordering === 'stage'
            ? artifact.stageId
            : artifact.executionId,
    );
  return artifacts.sort((left, right) => {
    const comparison = key(left).localeCompare(key(right));
    return comparison !== 0 ? comparison : left.artifactId.localeCompare(right.artifactId);
  });
};

export const composePdfResults = async (plan: PdfCompositionPlan): Promise<PdfCompositionResult> => {
  if (!PDF_COMPOSITION_MODES.includes(plan.mode)) {
    throw new PdfCompositionError('unsupported-mode', `modo no implementado: ${String(plan.mode)}`);
  }
  if (!PDF_COMPOSITION_ORDERINGS.includes(plan.ordering)) {
    throw new PdfCompositionError('unsupported-ordering', `orden no implementado: ${String(plan.ordering)}`);
  }
  // Un conflicto canónico sin resolver no puede producir un resultado final.
  if (plan.unresolvedConflicts?.length) {
    throw new PdfCompositionError(
      'unresolved-conflict',
      `conflictos sin resolver: ${plan.unresolvedConflicts.join(', ')}`,
    );
  }
  throwIfAborted(plan.signal);

  const limits = { ...DEFAULT_COMPOSITION_LIMITS, ...(plan.limits ?? {}) };
  const selected = plan.mode === 'select-latest' ? orderedArtifacts(plan).slice(-1) : orderedArtifacts(plan);

  if (selected.length > limits.maxArtifacts) {
    throw new PdfCompositionError(
      'artifact-limit-exceeded',
      `${selected.length} artefactos supera el máximo de ${limits.maxArtifacts}`,
    );
  }

  const totalBytes = selected.reduce((sum, artifact) => sum + (artifact.bytes?.byteLength ?? 0), 0);
  if (totalBytes > limits.maxBytes) {
    throw new PdfCompositionError(
      'byte-limit-exceeded',
      `${totalBytes} bytes supera el máximo de ${limits.maxBytes}`,
    );
  }

  const output = await PDFDocument.create();
  const sources: PdfCompositionManifest['sources'] = [];
  let pageCursor = 1;

  for (const artifact of selected) {
    throwIfAborted(plan.signal);
    if (!artifact.bytes?.byteLength) {
      throw new PdfCompositionError(
        'artifact-bytes-required',
        `el artefacto ${artifact.artifactId} no trae contenido`,
      );
    }

    let input: PDFDocument;
    try {
      input = await PDFDocument.load(artifact.bytes);
    } catch (error) {
      throw new PdfCompositionError(
        'malformed-artifact',
        `el artefacto ${artifact.artifactId} no es un PDF legible: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    const indices = input.getPageIndices();
    if (pageCursor - 1 + indices.length > limits.maxPages) {
      throw new PdfCompositionError(
        'page-limit-exceeded',
        `la composición supera el máximo de ${limits.maxPages} páginas`,
      );
    }

    const pages = await output.copyPages(input, indices);
    pages.forEach((page) => output.addPage(page));
    sources.push({
      artifactId: artifact.artifactId,
      runtimeSessionId: artifact.runtimeSessionId,
      userId: artifact.userId,
      documentId: artifact.documentId,
      stageId: artifact.stageId,
      executionId: artifact.executionId,
      // Procedencia calculada sobre los bytes reales, no declarada por el emisor.
      sourceHash: hashBytes(artifact.bytes),
      pageRange: [pageCursor, pageCursor + pages.length - 1],
    });
    pageCursor += pages.length;
  }

  throwIfAborted(plan.signal);

  return {
    bytes: await output.save(),
    pages: output.getPageCount(),
    includedArtifacts: selected.map((artifact) => artifact.artifactId),
    compositionManifest: {
      generatedAt: new Date().toISOString(),
      strategy: plan.mode,
      sources,
      conflictsResolved: [],
    },
  };
};
