import { cloneDeep } from '@sisad-pdfme/common';
import { ensureAnchorId, ensureComment } from '@sisad-pdfme/common/collaboration';

import type {
  Command,
  CommandObserverPayload,
  SchemaForUI,
  Template,
  TopLevelPdfCommentEntry,
} from '@sisad-pdfme/common';

/**
 * Argumentos necesarios para construir un comando reversible basado
 * en snapshot de una página.
 */
type PageSnapshotCommandArgs = {
  id: string;
  label: string;
  pageIndex: number;
  beforeSchemas: SchemaForUI[];
  afterSchemas: SchemaForUI[];
  schemaEvents: CommandObserverPayload[];
  applyPageSchemas: (pageIndex: number, nextPageSchemas: SchemaForUI[]) => void;
  meta?: Record<string, unknown>;
};

/**
 * Argumentos necesarios para construir un comando reversible basado
 * en snapshot completo de template.
 */
type TemplateSnapshotCommandArgs = {
  id: string;
  label: string;
  events?: CommandObserverPayload[];
  beforeTemplate: Template;
  afterTemplate: Template;
  applyTemplate: (template: Template) => void | Promise<void>;
  meta?: Record<string, unknown>;
};

/**
 * Crea un comando reversible basado en snapshot de una página.
 */
export const createPageSnapshotCommand = ({
  id,
  label,
  pageIndex,
  beforeSchemas,
  afterSchemas,
  schemaEvents,
  applyPageSchemas,
  meta = {},
}: PageSnapshotCommandArgs): Command => ({
  id,
  label,
  meta,
  execute: ({ emit }) => {
    applyPageSchemas(pageIndex, cloneDeep(afterSchemas));
    schemaEvents.forEach((event) => emit(event));
  },
  undo: ({ emit }) => {
    applyPageSchemas(pageIndex, cloneDeep(beforeSchemas));
    schemaEvents.forEach((event) =>
      emit({
        ...event,
        payload: {
          ...(event.payload || {}),
          direction: 'undo',
        },
      }),
    );
  },
  redo: ({ emit }) => {
    applyPageSchemas(pageIndex, cloneDeep(afterSchemas));
    schemaEvents.forEach((event) =>
      emit({
        ...event,
        payload: {
          ...(event.payload || {}),
          direction: 'redo',
        },
      }),
    );
  },
});

/**
 * Crea un comando reversible basado en snapshot completo de template.
 */
export const createTemplateSnapshotCommand = ({
  id,
  label,
  events = [],
  beforeTemplate,
  afterTemplate,
  applyTemplate,
  meta = {},
}: TemplateSnapshotCommandArgs): Command => ({
  id,
  label,
  meta,
  execute: ({ emit }) => {
    return Promise.resolve(applyTemplate(cloneDeep(afterTemplate))).then(() => {
      events.forEach((event) => emit(event));
    });
  },
  undo: ({ emit }) => {
    return Promise.resolve(applyTemplate(cloneDeep(beforeTemplate))).then(() => {
      events.forEach((event) =>
        emit({
          ...event,
          payload: {
            ...(event.payload || {}),
            direction: 'undo',
          },
        }),
      );
    });
  },
  redo: ({ emit }) => {
    return Promise.resolve(applyTemplate(cloneDeep(afterTemplate))).then(() => {
      events.forEach((event) =>
        emit({
          ...event,
          payload: {
            ...(event.payload || {}),
            direction: 'redo',
          },
        }),
      );
    });
  },
});

/**
 * Crea un evento observable relacionado con comentarios.
 */
export const createCommentCommand = ({
  id,
  label,
  targetComment,
  execute,
  undo,
  meta = {},
}: {
  id: string;
  label: string;
  targetComment: TopLevelPdfCommentEntry;
  execute: () => void;
  undo: () => void;
  meta?: Record<string, unknown>;
}): Command => ({
  id,
  label,
  meta,
  execute: ({ emit }) => {
    execute();
    const pageNumber = (targetComment && ((targetComment.comment && targetComment.comment.pageNumber) ?? (targetComment.anchor && targetComment.anchor.pageNumber))) ?? undefined;
    const pageIndex = Number.isFinite(Number(pageNumber)) ? Math.max(0, Number(pageNumber) - 1) : undefined;
    emit({ type: 'comment.updated', pageIndex });
  },
  undo: ({ emit }) => {
    undo();
    const pageNumber = (targetComment && ((targetComment.comment && targetComment.comment.pageNumber) ?? (targetComment.anchor && targetComment.anchor.pageNumber))) ?? undefined;
    const pageIndex = Number.isFinite(Number(pageNumber)) ? Math.max(0, Number(pageNumber) - 1) : undefined;
    emit({ type: 'comment.updated', pageIndex });
  },
});

/**
 * Construye un payload observable para eventos de comentario.
 */
export const createCommentCommandEvent = (
  type: CommandObserverPayload['type'],
  commentId: string,
  fileId?: string | null,
  schemaId?: string,
  pageIndex?: number,
): CommandObserverPayload => ({
  type,
  commentId,
  fileId: fileId ?? null,
  schemaId,
  pageIndex,
});

