/**
 * FASE 4 — Canvas States
 *
 * Define todos los estados posibles del canvas.
 * PROHIBICIÓN ABSOLUTA: nunca existe un canvas blanco sin contexto visual.
 * Cada estado tiene un componente visual asociado definido en CANVAS_STATE_CONFIG.
 *
 * Transiciones válidas:
 *   loading_document  → ready | render_error | pdf_load_error
 *   loading_page      → ready | render_error | pdf_load_error
 *   document_switching → loading_page
 *   empty_page        → ready (al añadir schemas) | loading_page
 *   no_schemas        → ready (al añadir el primer schema)
 *   ready             → loading_page | document_switching | collaboration_disconnected | render_error
 *   render_error      → loading_document (retry)
 *   pdf_load_error    → loading_document (retry con parámetro corregido)
 *   collaboration_disconnected → ready (al reconectar)
 */

export type CanvasRenderState =
  | { type: 'loading_document' }
  | { type: 'loading_page' }
  | { type: 'document_switching'; fromDocId: string; toDocId: string }
  | { type: 'empty_page'; pageNumber: number; documentId: string }
  | { type: 'no_schemas'; pageNumber: number }
  | { type: 'ready'; schemaCount: number }
  | { type: 'render_error'; error: Error; recoverable: boolean }
  | {
      type: 'pdf_load_error';
      reason: 'not_found' | 'encrypted' | 'unsupported' | 'network';
    }
  | { type: 'collaboration_disconnected'; lastSyncAt: number };

/** Metadatos de comportamiento para cada estado */
export interface CanvasStateConfig {
  /** Mensaje principal — puede incluir guía de acción */
  message: string;
  /** Hay acción disponible (botón de retry, etc.) */
  hasAction: boolean;
  /** Texto del botón de acción */
  actionLabel?: string;
  /** Si el canvas permite drop de schemas en este estado */
  allowsDrop: boolean;
  /** Si el canvas bloquea toda interacción del usuario */
  blocksInteraction: boolean;
  /** Si se muestra un skeleton/spinner */
  showsSkeleton: boolean;
}

export const CANVAS_STATE_CONFIG: Record<
  CanvasRenderState['type'],
  CanvasStateConfig
> = {
  loading_document: {
    message: 'Cargando documento…',
    hasAction: false,
    allowsDrop: false,
    blocksInteraction: true,
    showsSkeleton: true,
  },
  loading_page: {
    message: 'Cargando página…',
    hasAction: false,
    allowsDrop: false,
    blocksInteraction: true,
    showsSkeleton: true,
  },
  document_switching: {
    message: 'Cambiando documento…',
    hasAction: false,
    allowsDrop: false,
    blocksInteraction: true,
    showsSkeleton: true,
  },
  empty_page: {
    message: 'Página vacía — arrastra campos desde el panel izquierdo para comenzar',
    hasAction: false,
    allowsDrop: true,
    blocksInteraction: false,
    showsSkeleton: false,
  },
  no_schemas: {
    message: 'Sin campos en esta página — arrastra un campo para añadirlo',
    hasAction: false,
    allowsDrop: true,
    blocksInteraction: false,
    showsSkeleton: false,
  },
  ready: {
    message: '',
    hasAction: false,
    allowsDrop: true,
    blocksInteraction: false,
    showsSkeleton: false,
  },
  render_error: {
    message: 'Ocurrió un error al renderizar el canvas',
    hasAction: true,
    actionLabel: 'Reintentar',
    allowsDrop: false,
    blocksInteraction: false,
    showsSkeleton: false,
  },
  pdf_load_error: {
    message: 'No se pudo cargar el archivo PDF',
    hasAction: true,
    actionLabel: 'Reintentar',
    allowsDrop: false,
    blocksInteraction: false,
    showsSkeleton: false,
  },
  collaboration_disconnected: {
    // Permite edición offline — los cambios se sincronizan al reconectar (Yjs CRDT)
    message: 'Sin conexión — editando en modo offline. Los cambios se sincronizarán al reconectar.',
    hasAction: false,
    allowsDrop: true,
    blocksInteraction: false,
    showsSkeleton: false,
  },
};

/** Mensaje específico para cada razón de pdf_load_error */
export const PDF_LOAD_ERROR_MESSAGES: Record<
  Extract<CanvasRenderState, { type: 'pdf_load_error' }>['reason'],
  string
> = {
  not_found: 'El archivo PDF no fue encontrado. Verifica que el template tenga un PDF base asignado.',
  encrypted: 'El PDF está protegido con contraseña y no puede abrirse directamente.',
  unsupported: 'Este formato de PDF no es compatible con el editor.',
  network: 'No se pudo descargar el PDF. Verifica tu conexión a internet.',
};

/** Helper: obtiene el config del estado actual */
export function getCanvasStateConfig(state: CanvasRenderState): CanvasStateConfig {
  return CANVAS_STATE_CONFIG[state.type];
}

/** Helper: determina si el estado permite interacción completa */
export function isCanvasInteractive(state: CanvasRenderState): boolean {
  return !CANVAS_STATE_CONFIG[state.type].blocksInteraction;
}

/** Helper: determina si el canvas está en estado offline (pero funcional) */
export function isOfflineMode(state: CanvasRenderState): boolean {
  return state.type === 'collaboration_disconnected';
}
