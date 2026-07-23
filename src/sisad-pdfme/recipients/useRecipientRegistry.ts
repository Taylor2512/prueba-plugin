/**
 * useRecipientRegistry — puente React para el registry.
 *
 * Rol arquitectónico:
 * - Crea (o reutiliza, si el Provider ya expone uno) un RecipientRegistry y lo
 *   mantiene sincronizado con las props del host: `recipients` crudos pasan por
 *   el adapter UNA vez y se registran; `activeRecipientId` controlado se aplica
 *   al registry.
 * - Expone el estado vía `useSyncExternalStore`, de modo que cualquier memo que
 *   dependa de `state` (p. ej. las options del runtime) se recalcule cuando el
 *   registry cambie — así `setActiveRecipient` fluye hasta el Designer montado.
 */
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { createRecipientRegistry } from './recipientRegistry.js';
import type {
  SisadPdfmeRecipient,
  SisadPdfmeRecipientRegistry,
  SisadPdfmeRecipientRegistryState,
  SisadPdfmeRecipientsConfig,
} from './recipientTypes.js';

type RecipientsAdapterLike = {
  toRecipients(input: unknown[]): SisadPdfmeRecipient[];
};

export type UseRecipientRegistryOptions = {
  /** Registry ya creado (p. ej. por SisadPdfmeProvider). Si falta, se crea uno. */
  registry?: SisadPdfmeRecipientRegistry | null;
  /** Recipients crudos del host; se convierten con `adapter` y se registran. */
  recipients?: unknown[];
  adapter?: RecipientsAdapterLike;
  config?: SisadPdfmeRecipientsConfig;
  /** Id activo controlado por el host (prop/config). */
  activeRecipientId?: string | null;
};

export type UseRecipientRegistryResult = {
  registry: SisadPdfmeRecipientRegistry;
  state: SisadPdfmeRecipientRegistryState;
};

const identityAdapter: RecipientsAdapterLike = {
  toRecipients: (input) => (Array.isArray(input) ? (input as SisadPdfmeRecipient[]) : []),
};

export const useRecipientRegistry = (
  options: UseRecipientRegistryOptions = {},
): UseRecipientRegistryResult => {
  const externalRegistry = options.registry ?? null;
  // Lazy-init estable: si no hay registry externo (Provider), se crea uno local
  // una sola vez con la config del primer render.
  const [fallbackRegistry] = useState<SisadPdfmeRecipientRegistry>(() =>
    createRecipientRegistry({
      config: options.config,
      activeRecipientId: options.activeRecipientId ?? null,
    }),
  );
  const registry = externalRegistry ?? fallbackRegistry;

  const adapter = options.adapter ?? identityAdapter;
  const rawRecipients = options.recipients;

  // Registro único: el host entrega crudos; el core normaliza y registra.
  // Si el host controla `activeRecipientId`, se re-aplica tras registrar para
  // cubrir recipients que llegan de forma asíncrona después del primer render.
  const controlledActiveId = options.activeRecipientId;
  useEffect(() => {
    if (Array.isArray(rawRecipients)) {
      registry.setRecipients(adapter.toRecipients(rawRecipients));
    }
    if (controlledActiveId !== undefined) {
      registry.setActiveRecipient(controlledActiveId);
    }
  }, [registry, adapter, rawRecipients, controlledActiveId]);

  const subscribe = useMemo(
    () => (onStoreChange: () => void) => registry.subscribe(onStoreChange),
    [registry],
  );
  const state = useSyncExternalStore(subscribe, registry.getState, registry.getState);

  return { registry, state };
};
