/**
 * FASE 4 — Overlay System
 *
 * Gestiona todos los overlays del canvas: toolbars, menús contextuales,
 * modales, indicadores de lock, etc.
 *
 * Reglas:
 * - Overlays que requieren React Portal (escapan overflow:hidden del canvas):
 *   context_menu, schema_drop_setup, recipient_change, conflict_notification
 * - La selection_toolbar desaparece en drag start, reaparece en drag end
 * - Z-index governance centralizada — nunca hardcodear en componentes
 * - Reposicionamiento en zoom via transitionend, no en cada frame
 */

export type OverlayType =
  | 'selection_toolbar'      // toolbar flotante sobre selección activa
  | 'context_menu'           // click derecho — portal obligatorio
  | 'inline_edit'            // edición inline de texto
  | 'schema_drop_setup'      // modal al soltar schema nuevo — portal
  | 'recipient_change'       // modal de reasignación — portal
  | 'comment_popover'        // burbuja de comentario anclada al schema
  | 'lock_indicator'         // badge de lock de otro usuario
  | 'conflict_notification'  // aviso de conflicto remoto — portal
  | 'canvas_tooltip';        // tooltip informativo

/** Niveles de z-index — centralizado, nunca hardcodear en componentes */
export const OVERLAY_Z_INDEX = {
  canvas_base:    100,   // fondo del canvas
  schema_overlay: 200,   // Moveable handles viven aquí
  toolbar:        300,   // selection_toolbar, inline_edit
  modal:          400,   // schema_drop_setup, recipient_change
  notification:   500,   // conflict_notification
  critical:       600,   // mensajes bloqueantes
} as const;

export type OverlayZLevel = keyof typeof OVERLAY_Z_INDEX;

/** Eventos que provocan el cierre automático de un overlay */
export type CloseEvent =
  | 'escape'
  | 'click_outside'
  | 'schema_deselect'
  | 'page_change'
  | 'document_change'
  | 'scroll';

/** Overlays que SIEMPRE requieren React Portal */
export const PORTAL_REQUIRED_OVERLAYS = new Set<OverlayType>([
  'context_menu',
  'schema_drop_setup',
  'recipient_change',
  'conflict_notification',
]);

/** Descriptor completo de un overlay activo */
export interface OverlayDescriptor {
  id: string;
  type: OverlayType;
  anchorType: 'schema' | 'canvas' | 'viewport';
  /** schemaUid si anchorType === 'schema' */
  anchorId?: string;
  /** Coordenadas en viewport cuando anchorType === 'viewport' */
  position?: { x: number; y: number };
  zIndex: OverlayZLevel;
  closeOn: CloseEvent[];
  /** Si true, el canvas no recibe eventos de mouse mientras esté abierto */
  capturesCanvasEvents: boolean;
  requiresPortal: boolean;
  /** Datos adicionales específicos del tipo de overlay */
  data?: Record<string, unknown>;
}

/** Configuración por defecto para cada tipo de overlay */
export const OVERLAY_DEFAULTS: Record<
  OverlayType,
  Omit<OverlayDescriptor, 'id' | 'anchorId' | 'position' | 'anchorType' | 'data'>
