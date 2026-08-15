/**
 * Puente entre el ciclo de vida de artifacts y el catálogo de exportación.
 *
 * `usePdfmeArtifacts` informa con `onStatus({ type, message, context })`, un
 * canal libre que solo entiende el host que lo montó. El contrato público, en
 * cambio, tiene `export.started`, `export.succeeded` y `export.failed`, con
 * `correlationId` para encadenar inicio y resultado.
 *
 * Esta traducción es pura: no emite, solo decide qué evento de exportación
 * corresponde. Quien emite es el dispatcher de la instancia.
 */
import type { SisadPdfmeEventName, SisadPdfmeEventPayloads } from '@sisad-pdfme/contracts/events';

export type ArtifactStatusEvent = {
  type: string;
  message?: string;
  context?: unknown;
};

export type ArtifactEvent =
  | { name: 'export.started'; payload: SisadPdfmeEventPayloads['export.started'] }
  | { name: 'export.succeeded'; payload: SisadPdfmeEventPayloads['export.succeeded'] }
  | { name: 'export.failed'; payload: SisadPdfmeEventPayloads['export.failed'] };

/** Formato del artifact según el prefijo del status. */
const FORMAT_BY_PREFIX: Record<string, string> = {
  generate: 'pdf',
  pdf2size: 'sizes',
  pdf2img: 'images',
  roundtrip: 'pdf',
  ui2pdf: 'pdf',
};

const parseStatusType = (type: string): { prefix: string; phase: string } | null => {
  const raw = String(type || '');
  const separator = raw.lastIndexOf('-');
  if (separator <= 0) return null;
  return { prefix: raw.slice(0, separator), phase: raw.slice(separator + 1) };
};

/**
 * Traduce un status de artifact al evento de exportación correspondiente.
 *
 * @returns `null` cuando el status no describe una fase de exportación
 * (por ejemplo `validation-error`, que pertenece al dominio de validación).
 */
export const artifactStatusToExportEvent = (
  status: ArtifactStatusEvent,
  options: { size?: number } = {},
): ArtifactEvent | null => {
  const parsed = parseStatusType(status?.type);
  if (!parsed) return null;

  const format = FORMAT_BY_PREFIX[parsed.prefix];
  if (!format) return null;

  if (parsed.phase === 'start') {
    return { name: 'export.started', payload: { format } };
  }

  if (parsed.phase === 'success') {
    return {
      name: 'export.succeeded',
      payload: { format, size: Number.isFinite(options.size) ? Number(options.size) : 0 },
    };
  }

  if (parsed.phase === 'error') {
    return {
      name: 'export.failed',
      payload: {
        format,
        error: {
          code: status.type,
          message: status.message || 'Error de exportación',
          recoverable: true,
        },
      },
    };
  }

  return null;
};

/** Nombres de exportación que este puente puede producir. Útil para pruebas. */
export const ARTIFACT_EVENT_NAMES: SisadPdfmeEventName[] = [
  'export.started',
  'export.succeeded',
  'export.failed',
];
