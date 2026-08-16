import type { PdfComment } from '@sisad-pdfme/contracts/comments';

/**
 * Identidad técnica y trazabilidad base de un schema.
 *
 * Este contrato agrupa los campos mínimos que permiten identificar,
 * ubicar y auditar un campo dentro del diseñador SISAD PDFME.
 *
 * Uso esperado:
 *
 * - conservar identidad estable del schema;
 * - asociar el schema a un archivo/documento;
 * - asociar el schema a una página;
 * - registrar autoría y modificaciones;
 * - mantener color visual del usuario/owner;
 * - soportar snapshots, colaboración y multidocumento.
 */
export type SchemaIdentity = {
  /**
   * Identificador único y estable del schema.
   *
   * Debe ser la identidad preferida para enlazar:
   *
   * - assignments;
   * - comentarios;
   * - snapshots;
   * - locks;
   * - selección;
   * - persistencia;
   * - colaboración.
   *
   * A diferencia de `name` o `id`, este valor debería mantenerse estable
   * aunque el usuario renombre la variable o duplique campos.
   */
  schemaUid?: string;

  /**
   * Identificador del archivo/documento al que pertenece el schema.
   *
   * Es clave en flujos multidocumento donde un mismo template puede contener
   * varios PDFs o archivos base.
   */
  fileId?: string;

  /**
   * Identificador de la plantilla/archivo de origen.
   *
   * Útil cuando el schema proviene de una plantilla reutilizable,
   * un documento importado o una fuente externa.
   */
  fileTemplateId?: string;

  /**
   * Número de página donde vive el schema.
   *
   * Normalmente representa la página humana/base uno:
   *
   * pageNumber = 1 corresponde a la primera página.
   */
  pageNumber?: number;

  /**
   * Identificador del usuario que creó el schema.
   */
  createdBy?: string;

  /**
   * Fecha de creación del schema en timestamp.
   */
  createdAt?: number;

  /**
   * Identificador del último usuario que modificó el schema.
   */
  lastModifiedBy?: string;

  /**
   * Fecha de la última modificación en timestamp.
   */
  lastModifiedAt?: number;

  /**
   * Color visual asociado al usuario creador o modificador.
   *
   * Puede usarse para bordes, chips, presencia, ownership o trazabilidad UI.
   */
  userColor?: string;
};

/**
 * Contrato colaborativo de un schema.
 *
 * Extiende `SchemaIdentity` agregando información de ownership,
 * destinatarios, color de propietario y comentarios asociados.
 *
 * Este contrato permite que un schema participe en flujos colaborativos
 * y multidestinatario sin depender directamente de componentes UI.
 */
export type CollaborativeSchemaContract = SchemaIdentity & {
  /**
   * Modo de ownership del schema.
   *
   * single:
   * El campo pertenece a un único destinatario.
   *
   * multi:
   * El campo pertenece a varios destinatarios concretos.
   *
   * shared:
   * El campo es compartido o visible para varios participantes.
   */
  ownerMode?: 'single' | 'multi' | 'shared';

  /**
   * Identificador del destinatario propietario principal.
   *
   * Se usa principalmente cuando `ownerMode` es `single`.
   */
  ownerRecipientId?: string;

  /**
   * Identificadores de destinatarios propietarios.
   *
   * Se usa principalmente cuando `ownerMode` es `multi`.
   */
  ownerRecipientIds?: string[];

  /**
   * Nombre visible del destinatario propietario.
   *
   * Útil para mostrar chips, tooltips, inspector o listas laterales.
   */
  ownerRecipientName?: string;

  /**
   * Color visual del propietario o destinatario.
   *
   * Puede usarse para pintar el schema, borde, badge, presencia
   * o agrupación visual por destinatario.
   */
  ownerColor?: string;

  /**
   * Comentarios asociados directamente al schema.
   *
   * Aunque también pueden existir comentarios top-level en el template,
   * este arreglo permite que un schema conserve comentarios embebidos
   * cuando el flujo o snapshot lo requiera.
   */
  comments?: PdfComment[];
};

/* ── Re-exportación de contratos de Fase 1 ──────────────────────────────────── */

/**
 * Reexporta la metadata oficial del diseñador.
 *
 * `SchemaDesignerMeta` es la fuente de verdad para la identidad interna
 * de cada schema dentro del diseñador.
 *
 * Vive en `shared/schemaDesignerMeta.ts` para evitar dependencias circulares
 * entre contratos, shared runtime y módulos UI.
 */
export type { SchemaDesignerMeta } from '@sisad-pdfme/shared/schemaDesignerMeta';

/**
 * Reexporta helpers oficiales para gestionar metadata de diseñador.
 *
 * Estos helpers deben usarse al crear, duplicar o pegar schemas para preservar
 * identidad, trazabilidad, owner y persistencia en snapshots.
 */
export {
  /**
   * Crea metadata inicial de diseñador para un schema nuevo.
   */
  createSchemaDesignerMeta,

  /**
   * Duplica metadata de diseñador para un schema copiado/duplicado.
   *
   * Debe preservar información útil y renovar identificadores que deban ser
   * únicos para el nuevo campo.
   */
  duplicateSchemaDesignerMeta,

  /**
   * Prepara metadata de diseñador para un schema pegado desde clipboard.
   */
  pasteSchemaDesignerMeta,
} from '@sisad-pdfme/shared/schemaDesignerMeta';
