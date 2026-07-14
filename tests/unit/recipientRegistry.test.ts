import { describe, expect, test, vi } from 'vitest';
import {
  createRecipientRegistry,
  normalizeRecipients,
} from '@/sisad-pdfme/recipients/recipientRegistry.js';
import { LAB_COLLABORATOR_PALETTE } from '@/sisad-pdfme/recipients/recipientColorResolver.js';
import type { SisadPdfmeRecipient } from '@/sisad-pdfme/recipients/recipientTypes.js';

const baseRecipients: SisadPdfmeRecipient[] = [
  { id: 'client', label: 'Cliente Principal' },
  { id: 'guarantor', label: 'Avalista', color: '#DC2626' },
  { id: 'desk', label: 'Mesa de entrega', role: 'viewer' },
];

describe('normalizeRecipients', () => {
  test('deduplica por id, limpia textos y ordena por order', () => {
    const result = normalizeRecipients([
      { id: ' b ', label: ' B ', order: 2 },
      { id: 'a', label: 'A', order: 1 },
      { id: 'b', label: 'B duplicado' },
      { id: '', label: 'sin id' },
      { id: 'c', label: '' },
    ]);

    expect(result.map((r) => r.id)).toEqual(['a', 'b', 'c']);
    // La primera entrada de 'b' gana sobre el duplicado y llega ya sin espacios.
    expect(result[1].label).toBe('B');
    // Sin label usable cae al id.
    expect(result[2].label).toBe('c');
  });
});

describe('createRecipientRegistry', () => {
  test('registra una vez y asigna colores de paleta estables', () => {
    const registry = createRecipientRegistry({ recipients: baseRecipients });
    const recipients = registry.getRecipients();

    // Color explícito preservado; el resto recibe slots de paleta sin colisión.
    expect(registry.getRecipientColor('guarantor')).toBe('#DC2626');
    expect(recipients.every((r) => Boolean(r.color))).toBe(true);
    expect(new Set(recipients.map((r) => r.color)).size).toBe(recipients.length);
    recipients
      .filter((r) => r.id !== 'guarantor')
      .forEach((r) => expect(LAB_COLLABORATOR_PALETTE).toContain(r.color));
  });

  test('resuelve activeRecipient solicitado y cae al primero si falta', () => {
    const withRequested = createRecipientRegistry({
      recipients: baseRecipients,
      activeRecipientId: 'guarantor',
    });
    expect(withRequested.getActiveRecipientId()).toBe('guarantor');
    expect(withRequested.getActiveRecipientColor()).toBe('#DC2626');

    const withMissing = createRecipientRegistry({
      recipients: baseRecipients,
      activeRecipientId: 'ghost',
    });
    expect(withMissing.getActiveRecipientId()).toBe('client');
  });

  test("estrategia 'none' no elige fallback automático", () => {
    const registry = createRecipientRegistry({
      recipients: baseRecipients,
      config: { defaultOwnerStrategy: 'none' },
    });
    expect(registry.getActiveRecipientId()).toBeNull();
    expect(registry.getActiveRecipient()).toBeNull();
  });

  test('setRecipients conserva el activo si sigue existiendo y cae si desaparece', () => {
    const registry = createRecipientRegistry({
      recipients: baseRecipients,
      activeRecipientId: 'guarantor',
    });

    registry.setRecipients([
      { id: 'guarantor', label: 'Avalista' },
      { id: 'new', label: 'Nuevo' },
    ]);
    expect(registry.getActiveRecipientId()).toBe('guarantor');

    registry.setRecipients([{ id: 'other', label: 'Otro' }]);
    expect(registry.getActiveRecipientId()).toBe('other');
  });

  test('emite onRecipientsChange/onActiveRecipientChange y notifica subscribers', () => {
    const onRecipientsChange = vi.fn();
    const onActiveRecipientChange = vi.fn();
    const registry = createRecipientRegistry({
      recipients: baseRecipients,
      activeRecipientId: 'client',
      events: { onRecipientsChange, onActiveRecipientChange },
    });

    const listener = vi.fn();
    const unsubscribe = registry.subscribe(listener);

    registry.setActiveRecipient('guarantor');
    expect(onActiveRecipientChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'guarantor' }),
    );
    expect(listener).toHaveBeenCalledTimes(1);

    registry.setRecipients([{ id: 'solo', label: 'Solo' }]);
    expect(onRecipientsChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'solo' }),
    ]);

    unsubscribe();
    registry.setActiveRecipient(null);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  test('setRecipients con contenido idéntico no emite', () => {
    const registry = createRecipientRegistry({ recipients: baseRecipients });
    const listener = vi.fn();
    registry.subscribe(listener);

    registry.setRecipients(registry.getRecipients());
    expect(listener).not.toHaveBeenCalled();
  });

  test('setActiveRecipient con id inexistente limpia el activo', () => {
    const registry = createRecipientRegistry({
      recipients: baseRecipients,
      activeRecipientId: 'client',
    });
    registry.setActiveRecipient('ghost');
    expect(registry.getActiveRecipientId()).toBeNull();
  });

  test('getAssignableRecipients excluye disabled', () => {
    const registry = createRecipientRegistry({
      recipients: [...baseRecipients, { id: 'off', label: 'Inactivo', disabled: true }],
    });
    expect(registry.getAssignableRecipients().map((r) => r.id)).toEqual([
      'client',
      'guarantor',
      'desk',
    ]);
  });

  test('snapshot roundtrip preserva recipients, activo y mapas', () => {
    const registry = createRecipientRegistry({
      recipients: baseRecipients,
      activeRecipientId: 'guarantor',
    });
    const snapshot = registry.toSnapshot();

    expect(snapshot.activeRecipientId).toBe('guarantor');
    expect(snapshot.recipients).toHaveLength(3);
    expect(snapshot.recipients[1]).toMatchObject({ id: 'guarantor', name: 'Avalista', color: '#DC2626' });
    expect(snapshot.recipientColorMap.guarantor).toBe('#DC2626');
    expect(snapshot.recipientNameMap.client).toBe('Cliente Principal');

    const restored = createRecipientRegistry({});
    restored.restoreSnapshot(snapshot);
    expect(restored.getRecipients().map((r) => r.id)).toEqual(['client', 'guarantor', 'desk']);
    expect(restored.getActiveRecipientId()).toBe('guarantor');
    expect(restored.getRecipientLabel('desk')).toBe('Mesa de entrega');
  });

  test('restoreSnapshot ignora snapshots sin sección de recipients', () => {
    const registry = createRecipientRegistry({ recipients: baseRecipients });
    registry.restoreSnapshot({ schemas: [[]] });
    expect(registry.getRecipients()).toHaveLength(3);
  });
});
