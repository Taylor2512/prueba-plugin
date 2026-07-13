import { cloneDeep } from '@sisad-pdfme/common';

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
    emit({ type: 'comment.updated', pageIndex: targetComment.pageIndex });
  },
  undo: ({ emit }) => {
    undo();
    emit({ type: 'comment.updated', pageIndex: targetComment.pageIndex });
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
export const buildTopLevelCommentEntry = (entry: TopLevelPdfCommentEntry): TopLevelPdfCommentEntry => entry;
