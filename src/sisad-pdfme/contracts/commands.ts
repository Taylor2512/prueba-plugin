/**
 * Eventos observables emitidos por el sistema de comandos.
 *
 * Estos eventos permiten notificar a otras capas del diseñador cuando ocurre
 * una acción relevante sobre schemas, comentarios, locks o presencia.
 *
 * Uso esperado:
 *
 * - actualizar historial;
 * - sincronizar colaboración;
 * - refrescar UI;
 * - alimentar auditoría;
 * - disparar side effects controlados;
 * - notificar cambios al host.
 */
export type CommandObserverEvent =
  /**
   * Se creó un nuevo schema/campo en el diseñador.
   */
  | 'schema.created'

  /**
   * Se actualizó un schema existente.
   *
   * Puede representar cambios de posición, tamaño, contenido,
   * owner, configuración, metadata o estado visual.
   */
  | 'schema.updated'

  /**
   * Se eliminó un schema/campo.
   */
  | 'schema.deleted'

  /**
   * Un schema fue bloqueado para edición colaborativa.
   */
  | 'schema.locked'

  /**
   * Un schema fue desbloqueado.
   */
  | 'schema.unlocked'

  /**
   * Se creó un comentario.
   */
  | 'comment.created'

  /**
   * Se actualizó un comentario.
   *
   * Puede incluir cambios de texto, resolución, anchor,
   * replies o metadata.
   */
  | 'comment.updated'

  /**
   * Se eliminó un comentario.
   */
  | 'comment.deleted'

  /**
   * Se actualizó presencia colaborativa.
   *
   * Por ejemplo: usuario activo, página actual, schema seleccionado
   * o fase de interacción.
   */
  | 'presence.updated';

/**
 * Payload estándar emitido por un comando.
 *
 * Este contrato transporta el evento observable y la metadata mínima
 * necesaria para que otros módulos puedan reaccionar sin acoplarse
 * directamente a la implementación del comando.
 */
export type CommandObserverPayload = {
  /**
   * Tipo de evento emitido.
   */
  type: CommandObserverEvent;

  /**
   * Identificador del schema afectado.
   *
   * Aplica principalmente a eventos:
   *
   * - schema.created;
   * - schema.updated;
   * - schema.deleted;
   * - schema.locked;
   * - schema.unlocked;
   * - comment.created/comment.updated/comment.deleted cuando el comentario
   *   está asociado a un schema.
   */
  schemaId?: string;

  /**
   * Índice de página afectada.
   *
   * Normalmente es base cero:
   *
   * pageIndex = 0 representa la primera página.
   */
  pageIndex?: number;

  /**
   * Identificador del archivo/documento afectado.
   *
   * En flujos multidocumento permite saber a qué PDF pertenece
   * el schema, comentario o cambio observado.
   */
  fileId?: string | null;

  /**
   * Identificador del comentario afectado.
   *
   * Aplica a eventos de comentario.
   */
  commentId?: string;

  /**
   * Metadata adicional del evento.
   *
   * Se deja como Record flexible para permitir transportar información
   * específica sin romper el contrato base.
   *
   * Ejemplos:
   *
   * - patch aplicado;
   * - estado anterior;
   * - estado siguiente;
   * - actorId;
   * - timestamp;
   * - lock info;
   * - detalles de sincronización.
   */
  payload?: Record<string, unknown>;
};

/**
 * Contexto recibido por cada comando al ejecutarse, deshacerse o rehacerse.
 *
 * Actualmente expone solo `emit`, que permite publicar eventos observables
 * sin que el comando conozca directamente la UI, el store, el historial
 * o la capa de colaboración.
 */
export type CommandExecutionContext = {
  /**
   * Emite un evento observable hacia el bus/listeners del diseñador.
   *
   * Los comandos deben usar esta función para informar cambios relevantes
   * en vez de llamar directamente a componentes, stores o servicios externos.
   */
  emit: (event: CommandObserverPayload) => void;
};

/**
 * Contrato base de un comando del diseñador.
 *
 * Un comando representa una acción reversible dentro del runtime.
 *
 * Ejemplos:
 *
 * - crear schema;
 * - mover schema;
 * - eliminar schema;
 * - bloquear/desbloquear schema;
 * - crear comentario;
 * - actualizar comentario;
 * - aplicar snapshot.
 *
 * La estructura soporta:
 *
 * - execute: ejecutar acción principal;
 * - undo: revertir acción;
 * - redo: rehacer acción, opcionalmente distinto de execute.
 */
export type Command = {
  /**
   * Identificador único del comando.
   *
   * Debe ser estable dentro del historial para poder rastrear,
   * depurar o auditar acciones.
   */
  id: string;

  /**
   * Etiqueta humana del comando.
   *
   * Útil para historial, debugging, tooltips o paneles de auditoría.
   *
   * Ejemplos:
   *
   * - "Crear campo de texto";
   * - "Mover firma";
   * - "Eliminar comentario";
   * - "Bloquear schema".
   */
  label: string;

  /**
   * Ejecuta la acción principal del comando.
   *
   * Puede ser síncrona o asíncrona.
   */
  execute: (context: CommandExecutionContext) => void | Promise<void>;

  /**
   * Revierte la acción del comando.
   *
   * Debe dejar el estado lo más cercano posible al estado anterior
   * a `execute`.
   */
  undo: (context: CommandExecutionContext) => void | Promise<void>;

  /**
   * Rehace la acción del comando después de un undo.
   *
   * Si no se define, el CommandBus podría usar `execute` como fallback,
   * dependiendo de la implementación.
   */
  redo?: (context: CommandExecutionContext) => void | Promise<void>;
};

/**
 * Configuración libre asociada a un schema dentro del diseñador.
 *
 * Se define como Record flexible porque puede almacenar configuración
 * específica de cada familia de schema:
 *
 * - identidad;
 * - prefill;
 * - persistencia;
 * - API;
 * - colaboración;
 * - metadata;
 * - configuración avanzada del inspector;
 * - integración con providers externos.
 *
 * Nota:
 * Este contrato es intencionalmente amplio. Para módulos internos más estrictos,
 * conviene usar un tipo especializado de `SchemaDesignerConfig` con propiedades
 * explícitas.
 */
export type SchemaDesignerConfig = Record<string, unknown>;