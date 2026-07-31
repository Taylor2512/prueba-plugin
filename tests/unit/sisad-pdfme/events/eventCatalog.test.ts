/**
 * COREUX-005 — Catálogo tipado y versionado de eventos.
 *
 * Verifica lo que la task-card exige: cobertura de
 * `reports/core-ux/03-EVENT-CATALOG.md`, payloads serializables y guards.
 */
import { describe, expect, it } from 'vitest';
import {
  SISAD_PDFME_EVENTS,
  SISAD_PDFME_EVENT_DOMAIN_BY_NAME,
  SISAD_PDFME_EVENT_NAMES,
  SISAD_PDFME_EVENT_VERSION,
  createSisadPdfmeCustomEvent,
  createSisadPdfmeEvent,
  isSisadPdfmeCustomEventName,
  isSisadPdfmeEvent,
  isSisadPdfmeEventName,
  isSisadPdfmeEventOf,
} from '@/sisad-pdfme/contracts/events';

/** Los 45 eventos declarados en el catálogo canónico del análisis. */
const CANONICAL_EVENTS = [
  'designer.ready', 'designer.disposed', 'designer.error',
  'config.changed',
  'template.changed',
  'schema.added', 'schema.updated', 'schema.removed', 'schema.duplicated', 'schema.reordered',
  'selection.changed',
  'interaction.phase.changed', 'inline-edit.started', 'inline-edit.committed', 'inline-edit.cancelled',
  'page.changed', 'zoom.changed', 'viewport.fit',
  'sidebar.changed', 'right-panel.changed', 'view-feature.changed',
  'recipient.registry.changed', 'recipient.active.changed',
  'assignment.changed',
  'document.added', 'document.changed', 'document.reordered', 'document.removed',
  'comment.created', 'comment.replied', 'comment.resolved', 'comment.reopened', 'comment.moved', 'comment.deleted',
  'signature.requested', 'signature.completed', 'signature.failed',
  'validation.completed',
  'save.requested', 'save.started', 'save.succeeded', 'save.failed',
  'export.started', 'export.succeeded', 'export.failed',
];

const context = { instanceId: 'inst-1' };

describe('catálogo de eventos', () => {
  it('cubre exactamente el catálogo canónico del análisis', () => {
    expect([...SISAD_PDFME_EVENT_NAMES].sort()).toEqual([...CANONICAL_EVENTS].sort());
    expect(SISAD_PDFME_EVENT_NAMES).toHaveLength(45);
  });

  it('no repite un nombre entre dominios', () => {
    expect(new Set(SISAD_PDFME_EVENT_NAMES).size).toBe(SISAD_PDFME_EVENT_NAMES.length);
  });

  it('asigna dominio a todos los nombres', () => {
    SISAD_PDFME_EVENT_NAMES.forEach((name) => {
      expect(SISAD_PDFME_EVENT_DOMAIN_BY_NAME[name]).toBeDefined();
      expect(SISAD_PDFME_EVENTS[SISAD_PDFME_EVENT_DOMAIN_BY_NAME[name]]).toContain(name);
    });
  });
});

describe('sobre del evento', () => {
  it('incluye version, eventId, timestamp e instanceId', () => {
    const event = createSisadPdfmeEvent('page.changed', { previous: 1, current: 2, total: 11 }, context);

    expect(event.name).toBe('page.changed');
    expect(event.domain).toBe('navigation');
    expect(event.version).toBe(SISAD_PDFME_EVENT_VERSION);
    expect(event.instanceId).toBe('inst-1');
    expect(typeof event.eventId).toBe('string');
    expect(typeof event.timestamp).toBe('number');
    expect(event.payload).toEqual({ previous: 1, current: 2, total: 11 });
  });

  it('genera eventId único por evento', () => {
    const ids = Array.from({ length: 50 }, () =>
      createSisadPdfmeEvent('save.started', {}, context).eventId,
    );

    expect(new Set(ids).size).toBe(50);
  });

  it('propaga correlationId solo cuando se entrega', () => {
    const withId = createSisadPdfmeEvent('save.succeeded', { revision: 3 }, {
      ...context,
      correlationId: 'corr-9',
    });
    const withoutId = createSisadPdfmeEvent('save.succeeded', { revision: 3 }, context);

    expect(withId.correlationId).toBe('corr-9');
    expect(withoutId).not.toHaveProperty('correlationId');
  });

  it('produce payloads serializables', () => {
    const events = [
      createSisadPdfmeEvent('selection.changed', { ids: ['a', 'b'], mode: 'replace' }, context),
      createSisadPdfmeEvent('assignment.changed', { schemaIds: ['a'], previousOwnerIds: [], ownerId: 'bob' }, context),
      createSisadPdfmeEvent('designer.error', { code: 'E1', message: 'boom', recoverable: true }, context),
    ];

    events.forEach((event) => {
      const roundTrip = JSON.parse(JSON.stringify(event));
      expect(roundTrip).toEqual(event);
      // structuredClone es lo que usa el config service; un payload no
      // serializable rompería el montaje igual que `config.events` con función.
      expect(() => structuredClone(event)).not.toThrow();
    });
  });
});

describe('guards', () => {
  it('reconoce nombres canónicos y rechaza los inventados', () => {
    expect(isSisadPdfmeEventName('zoom.changed')).toBe(true);
    expect(isSisadPdfmeEventName('zoom.changedd')).toBe(false);
    expect(isSisadPdfmeEventName(42)).toBe(false);
  });

  it('acepta extensiones custom con prefijo y rechaza string libre', () => {
    expect(isSisadPdfmeCustomEventName('custom:host.metric')).toBe(true);
    expect(isSisadPdfmeCustomEventName('custom:')).toBe(false);
    expect(isSisadPdfmeCustomEventName('host.metric')).toBe(false);
  });

  it('valida el sobre completo', () => {
    const event = createSisadPdfmeEvent('template.changed', { revision: 1, cause: 'edit', changedSchemaIds: [] }, context);

    expect(isSisadPdfmeEvent(event)).toBe(true);
    expect(isSisadPdfmeEvent({ name: 'template.changed' })).toBe(false);
    expect(isSisadPdfmeEvent(null)).toBe(false);
  });

  it('estrecha por nombre', () => {
    const zoom = createSisadPdfmeEvent('zoom.changed', { previous: 1, current: 2, cause: 'ctl' }, context);

    expect(isSisadPdfmeEventOf('zoom.changed', zoom)).toBe(true);
    expect(isSisadPdfmeEventOf('page.changed', zoom)).toBe(false);
  });

  it('admite eventos custom con sobre válido', () => {
    const custom = createSisadPdfmeCustomEvent('custom:host.metric', { value: 3 }, context);

    expect(custom.domain).toBe('custom');
    expect(isSisadPdfmeEvent(custom)).toBe(true);
    expect(isSisadPdfmeEventName(custom.name)).toBe(false);
  });
});
