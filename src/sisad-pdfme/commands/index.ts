/**
 * Entrypoint público de comandos del diseñador SISAD PDFME.
 *
 * Este archivo funciona como fachada/barrel para exponer comandos usados por:
 *
 * - Designer;
 * - schemas;
 * - comentarios;
 * - documentos;
 * - selección múltiple;
 * - edición inline.
 *
 * Responsabilidades:
 *
 * - reexportar el CommandBus;
 * - exponer factories de comandos del diseñador;
 * - agrupar comandos por dominio funcional;
 * - entregar un registro simple mediante registerDesignerCommands();
 * - evitar que consumidores externos importen rutas internas profundas.
 *
 * Este archivo NO debe contener lógica de ejecución de comandos.
 * Solo debe organizar y exponer APIs públicas.
 */

import {
  CommandBus,
  createCommandBus,
} from '../ui/commands/commandBus.js';

import {
  buildTopLevelCommentEntry,
  createCommentCommandEvent,
  createPageSnapshotCommand,
  createTemplateSnapshotCommand,
} from '../ui/commands/designerCommands.js';

/**
 * Grupo completo de comandos públicos del diseñador.
 *
 * Incluye comandos relacionados con:
 *
 * - snapshots de página;
 * - snapshots de template completo;
 * - eventos de comentarios;
 * - construcción de comentarios top-level.
 *
 * Se usa como API compacta cuando el consumidor necesita acceder
 * a todas las operaciones principales del diseñador desde un solo objeto.
 */
export const designerCommands = {
  /**
   * Crea un comando/snapshot de una página específica.
   *
   * Útil para registrar cambios parciales en una página,
   * historial, undo/redo o sincronización localizada.
   */
  createPageSnapshotCommand,

  /**
   * Crea un comando/snapshot del template completo.
   *
   * Útil para persistencia global, import/export, cambios estructurales
   * o estados donde todo el documento debe quedar representado.
   */
  createTemplateSnapshotCommand,

  /**
   * Crea un evento de comando asociado a comentarios.
   *
   * Permite representar acciones como crear, actualizar, resolver
   * o eliminar comentarios dentro del sistema de comandos.
   */
  createCommentCommandEvent,

  /**
   * Construye una entrada de comentario top-level.
   *
   * Se usa cuando un comentario no vive únicamente dentro de un schema,
   * sino en una colección global del template/documento.
   */
  buildTopLevelCommentEntry,
} as const;

/**
 * Comandos específicos de schemas.
 *
 * Actualmente expone snapshot por página, porque las operaciones
 * sobre schemas suelen impactar una página concreta del documento.
 */
export const schemaCommands = {
  /**
   * Crea snapshot de página para cambios de schemas.
   */
  createPageSnapshotCommand,
};

/**
 * Comandos específicos de comentarios.
 *
 * Agrupa helpers relacionados con eventos y estructura global
 * de comentarios.
 */
export const commentCommands = {
  /**
   * Crea un evento de comando para operaciones de comentario.
   */
  createCommentCommandEvent,

  /**
   * Construye una entrada de comentario top-level compatible
   * con el template/snapshot.
   */
  buildTopLevelCommentEntry,
};

/**
 * Comandos específicos de documento/template.
 *
 * Agrupa operaciones que afectan al documento completo.
 */
export const documentCommands = {
  /**
   * Crea snapshot completo del template.
   */
  createTemplateSnapshotCommand,
};

/**
 * Registra y devuelve los grupos de comandos públicos del diseñador.
 *
 * Esta función permite que integradores o runtime builders obtengan
 * una estructura organizada por dominio:
 *
 * - schemaCommands;
 * - commentCommands;
 * - documentCommands.
 *
 * Importante:
 * Actualmente no instancia un CommandBus ni registra handlers.
 * Solo retorna referencias agrupadas a las factories disponibles.
 */
export const registerDesignerCommands = () => ({
  schemaCommands,
  commentCommands,
  documentCommands,
});

/**
 * Reexporta el CommandBus y su factory.
 *
 * CommandBus:
 * Contrato/clase encargada de publicar, ejecutar o coordinar comandos.
 *
 * createCommandBus:
 * Factory para crear una instancia nueva del bus.
 */
export { CommandBus, createCommandBus };

/**
 * Reexporta factories de comandos individuales.
 *
 * Esto permite consumir funciones puntuales sin importar el objeto agrupado:
 *
 * import { createPageSnapshotCommand } from '...';
 */
export {
  createPageSnapshotCommand,
  createTemplateSnapshotCommand,
  createCommentCommandEvent,
  buildTopLevelCommentEntry,
};

/**
 * Reexporta comandos de selección y edición inline.
 *
 * Estos comandos viven cerca del Designer porque dependen de conceptos
 * de selección visual, alineación, distribución, edición inline
 * y estado activo del canvas.
 */
export {
  createSelectionCommands,
  emitInlineEditRequest,
  setInlineEditRequestHandler,
} from '../ui/components/Designer/shared/selectionCommands.js';

/**
 * Tipos públicos del sistema de comandos de selección.
 *
 * SelectionCommandSet:
 * Conjunto de comandos disponibles para selección.
 *
 * SelectionCommandsContext:
 * Contexto necesario para ejecutar comandos de selección.
 *
 * AlignType:
 * Tipo de alineación soportada.
 *
 * DistributeType:
 * Tipo de distribución soportada.
 *
 * InlineEditTarget:
 * Elemento objetivo para edición inline.
 *
 * InlineEditRequest:
 * Payload usado para solicitar edición inline desde el canvas.
 */
export type {
  SelectionCommandSet,
  SelectionCommandsContext,
  AlignType,
  DistributeType,
  InlineEditTarget,
  InlineEditRequest,
} from '../ui/components/Designer/shared/selectionCommands.js';