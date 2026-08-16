/**
 * Puente entre el hub interno del runtime y el catálogo canónico de eventos.
 *
 * El Designer, el Preview y el ListView emiten eventos con `type: string`
 * heredado (`designer.selection.changed`, `runtime.view.zoom.changed`…). El
 * contrato público, en cambio, es la unión discriminada de
 * `contracts/events.ts`.
 *
 * Este puente traduce y reenvía por el dispatcher único:
 *
 *   hub interno ──traduce──► evento canónico ──► listeners + callbacks `onX`
 *
 * Nada se pierde: lo que no tiene equivalente canónico viaja como
 * `custom:<type>`, así que el host sigue viendo el hecho aunque todavía no
 * exista contrato tipado para él. A medida que COREUX-007 mueva cada emisor a
 * nombres canónicos, su entrada desaparece de este mapa.
 */
import type { DesignerRuntimeEvent, DesignerRuntimeEventHub } from '@sisad-pdfme/ui/components/Designer/shared/designerExtensions';
import type { SisadPdfmeEventName } from '@sisad-pdfme/contracts/events';
import { createSisadPdfmeCustomEvent } from '@sisad-pdfme/contracts/events';
import type { InstanceEventDispatcher } from '@sisad-pdfme/runtime/instanceEventDispatcher';

/** Traducción de los `type` internos vigentes a nombres del catálogo. */
const RUNTIME_EVENT_TO_DOMAIN_EVENT: Record<string, SisadPdfmeEventName> = {
  'designer.selection.changed': 'selection.changed',
  'designer.view.page.changed': 'page.changed',
  'runtime.view.page.changed': 'page.changed',
  'designer.view.zoom.changed': 'zoom.changed',
  'runtime.view.zoom.changed': 'zoom.changed',
  'designer.view.viewport-mode.changed': 'viewport.fit',
  'designer.view.sidebar.changed': 'sidebar.changed',
  'designer.component.interaction.changed': 'interaction.phase.changed',
  'designer.schema.change': 'schema.updated',
  'schema.locked': 'schema.updated',
  'schema.unlocked': 'schema.updated',
  'comment.created': 'comment.created',
  'comment.deleted': 'comment.deleted',
  'comment.updated': 'comment.moved',
};

/** Extrae los ids de schema del evento heredado, que los expone de dos formas. */
const readSchemaIds = (event: DesignerRuntimeEvent): string[] => {
  if (Array.isArray(event.schemaIds)) return event.schemaIds.filter(Boolean);
  return event.schemaId ? [event.schemaId] : [];
};

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

/**
 * Construye el payload canónico a partir del evento heredado.
 *
 * Devuelve `null` cuando el evento no trae datos suficientes: es preferible no
 * emitir a emitir un payload inventado.
 */
const toDomainEventPayload = (
  domainEventName: SisadPdfmeEventName,
  event: DesignerRuntimeEvent,
): Record<string, unknown> | null => {
  const details = (event.details || {}) as Record<string, unknown>;

  switch (domainEventName) {
    case 'selection.changed':
      return {
        ids: readSchemaIds(event),
        mode: (details.mode as string) || 'replace',
        documentId: (details.documentId as string) ?? null,
        pageNumber: asNumber(event.pageIndex, 0) + 1,
      };
    case 'page.changed':
      return {
        previous: asNumber(details.previous),
        current: asNumber(details.current ?? event.pageIndex),
        total: asNumber(details.total),
        documentId: (details.documentId as string) ?? null,
      };
    case 'zoom.changed':
      return {
        previous: asNumber(details.previous),
        current: asNumber(details.current ?? event.value),
        cause: (event.action as string) || (event.source as string) || 'runtime',
      };
    case 'viewport.fit':
      return {
        mode: ((details.mode ?? event.value) as 'page' | 'width' | 'device' | 'actual-size') || 'page',
        zoom: asNumber(details.zoom),
      };
    case 'sidebar.changed':
      return {
        side: ((details.side as 'left' | 'right') || 'right'),
        expanded: Boolean(details.expanded ?? event.value),
        presentation: ((details.presentation as 'docked' | 'overlay' | 'auto') || 'auto'),
        cause: event.action as string | undefined,
      };
    case 'interaction.phase.changed':
      return {
        previous: String(details.previous ?? ''),
        current: String(details.current ?? event.value ?? ''),
        reason: event.action as string | undefined,
      };
    case 'schema.updated': {
      const [schemaId] = readSchemaIds(event);
      if (!schemaId) return null;
      return {
        schemaId,
        documentId: (details.documentId as string) ?? null,
        pageNumber: asNumber(event.pageIndex, 0) + 1,
        patch: (event.patch || {}) as Record<string, unknown>,
        cause: (event.action as string) || (event.type as string),
      };
    }
    case 'comment.created':
    case 'comment.deleted':
    case 'comment.moved':
      return {
        commentId: String(details.commentId ?? event.value ?? ''),
        scope: String(details.scope ?? 'schema'),
        anchor: (details.anchor || {}) as Record<string, unknown>,
      };
    default:
      return null;
  }
};

/**
 * Suscribe el dispatcher al hub interno.
 *
 * @returns función para cancelar la suscripción.
 */
export const bridgeRuntimeEventHub = (
  hub: DesignerRuntimeEventHub | null | undefined,
  dispatcher: InstanceEventDispatcher,
  instanceId: string,
): (() => void) => {
  if (!hub) return () => undefined;

  return hub.subscribe((event) => {
    const domainEventName = RUNTIME_EVENT_TO_DOMAIN_EVENT[event.type];

    if (domainEventName) {
      const payload = toDomainEventPayload(domainEventName, event);
      if (!payload) return;
      dispatcher.emit(
        domainEventName,
        payload as never,
        { source: (event.source as string) || 'runtime', hostCallbackPayload: { domainEvent: event } },
      );
      return;
    }

    // Sin equivalente canónico todavía: se preserva como extensión controlada
    // en lugar de descartarlo.
    dispatcher.dispatch(
      createSisadPdfmeCustomEvent(
        `custom:${event.type}`,
        { sourceType: event.type },
        { instanceId, source: (event.source as string) || 'runtime' },
      ),
    );
  });
};
