import { describe, expect, it, vi } from 'vitest';
import { createRecipientRegistry, normalizeRecipients } from '@/sisad-pdfme/recipients/recipientRegistry';

const recipients = [
  { id: 'b', label: '', name: 'B', order: 2 },
  { id: 'a', label: 'A', order: 1 },
  { id: 'a', label: 'Duplicado', order: 0 },
  { id: 'disabled', label: 'Disabled', disabled: true },
] as any;

describe('recipientRegistry', () => {
  it('normaliza, deduplica y ordena recipients', () => {
    const result = normalizeRecipients(recipients);
    expect(result.map((item) => item.id)).toEqual(['a', 'b', 'disabled']);
    expect(result.find((item) => item.id === 'b')?.label).toBe('B');
  });

  it('selecciona el primer recipient como fallback y expone lookups', () => {
    const registry = createRecipientRegistry({ recipients });
    expect(registry.getActiveRecipientId()).toBe('a');
    expect(registry.getRecipient('b')?.label).toBe('B');
    expect(registry.getRecipientColor('a')).toMatch(/^#/);
    expect(registry.getAssignableRecipients().map((item) => item.id)).not.toContain('disabled');
  });

  it('defaultOwnerStrategy none no elige fallback', () => {
    const registry = createRecipientRegistry({
      recipients,
      config: { defaultOwnerStrategy: 'none' } as any,
    });
    expect(registry.getActiveRecipient()).toBeNull();
  });

  it('emite cambios, conserva activo si existe y aplica fallback si desaparece', () => {
    const onActiveRecipientChange = vi.fn();
    const onRecipientsChange = vi.fn();
    const registry = createRecipientRegistry({
      recipients,
      events: { onActiveRecipientChange, onRecipientsChange },
    });
    const subscriber = vi.fn();
    const unsubscribe = registry.subscribe(subscriber);

    registry.setActiveRecipient('b');
    expect(registry.getActiveRecipientId()).toBe('b');
    expect(onActiveRecipientChange).toHaveBeenCalled();

    registry.setRecipients([
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
    ] as any);
    expect(registry.getActiveRecipientId()).toBe('b');

    registry.setRecipients([{ id: 'c', label: 'C' }] as any);
    expect(registry.getActiveRecipientId()).toBe('c');
    expect(onRecipientsChange).toHaveBeenCalled();
    expect(subscriber).toHaveBeenCalled();

    unsubscribe();
  });

  it('roundtrip de snapshot conserva recipients y activo', () => {
    const source = createRecipientRegistry({ recipients, activeRecipientId: 'b' });
    const snapshot = source.toSnapshot();
    const restored = createRecipientRegistry();
    restored.restoreSnapshot(snapshot);

    expect(restored.getRecipients().map((item) => item.id)).toEqual(['a', 'b', 'disabled']);
    expect(restored.getActiveRecipientId()).toBe('b');
  });
});
