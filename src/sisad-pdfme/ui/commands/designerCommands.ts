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
 *
 * Este tipo se usa cuando una operación modifica únicamente los schemas
 * de una página concreta, por ejemplo:
 *
 * - crear campo;
 * - mover campo;
 * - redimensionar campo;
 * - eliminar campo;
 * - duplicar campo;
 * - cambiar propiedades de uno o varios schemas de la página.
 */
type PageSnapshotCommandArgs = {
  /**
   * Identificador único del comando.
   *
   * Debe ser estable dentro del historial para auditoría,
   * debugging, undo/redo y trazabilidad.
   */
  id: string;

  /**
   * Etiqueta humana del comando.
   *
   * Útil para historial visual, logs, debugging o tooltips.
   */
  label: string;

  /**
   * Índice de la página afectada.
   *
   * Normalmente es base cero:
   *
   * pageIndex = 0 representa la primera página.
   */
  pageIndex: number;

  /**
   * Eventos observables que deben emitirse después de aplicar el comando.
   *
   * Ejemplos:
   *
   * - schema.created;
   * - schema.updated;
   * - schema.deleted;
   * - schema.locked;
   * - schema.unlocked.
   */
  schemaEvents?: CommandObserverPayload[];

  /**
   * Estado de schemas antes de ejecutar el comando.
   *
   * Se usa para `undo`.
   */
  beforeSchemas: SchemaForUI[];

  /**
   * Estado de schemas después de ejecutar el comando.
   *
   * Se usa para `execute` y `redo`.
   */
  afterSchemas: SchemaForUI[];

  /**
   * Callback que aplica una lista de schemas sobre una página específica.
   *
   * Esta función es inyectada por el runtime/UI para evitar que el comando
   * conozca directamente React, stores, Canvas o estructura interna del editor.
   */
  applyPageSchemas: (_pageIndex: number, _schemas: SchemaForUI[]) => void;
};

/**
 * Argumentos necesarios para construir un comando reversible basado
 * en snapshot completo de template.
 *
 * Este tipo se usa cuando una operación puede afectar el documento completo,
 * por ejemplo:
 *
 * - importar template;
 * - reemplazar documento base;
 * - modificar estructura multidocumento;
 * - restaurar snapshot;
 * - aplicar cambios globales de recipients, comentarios o metadata.
 */
type TemplateSnapshotCommandArgs = {
  /**
   * Identificador único del comando.
   */
  id: string;

  /**
   * Etiqueta humana del comando.
   */
  label: string;

  /**
   * Eventos observables que se emitirán después de aplicar el template.
   */
  events?: CommandObserverPayload[];

  /**
   * Template antes de ejecutar el comando.
   *
   * Se usa para `undo`.
   */
  beforeTemplate: Template;

  /**
   * Template después de ejecutar el comando.
   *
   * Se usa para `execute` y `redo`.
   */
  afterTemplate: Template;

  /**
   * Callback que aplica el template completo.
   *
   * Puede ser síncrono o asíncrono porque la aplicación del template
   * puede requerir reconstruir UI, recalcular páginas o sincronizar runtime.
   */
  applyTemplate: (_template: Template) => void | Promise<void>;
};

/**
 * Crea un comando reversible basado en snapshot de página.
 *
 * Este comando reemplaza los schemas de una página con un estado anterior
 * o posterior según la operación ejecutada:
 *
 * - execute: aplica `afterSchemas`;
 * - undo: aplica `beforeSchemas`;
 * - redo: vuelve a aplicar `afterSchemas`.
 *
 * Los schemas se clonan antes de aplicarse para evitar mutaciones accidentales
 * entre historial, estado actual y referencias externas.
 *
 * @param args Configuración del comando de snapshot por página.
 * @returns Comando compatible con CommandBus.
 */
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

  /**
   * Ejecuta el cambio principal de la página.
   *
   * Aplica el estado posterior y emite los eventos originales.
   */
  execute: ({ emit }) => {
    applyPageSchemas(pageIndex, cloneDeep(afterSchemas));

    schemaEvents.forEach((event) => emit(event));
  },

  /**
   * Revierte el cambio de la página.
   *
   * Aplica el estado anterior y reemite los eventos marcados con
   * `payload.direction = 'undo'` para que observadores puedan diferenciar
   * una reversión de una ejecución normal.
   */
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

  /**
   * Rehace el cambio de la página.
   *
   * Aplica nuevamente el estado posterior y reemite los eventos marcados
   * con `payload.direction = 'redo'`.
   */
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
 *
 * Este comando es adecuado para operaciones globales porque reemplaza
 * el template completo en vez de modificar solo una página.
 *
 * Flujo:
 *
 * - execute: aplica `afterTemplate`;
 * - undo: aplica `beforeTemplate`;
 * - redo: vuelve a aplicar `afterTemplate`.
 *
 * El uso de `Promise.resolve` permite soportar tanto `applyTemplate`
 * síncrono como asíncrono con una misma implementación.
 *
 * @param args Configuración del comando de snapshot de template.
 * @returns Comando compatible con CommandBus.
 */
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

  /**
   * Ejecuta el cambio global de template.
   *
   * Aplica el template posterior y luego emite los eventos originales.
   */
  execute: ({ emit }) => {
    return Promise.resolve(applyTemplate(cloneDeep(afterTemplate))).then(() => {
      events.forEach((event) => emit(event));
    });
  },

  /**
   * Revierte el cambio global de template.
   *
   * Aplica el template anterior y luego emite los eventos marcados como undo.
   */
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

  /**
   * Rehace el cambio global de template.
   *
   * Aplica nuevamente el template posterior y luego emite los eventos
   * marcados como redo.
   */
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
 *
 * Este helper normaliza la forma mínima del evento para operaciones de:
 *
 * - creación de comentario;
 * - actualización de comentario;
 * - eliminación de comentario.
 *
 * @param type Tipo de evento de comentario.
 * @param commentId Identificador del comentario afectado.
 * @param fileId Identificador opcional del archivo/documento asociado.
 * @returns Payload observable compatible con CommandBus.
 */
export const createCommentCommandEvent = (
  type: 'comment.created' | 'comment.updated' | 'comment.deleted',
  commentId: string,
  fileId?: string | null,
): CommandObserverPayload => ({
  type,
  commentId,
  fileId: fileId || null,
});

/**
 * Construye una entrada top-level de comentario lista para insertar
 * en un template o snapshot.
 *
 * Clona profundamente `anchor` y `comment` para evitar que el consumidor
 * modifique accidentalmente la entrada original recibida.
 *
 * Uso esperado:
 *
 * - normalizar comentarios antes de guardarlos en template;
 * - preparar snapshots;
 * - evitar referencias compartidas entre UI y estado persistido;
 * - mantener round-trip seguro de comentarios globales.
 *
 * @param entry Entrada top-level de comentario recibida.
 * @returns Nueva entrada con anchor y comment clonados.
 */
export const buildTopLevelCommentEntry = (
  entry: TopLevelPdfCommentEntry,
): {
  id: string;
  anchor: TopLevelPdfCommentEntry['anchor'];
  comment: TopLevelPdfCommentEntry['comment'];
} => ({
  id: entry.id,
  anchor: cloneDeep(entry.anchor),
  comment: cloneDeep(entry.comment),
});