/**
 * Construye una entrada top-level de comentario para snapshots globales.
 */
export const buildTopLevelCommentEntry = (entry: TopLevelPdfCommentEntry): TopLevelPdfCommentEntry => ({
  id: String(entry?.id || (entry as any)?.comment?.id || (entry as any)?.anchor?.id || ''),
  anchor: ensureAnchorId((entry as any)?.anchor || (entry as any)?.comment?.anchor || {}) as TopLevelPdfCommentEntry['anchor'],
  comment: ensureComment((entry as any)?.comment || entry) as unknown as TopLevelPdfCommentEntry['comment'],
});

/* ------------------------------------------------------------------ */
/* Comandos de estructura de página (COREUX-016)                       */
/* ------------------------------------------------------------------ */

export type PageStructureOperation = 'insert' | 'duplicate' | 'remove';

/** Motivo por el que una operación de página se rechaza. */
export type PageStructureRejection = 'last-page' | 'index-out-of-range';

export type PageStructureResult<T> =
  | { ok: true; pages: T[][] }
  | { ok: false; reason: PageStructureRejection };

/** Sufija ids repetidos para que duplicar no rompa la unicidad del template. */
const withUniqueIds = <T extends Record<string, unknown>>(
  schemas: T[],
  taken: Set<string>,
): T[] =>
  schemas.map((schema) => {
    const next = cloneDeep(schema) as Record<string, unknown>;
    ['id', 'schemaUid', 'name'].forEach((key) => {
      const value = next[key];
      if (typeof value !== 'string' || !value) return;
      let candidate = `${value}-copy`;
      let counter = 2;
      while (taken.has(candidate)) {
        candidate = `${value}-copy-${counter}`;
        counter += 1;
      }
      taken.add(candidate);
      next[key] = candidate;
    });
    return next as T;
  });

/**
 * Aplica una operación de estructura sobre las páginas.
 *
 * Función pura: devuelve páginas nuevas o el motivo del rechazo. No muta la
 * entrada, así que sirve tanto para ejecutar como para previsualizar si la
 * operación sería válida (por ejemplo, para deshabilitar un botón con motivo).
 */
export const applyPageStructure = <T extends Record<string, unknown>>(
  pages: T[][],
  operation: PageStructureOperation,
  pageIndex: number,
): PageStructureResult<T> => {
  const source = Array.isArray(pages) ? pages : [];
  if (!Number.isInteger(pageIndex) || pageIndex < 0 || pageIndex >= source.length) {
    return { ok: false, reason: 'index-out-of-range' };
  }

  if (operation === 'remove') {
    // Un template sin páginas no es representable: el Canvas se queda sin
    // superficie y el snapshot deja de ser válido.
    if (source.length <= 1) return { ok: false, reason: 'last-page' };
    return { ok: true, pages: source.filter((_, index) => index !== pageIndex) };
  }

  const next = source.map((page) => cloneDeep(page));

  if (operation === 'insert') {
    next.splice(pageIndex + 1, 0, [] as T[]);
    return { ok: true, pages: next };
  }

  const taken = new Set<string>();
  source.flat().forEach((schema) => {
    ['id', 'schemaUid', 'name'].forEach((key) => {
      const value = (schema as Record<string, unknown>)[key];
      if (typeof value === 'string' && value) taken.add(value);
    });
  });
  next.splice(pageIndex + 1, 0, withUniqueIds(source[pageIndex] || [], taken));
  return { ok: true, pages: next };
};

export type PageStructureCommandArgs<T extends Record<string, unknown>> = {
  operation: PageStructureOperation;
  pageIndex: number;
  /** Estado de páginas antes de ejecutar. */
  pages: T[][];
  /** Aplica el nuevo conjunto de páginas al template. */
  applyPages: (pages: T[][]) => void;
  meta?: Record<string, unknown>;
};

/**
 * Comando reversible de estructura de página.
 *
 * Guarda snapshots completos de antes y después, de modo que undo y redo son
 * simétricos y el round-trip devuelve exactamente el estado original.
 *
 * @returns `null` cuando la operación no es válida; el caller debe mostrar el
 * motivo en lugar de ejecutar un comando que no muta nada.
 */
export const createPageStructureCommand = <T extends Record<string, unknown>>({
  operation,
  pageIndex,
  pages,
  applyPages,
  meta = {},
}: PageStructureCommandArgs<T>): { command: Command } | { rejection: PageStructureRejection } => {
  const result = applyPageStructure(pages, operation, pageIndex);
  if (!result.ok) return { rejection: (result as any).reason };

  const before = cloneDeep(pages);
  const after = cloneDeep(result.pages);

  return {
    command: {
      id: `page.${operation}`,
      label: `Página: ${operation}`,
      meta,
      execute: () => applyPages(cloneDeep(after)),
      undo: () => applyPages(cloneDeep(before)),
      redo: () => applyPages(cloneDeep(after)),
    } as Command,
  };
};
