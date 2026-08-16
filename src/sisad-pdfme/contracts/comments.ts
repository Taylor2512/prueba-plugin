/**
 * Ancla visual de un comentario dentro del PDF o dentro de un schema.
 *
 * Un anchor representa la ubicación donde se muestra o se asocia
 * un comentario.
 *
 * Puede apuntar a:
 *
 * - una coordenada libre del documento;
 * - una página específica;
 * - un archivo/documento específico;
 * - un schema/campo específico mediante schemaUid o fieldId.
 */
export type CommentAnchor = {
  /**
   * Identificador único del anchor.
   *
   * Es opcional para permitir construir anchors temporales antes
   * de persistirlos o normalizarlos.
   */
  id?: string;

  /**
   * Identificador estable del schema asociado.
   *
   * En SISAD PDFME se recomienda usar `schemaUid` como identidad técnica
   * principal para comentarios, assignments y snapshot
   * multidocumento.
   */
  schemaUid?: string | null;

  /**
   * Identificador del archivo/documento al que pertenece el comentario.
   *
   * Es importante en flujos multidocumento donde varias páginas pueden
   * pertenecer a diferentes PDFs dentro del mismo template.
   */
  fileId?: string | null;

  /**
   * Número de página donde está ubicado el comentario.
   *
   * Normalmente se maneja como página humana/base uno:
   *
   * pageNumber = 1 representa la primera página.
   */
  pageNumber?: number;

  /**
   * Alias  o alternativo del campo asociado.
   *
   * Se conserva para representar estructuras donde
   * el comentario se vinculaba mediante fieldId en vez de schemaUid.
   */
  fieldId?: string | null;

  /**
   * Coordenada horizontal del anchor dentro de la página.
   *
   * Debe estar en la misma unidad usada por el runtime del diseñador,
   * normalmente milímetros o coordenadas normalizadas del canvas según
   * el adaptador que lo consuma.
   */
  x: number;

  /**
   * Coordenada vertical del anchor dentro de la página.
   */
  y: number;

  /**
   * Indica si el comentario/ancla ya fue resuelto.
   *
   * Puede duplicarse con el estado del comentario para facilitar filtros
   * rápidos desde overlays o listas de anchors.
   */
  resolved?: boolean;

  /**
   * Identificador del autor que creó el anchor.
   */
  authorId?: string | null;

  /**
   * Nombre visible del autor.
   */
  authorName?: string | null;

  /**
   * Color visual del autor.
   *
   * Se usa para chips, bordes, avatares o indicadores de colaboración.
   */
  authorColor?: string | null;
};

/**
 * Respuesta a un comentario PDF.
 *
 * Representa una réplica dentro de un hilo de comentario.
 * No tiene anchor propio porque hereda el contexto del comentario padre.
 */
export type PdfCommentReply = {
  /**
   * Identificador único de la respuesta.
   */
  id: string;

  /**
   * Identificador del autor de la respuesta.
   */
  authorId?: string | null;

  /**
   * Nombre visible del autor de la respuesta.
   */
  authorName?: string | null;

  /**
   * Color visual del autor de la respuesta.
   */
  authorColor?: string | null;

  /**
   * Contenido textual de la respuesta.
   */
  text: string;

  /**
   * Fecha de creación de la respuesta en timestamp.
   */
  createdAt: number;

  /**
   * Indica si la respuesta fue marcada como resuelta.
   *
   * Normalmente el estado principal de resolución vive en el comentario
   * padre, pero este campo permite granularidad si la UI lo requiere.
   */
  resolved?: boolean;
};

/**
 * Comentario PDF principal.
 *
 * Representa un comentario asociado a:
 *
 * - un documento;
 * - una página;
 * - un schema/campo;
 * - una coordenada visual mediante anchor.
 *
 * Este contrato es el núcleo para comentarios en snapshots,
 * overlays del canvas, paneles laterales y flujos colaborativos.
 */
export type PdfComment = {
  /**
   * Identificador único del comentario.
   */
  id: string;

  /**
   * Identificador del archivo/documento asociado.
   */
  fileId?: string | null;

  /**
   * Número de página asociada al comentario.
   */
  pageNumber?: number;

  /**
   * Anchor visual del comentario.
   *
   * Define dónde se ubica o a qué schema/campo se asocia.
   */
  anchor: CommentAnchor;

  /**
   * Alias  o alternativo del campo asociado.
   *
   * Se conserva para flujos existentes.
   */
  fieldId?: string | null;

  /**
   * Identificador estable del schema asociado.
   *
   * Recomendado como llave principal para enlazar comentarios con campos.
   */
  schemaUid?: string | null;

  /**
   * Identificador del autor del comentario.
   */
  authorId?: string | null;

  /**
   * Nombre visible del autor del comentario.
   */
  authorName?: string | null;

  /**
   * Color visual del autor del comentario.
   */
  authorColor?: string | null;

  /**
   * Texto principal del comentario.
   */
  text: string;

  /**
   * Fecha de creación del comentario en timestamp.
   */
  createdAt: number;

  /**
   * Estado de resolución del comentario.
   *
   * true:
   * El comentario ya fue atendido/resuelto.
   *
   * false:
   * El comentario sigue pendiente.
   */
  resolved: boolean;

  /**
   * Respuestas asociadas al comentario.
   *
   * Siempre debe ser arreglo para simplificar renderizado,
   * serialización y snapshot round-trip.
   */
  replies: PdfCommentReply[];
};

/**
 * Entrada top-level de comentario dentro del template/snapshot.
 *
 * Esta estructura permite guardar comentarios en una colección global
 * del template, en vez de incrustarlos únicamente dentro de cada schema.
 *
 * Uso esperado:
 *
 * template.pdfComments[] = TopLevelPdfCommentEntry[]
 *
 * Ventajas:
 *
 * - permite comentarios globales del documento;
 * - facilita filtrar por fileId/pageNumber/schemaUid;
 * - evita depender exclusivamente de schemas embebidos;
 * - mejora la integración con multidocumento y paneles de comentarios.
 */
export type TopLevelPdfCommentEntry = {
  /**
   * Identificador único de la entrada top-level.
   *
   * Puede coincidir con comment.id para simplificar búsquedas.
   */
  id: string;

  /**
   * Anchor asociado a la entrada global.
   *
   * Usa el mismo contrato de anchor del comentario padre.
   *
   * El `& {}` actualmente no agrega campos extra, pero deja una extensión
   * estructural abierta para futuras propiedades específicas de entradas
   * top-level sin alterar `PdfComment['anchor']`.
   */
  anchor: PdfComment['anchor'] & {};

  /**
   * Comentario completo asociado a esta entrada.
   */
  comment: PdfComment;
};
