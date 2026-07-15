import { describe, expect, test, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSisadPdfmeController } from '@/sisad-pdfme/react/useSisadPdfmeController.js';
import { createRecipientRegistry } from '@/sisad-pdfme/recipients/recipientRegistry.js';
import { useRecipientRegistry } from '@/sisad-pdfme/recipients/useRecipientRegistry.js';

const makeRegistry = () =>
  createRecipientRegistry({
    recipients: [
      { id: 'client', label: 'Cliente Principal', color: '#2563EB' },
      { id: 'guarantor', label: 'Avalista', color: '#DC2626' },
    ],
    activeRecipientId: 'client',
  });

const makeTemplate = () => ({
  basePdf: 'data:application/pdf;base64,xx',
  schemas: [
    [
      {
        id: 'schema-1',
        schemaUid: 'uid-1',
        name: 'campo_1',
        type: 'text',
        ownerRecipientId: 'client',
        locked: true,
        readOnly: false,
        position: { x: 10, y: 20 },
        width: 100,
        height: 30,
      },
      {
        id: 'schema-2',
        schemaUid: 'uid-2',
        name: 'campo_2',
        type: 'text',
        ownerRecipientId: 'client',
      },
    ],
  ],
});

const makeInstance = (template: ReturnType<typeof makeTemplate>) => {
  const instance = {
    template,
    getTemplate: vi.fn(() => instance.template),
    updateTemplate: vi.fn((next: unknown) => {
      instance.template = next as ReturnType<typeof makeTemplate>;
    }),
  };
  return instance;
};

describe('useSisadPdfmeController + RecipientRegistry', () => {
  test('métodos de recipients delegan en el registry (no no-op)', () => {
    const registry = makeRegistry();
    const instanceRef = { current: null };
    const { result } = renderHook(() =>
      useSisadPdfmeController(instanceRef, { registry }),
    );

    expect(result.current.getRecipients().map((r) => r.id)).toEqual(['client', 'guarantor']);
    expect(result.current.getActiveRecipient()?.id).toBe('client');
    expect(result.current.getRecipientById('guarantor')?.label).toBe('Avalista');

    act(() => result.current.setActiveRecipient('guarantor'));
    expect(registry.getActiveRecipientId()).toBe('guarantor');

    act(() => result.current.setRecipients([{ id: 'solo', label: 'Solo' }]));
    expect(registry.getRecipients().map((r) => r.id)).toEqual(['solo']);
  });

  test('assignSchemasToRecipient aplica el patch de owner y preserva locks', () => {
    const registry = makeRegistry();
    const instance = makeInstance(makeTemplate());
    const onAssignmentChange = vi.fn();
    const { result } = renderHook(() =>
      useSisadPdfmeController({ current: instance }, { registry, onAssignmentChange }),
    );

    act(() => result.current.assignSchemasToRecipient(['uid-1', 'schema-2'], 'guarantor'));

    expect(instance.updateTemplate).toHaveBeenCalledTimes(1);
    const nextTemplate = instance.template;
    const [first, second] = nextTemplate.schemas[0] as Array<Record<string, unknown>>;

    expect(first).toMatchObject({
      ownerRecipientId: 'guarantor',
      ownerRecipientIds: ['guarantor'],
      recipientId: 'guarantor',
      ownerRecipientName: 'Avalista',
      ownerColor: '#DC2626',
      userColor: '#DC2626',
      ownerMode: 'single',
      // Invariantes: lock y geometría intactos.
      locked: true,
      readOnly: false,
      width: 100,
      height: 30,
    });
    expect(second.ownerRecipientId).toBe('guarantor');

    expect(onAssignmentChange).toHaveBeenCalledWith({
      schemaIds: ['uid-1', 'uid-2'],
      previousRecipientId: 'client',
      nextRecipientId: 'guarantor',
    });
  });

  test('assignSchemasToRecipient ignora recipients desconocidos', () => {
    const registry = makeRegistry();
    const instance = makeInstance(makeTemplate());
    const { result } = renderHook(() =>
      useSisadPdfmeController({ current: instance }, { registry }),
    );

    act(() => result.current.assignSchemasToRecipient(['uid-1'], 'ghost'));
    expect(instance.updateTemplate).not.toHaveBeenCalled();
  });

  test('getSnapshot incluye recipients y restoreSnapshot los rehidrata', () => {
    const registry = makeRegistry();
    const instance = makeInstance(makeTemplate());
    const { result } = renderHook(() =>
      useSisadPdfmeController({ current: instance }, { registry }),
    );

    const snapshot = result.current.getSnapshot() as Record<string, unknown>;
    expect(snapshot.recipients).toHaveLength(2);
    expect(snapshot.activeRecipientId).toBe('client');
    expect((snapshot.recipientColorMap as Record<string, string>).guarantor).toBe('#DC2626');
    expect(Array.isArray(snapshot.schemas)).toBe(true);

    const freshRegistry = createRecipientRegistry({});
    const freshInstance = makeInstance(makeTemplate());
    const { result: fresh } = renderHook(() =>
      useSisadPdfmeController({ current: freshInstance }, { registry: freshRegistry }),
    );

    act(() => fresh.current.restoreSnapshot(snapshot));
    expect(freshRegistry.getRecipients().map((r) => r.id)).toEqual(['client', 'guarantor']);
    expect(freshRegistry.getActiveRecipientId()).toBe('client');
    expect(freshInstance.updateTemplate).toHaveBeenCalledWith(snapshot);
  });

  test('selection methods avisan cuando el runtime no expone soporte de selección', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const registry = makeRegistry();
    const { result } = renderHook(() =>
      useSisadPdfmeController({ current: null }, { registry }),
    );

    expect(result.current.getSelectedSchemaIds()).toEqual([]);
    result.current.selectSchemas(['schema-1']);
    result.current.clearSelection();

    expect(warn).toHaveBeenCalledWith('[sisad-pdfme] Controller method not implemented: getSelectedSchemaIds');
    expect(warn).toHaveBeenCalledWith('[sisad-pdfme] Controller method not implemented: selectSchemas');
    expect(warn).toHaveBeenCalledWith('[sisad-pdfme] Controller method not implemented: clearSelection');

    warn.mockRestore();
  });

  test('selection methods delegan en el runtime cuando existen', () => {
    const registry = makeRegistry();
    const instance = {
      ...makeInstance(makeTemplate()),
      getSelectedSchemaIds: vi.fn(() => ['uid-1', 'uid-2']),
      selectSchemas: vi.fn(),
      clearSelection: vi.fn(),
    };
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { result } = renderHook(() =>
      useSisadPdfmeController({ current: instance }, { registry }),
    );

    expect(result.current.getSelectedSchemaIds()).toEqual(['uid-1', 'uid-2']);
    act(() => result.current.selectSchemas(['uid-1'], 'add'));
    act(() => result.current.clearSelection());

    expect(instance.selectSchemas).toHaveBeenCalledWith(['uid-1'], 'add');
    expect(instance.clearSelection).toHaveBeenCalledTimes(1);
    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });
});

