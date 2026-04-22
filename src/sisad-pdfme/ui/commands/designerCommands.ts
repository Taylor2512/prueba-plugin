import { cloneDeep } from '@sisad-pdfme/common';
import type { Command, CommandObserverPayload, SchemaForUI, Template, TopLevelPdfCommentEntry } from '@sisad-pdfme/common';

type PageSnapshotCommandArgs = {
  id: string;
  label: string;
  pageIndex: number;
  schemaEvents?: CommandObserverPayload[];
  beforeSchemas: SchemaForUI[];
  afterSchemas: SchemaForUI[];
  applyPageSchemas: (_pageIndex: number, _schemas: SchemaForUI[]) => void;
};

type TemplateSnapshotCommandArgs = {
  id: string;
  label: string;
  events?: CommandObserverPayload[];
  beforeTemplate: Template;
  afterTemplate: Template;
  applyTemplate: (_template: Template) => void | Promise<void>;
};

export const createPageSnapshotCommand = ({
  id,
  label,
  pageIndex,
  schemaEvents = [],
  beforeSchemas,
  afterSchemas,
  applyPageSchemas,
}: PageSnapshotCommandArgs): Command => ({
  id,
  label,
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

export const createTemplateSnapshotCommand = ({
  id,
  label,
  events = [],
  beforeTemplate,
  afterTemplate,
  applyTemplate,
}: TemplateSnapshotCommandArgs): Command => ({
  id,
  label,
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

export const createCommentCommandEvent = (
  type: 'comment.created' | 'comment.updated' | 'comment.deleted',
  commentId: string,
  fileId?: string | null,
): CommandObserverPayload => ({
  type,
  commentId,
  fileId: fileId || null,
});

export const buildTopLevelCommentEntry = (
  entry: TopLevelPdfCommentEntry,
): { id: string; anchor: TopLevelPdfCommentEntry['anchor']; comment: TopLevelPdfCommentEntry['comment'] } => ({
  id: entry.id,
  anchor: cloneDeep(entry.anchor),
  comment: cloneDeep(entry.comment),
});
