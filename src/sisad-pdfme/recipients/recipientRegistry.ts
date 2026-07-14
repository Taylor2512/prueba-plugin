/**
 * recipientRegistry — fuente única de verdad de recipients del core.
 *
 * Rol arquitectónico:
 * - El host entrega recipients UNA vez (prop o adapter); aquí se normalizan,
 *   deduplican, ordenan y reciben color estable.
 * - Todo lo demás (collaborationContext, assignment, Form runtime, snapshot,
 *   controller, eventos) se deriva de este estado — nunca de props sueltos.
 *
 * Reglas clave:
 * - Estado inmutable por emisión: cada cambio produce un nuevo state object.
 * - `setRecipients` conserva el activeRecipient si sigue existiendo.
 * - La resolución del activo respeta `defaultOwnerStrategy` ('none' no elige
 *   fallback automático).
 */
import { resolveRecipientColors, buildRecipientColorMap } from './recipientColorResolver.js';
import { recipientsToSnapshot, recipientsFromSnapshot } from './recipientSnapshot.js';
import type {
  SisadPdfmeRecipient,
  SisadPdfmeRecipientRegistry,
  SisadPdfmeRecipientRegistryEvents,
  SisadPdfmeRecipientRegistryState,
  SisadPdfmeRecipientsConfig,
  SisadPdfmeRecipientsSnapshot,
} from './recipientTypes.js';

const normalizeText = (value: unknown) => String(value ?? '').trim();

/** Normaliza, deduplica por id y ordena (order asc, estable) una lista cruda. */
export const normalizeRecipients = (
  recipients: SisadPdfmeRecipient[] = [],
): SisadPdfmeRecipient[] => {
  const byId = new Map<string, SisadPdfmeRecipient>();

  (Array.isArray(recipients) ? recipients : []).forEach((entry) => {
    if (!entry || typeof entry !== 'object') return;
    const id = normalizeText(entry.id);
    const label = normalizeText(entry.label) || normalizeText(entry.name) || id;
    if (!id || byId.has(id)) return;

    byId.set(id, {
      ...entry,
      id,
      label: label || 'Recipient',
      name: normalizeText(entry.name) || undefined,
      role: normalizeText(entry.role) || undefined,
      email: normalizeText(entry.email) || undefined,
      color: normalizeText(entry.color) || undefined,
      order: typeof entry.order === 'number' && Number.isFinite(entry.order) ? entry.order : undefined,
      disabled: entry.disabled === true ? true : undefined,
    });
  });

  return Array.from(byId.values()).sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
    const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
};

export type CreateRecipientRegistryOptions = {
  recipients?: SisadPdfmeRecipient[];
  activeRecipientId?: string | null;
  config?: SisadPdfmeRecipientsConfig;
  events?: SisadPdfmeRecipientRegistryEvents;
};

/** Igualdad superficial de listas normalizadas (evita emisiones espurias). */
const sameRecipients = (a: SisadPdfmeRecipient[], b: SisadPdfmeRecipient[]) =>
  a.length === b.length &&
  a.every((recipient, index) => {
    const other = b[index];
    return (
      recipient.id === other.id &&
      recipient.label === other.label &&
      recipient.color === other.color &&
      recipient.role === other.role &&
      recipient.email === other.email &&
      recipient.order === other.order &&
      recipient.disabled === other.disabled
    );
  });

const buildState = (
  recipients: SisadPdfmeRecipient[],
  activeRecipientId: string | null,
): SisadPdfmeRecipientRegistryState => {
  const byId = new Map(recipients.map((recipient) => [recipient.id, recipient] as const));
  const activeRecipient = (activeRecipientId && byId.get(activeRecipientId)) || null;

  return {
    recipients,
    byId,
    activeRecipientId: activeRecipient ? activeRecipient.id : null,
    activeRecipient,
    colorById: buildRecipientColorMap(recipients),
    labelById: new Map(recipients.map((recipient) => [recipient.id, recipient.label] as const)),
  };
};

export const createRecipientRegistry = (
  options: CreateRecipientRegistryOptions = {},
): SisadPdfmeRecipientRegistry => {
  const config = options.config ?? {};
  const events = options.events ?? {};
  const listeners = new Set<(state: SisadPdfmeRecipientRegistryState) => void>();

  /**
   * Resuelve el id activo efectivo: el solicitado si existe; si no, el fallback
   * según estrategia (`none` no elige a nadie automáticamente).
   */
  const resolveActiveId = (
    recipients: SisadPdfmeRecipient[],
    requestedId: string | null,
  ): string | null => {
    const normalized = normalizeText(requestedId);
    if (normalized && recipients.some((recipient) => recipient.id === normalized)) {
      return normalized;
    }
    if (config.defaultOwnerStrategy === 'none') return null;
    // 'active-recipient' sin id válido y 'first-recipient' caen al primero.
    return recipients[0]?.id ?? null;
  };

  const prepare = (recipients: SisadPdfmeRecipient[]) =>
    resolveRecipientColors(normalizeRecipients(recipients), {
      strategy: config.colorStrategy,
    });

  const initialRecipients = prepare(options.recipients ?? []);
  let state = buildState(
    initialRecipients,
    resolveActiveId(initialRecipients, options.activeRecipientId ?? config.activeRecipientId ?? null),
  );

  const emit = (previous: SisadPdfmeRecipientRegistryState) => {
    listeners.forEach((listener) => listener(state));
    if (previous.recipients !== state.recipients) {
      events.onRecipientsChange?.(state.recipients);
    }
    if (previous.activeRecipientId !== state.activeRecipientId) {
      events.onActiveRecipientChange?.(state.activeRecipient);
    }
  };

  const registry: SisadPdfmeRecipientRegistry = {
    getState: () => state,
    getRecipients: () => state.recipients,
    getRecipient: (recipientId) => state.byId.get(normalizeText(recipientId)) ?? null,
    getAssignableRecipients: () => state.recipients.filter((recipient) => recipient.disabled !== true),
    getActiveRecipient: () => state.activeRecipient,
    getActiveRecipientId: () => state.activeRecipientId,
    getActiveRecipientColor: () => state.activeRecipient?.color ?? null,
    getRecipientColor: (recipientId) => state.colorById.get(normalizeText(recipientId)) ?? null,
    getRecipientLabel: (recipientId) => state.labelById.get(normalizeText(recipientId)) ?? null,

    setRecipients: (recipients) => {
      const previous = state;
      const nextRecipients = prepare(recipients);
      const nextActiveId = resolveActiveId(nextRecipients, state.activeRecipientId);
      if (sameRecipients(state.recipients, nextRecipients) && nextActiveId === state.activeRecipientId) {
        return;
      }
      state = buildState(nextRecipients, nextActiveId);
      emit(previous);
    },

    setActiveRecipient: (recipientId) => {
      const previous = state;
      const normalized = normalizeText(recipientId);
      const nextActiveId = normalized && state.byId.has(normalized) ? normalized : null;
      if (nextActiveId === state.activeRecipientId) return;
      state = buildState(state.recipients, nextActiveId);
      emit(previous);
    },

    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    toSnapshot: (): SisadPdfmeRecipientsSnapshot => recipientsToSnapshot(state),

    restoreSnapshot: (snapshot) => {
      const restored = recipientsFromSnapshot(snapshot);
      if (!restored) return;
      const previous = state;
      const nextRecipients = prepare(restored.recipients);
      const nextActiveId = resolveActiveId(nextRecipients, restored.activeRecipientId);
      state = buildState(nextRecipients, nextActiveId);
      emit(previous);
    },
  };

  return registry;
};