describe('useRecipientRegistry', () => {
  test('registra recipients del host una vez y reacciona a setActiveRecipient', () => {
    const { result } = renderHook(
      ({ recipients }: { recipients: unknown[] }) =>
        useRecipientRegistry({
          recipients,
          activeRecipientId: 'b',
        }),
      { initialProps: { recipients: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }] } },
    );

    expect(result.current.state.recipients.map((r) => r.id)).toEqual(['a', 'b']);
    expect(result.current.state.activeRecipientId).toBe('b');

    act(() => result.current.registry.setActiveRecipient('a'));
    expect(result.current.state.activeRecipientId).toBe('a');
  });

  test('recipients asíncronos re-aplican el id activo controlado', () => {
    const { result, rerender } = renderHook(
      ({ recipients }: { recipients?: unknown[] }) =>
        useRecipientRegistry({ recipients, activeRecipientId: 'late' }),
      { initialProps: { recipients: undefined as unknown[] | undefined } },
    );

    expect(result.current.state.activeRecipientId).toBeNull();

    rerender({ recipients: [{ id: 'other', label: 'Otro' }, { id: 'late', label: 'Tardío' }] });
    expect(result.current.state.activeRecipientId).toBe('late');
  });

  test('reutiliza un registry externo sin crear estado paralelo', () => {
    const shared = makeRegistry();
    const { result } = renderHook(() => useRecipientRegistry({ registry: shared }));

    expect(result.current.registry).toBe(shared);
    act(() => shared.setActiveRecipient('guarantor'));
    expect(result.current.state.activeRecipientId).toBe('guarantor');
  });
});