> = {
  selection_toolbar: {
    type: 'selection_toolbar',
    zIndex: 'toolbar',
    closeOn: ['escape', 'schema_deselect', 'page_change', 'document_change'],
    capturesCanvasEvents: false,
    requiresPortal: false,
  },
  context_menu: {
    type: 'context_menu',
    zIndex: 'modal',
    closeOn: ['escape', 'click_outside', 'page_change', 'document_change'],
    capturesCanvasEvents: true,
    requiresPortal: true,
  },
  inline_edit: {
    type: 'inline_edit',
    zIndex: 'toolbar',
    closeOn: ['escape', 'schema_deselect', 'page_change'],
    capturesCanvasEvents: false,
    requiresPortal: false,
  },
  schema_drop_setup: {
    type: 'schema_drop_setup',
    zIndex: 'modal',
    closeOn: ['escape'],
    capturesCanvasEvents: true,
    requiresPortal: true,
  },
  recipient_change: {
    type: 'recipient_change',
    zIndex: 'modal',
    closeOn: ['escape', 'click_outside'],
    capturesCanvasEvents: true,
    requiresPortal: true,
  },
  comment_popover: {
    type: 'comment_popover',
    zIndex: 'schema_overlay',
    closeOn: ['escape', 'click_outside', 'page_change'],
    capturesCanvasEvents: false,
    requiresPortal: false,
  },
  lock_indicator: {
    type: 'lock_indicator',
    zIndex: 'schema_overlay',
    closeOn: [],
    capturesCanvasEvents: false,
    requiresPortal: false,
  },
  conflict_notification: {
    type: 'conflict_notification',
    zIndex: 'notification',
    closeOn: ['escape'],
    capturesCanvasEvents: false,
    requiresPortal: true,
  },
  canvas_tooltip: {
    type: 'canvas_tooltip',
    zIndex: 'toolbar',
    closeOn: ['escape', 'click_outside', 'scroll'],
    capturesCanvasEvents: false,
    requiresPortal: false,
  },
};

/** Manager de overlays activos — vive en el DesignerContext */
export class OverlayManager {
  private overlays = new Map<string, OverlayDescriptor>();
  private listeners = new Set<() => void>();

  /** Abre un overlay. Si ya existe con ese id, lo reemplaza. */
  open(descriptor: OverlayDescriptor): void {
    this.overlays.set(descriptor.id, descriptor);
    this._notify();
  }

  /** Crea y abre un overlay con defaults aplicados */
  openTyped(
    id: string,
    type: OverlayType,
    anchorType: OverlayDescriptor['anchorType'],
    options?: Partial<Omit<OverlayDescriptor, 'id' | 'type' | 'anchorType'>>,
  ): void {
    const defaults = OVERLAY_DEFAULTS[type];
    this.open({
      ...defaults,
      id,
      type,
      anchorType,
      requiresPortal: PORTAL_REQUIRED_OVERLAYS.has(type),
      ...options,
    });
  }

  close(overlayId: string): void {
    if (this.overlays.delete(overlayId)) {
      this._notify();
    }
  }

  /** Cierra todos los overlays, opcionalmente filtrando por tipo */
  closeAll(type?: OverlayType): void {
    if (!type) {
      this.overlays.clear();
    } else {
      for (const [id, descriptor] of this.overlays.entries()) {
        if (descriptor.type === type) {
          this.overlays.delete(id);
        }
      }
    }
    this._notify();
  }

  /** Cierra todos los overlays que escuchan un CloseEvent específico */
  handleCloseEvent(event: CloseEvent): void {
    let changed = false;
    for (const [id, descriptor] of this.overlays.entries()) {
      if (descriptor.closeOn.includes(event)) {
        this.overlays.delete(id);
        changed = true;
      }
    }
    if (changed) this._notify();
  }

  isOpen(overlayId: string): boolean {
    return this.overlays.has(overlayId);
  }

  getActive(): OverlayDescriptor[] {
    return Array.from(this.overlays.values());
  }

  getByType(type: OverlayType): OverlayDescriptor[] {
    return Array.from(this.overlays.values()).filter((o) => o.type === type);
  }

  /**
   * Recalcula la posición de todos los overlays anclados a schema.
   * Llamar en transitionend de zoom, no en cada frame.
   */
  repositionAnchoredOverlays(
    getSchemaRect: (schemaUid: string) => DOMRect | null,
  ): void {
    let changed = false;
    for (const [, descriptor] of this.overlays.entries()) {
      if (descriptor.anchorType === 'schema' && descriptor.anchorId) {
        const rect = getSchemaRect(descriptor.anchorId);
        if (rect) {
          descriptor.position = { x: rect.left, y: rect.top };
          changed = true;
        }
      }
    }
    if (changed) this._notify();
  }

  /** Suscribe a cambios de estado de overlays */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private _notify(): void {
    this.listeners.forEach((cb) => cb());
  }
}

export function createOverlayManager(): OverlayManager {
  return new OverlayManager();
}
