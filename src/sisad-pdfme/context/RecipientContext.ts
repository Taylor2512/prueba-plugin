/**
 * FASE 5 — Destinatario activo y propagación de color
 *
 * Fuente de verdad del color: DigitalAgreements — sisad-pdfme la recibe como prop
 * y la cachea en RecipientContext para lookups rápidos.
 *
 * Regla clave: cambiar el activeRecipient en el panel NO muta schemas existentes.
 * Solo los schemas NUEVOS creados a partir de ese momento heredan el destinatario activo.
 * La reasignación de schemas existentes requiere schema.assign_recipient explícito.
 *
 * "Sin destinatario asignado": borde gris #CBD5E0, label "Sin asignar" en inspector.
 */
import { createContext, useContext } from 'react';

export interface Recipient {
  id: string;
  name: string;
  /** Hex — fuente de verdad en DigitalAgreements, recibida como prop */
  color: string;
  /** Nombre legible del color para accesibilidad. Ej: "Azul marino" */
  colorLabel?: string;
  role?: string;
  isActive: boolean;
}

/** Color por defecto para schemas sin destinatario asignado */
export const UNASSIGNED_SCHEMA_COLOR = '#CBD5E0';
export const UNASSIGNED_SCHEMA_LABEL = 'Sin asignar';

export interface RecipientContextValue {
  /** Destinatario activo en el panel (afecta schemas nuevos, no los existentes) */
  activeRecipient: Recipient | null;
  /** Lista completa — inyectada por DigitalAgreements como prop */
  recipients: Recipient[];
  setActiveRecipient(id: string): void;
  getRecipientById(id: string): Recipient | undefined;
  /** Retorna el color del recipient, o el color de "sin asignar" como fallback */
  getColorForRecipient(id: string | undefined): string;
}

/** Valor inicial seguro para tests y renderizados antes de mount */
export const defaultRecipientContext: RecipientContextValue = {
  activeRecipient: null,
  recipients: [],
  setActiveRecipient: () => undefined,
  getRecipientById: () => undefined,
  getColorForRecipient: () => UNASSIGNED_SCHEMA_COLOR,
};

export const RecipientContext = createContext<RecipientContextValue>(
  defaultRecipientContext,
);

/** Hook tipado para consumir RecipientContext */
export function useRecipientContext(): RecipientContextValue {
  return useContext(RecipientContext);
}

/**
 * Crea el valor del contexto a partir de la lista de recipients.
 * Se usa dentro del Provider del designer.
 *
 * @param recipients Lista inyectada por DigitalAgreements como prop
 * @param activeRecipientId ID del recipient activo inicial
 * @param onActiveChange Callback para notificar al padre cuando cambia el activo
 */
export function buildRecipientContextValue(
  recipients: Recipient[],
  activeRecipientId: string | undefined,
  onActiveChange?: (id: string) => void,
  setActiveState?: (id: string) => void,
): RecipientContextValue {
  const recipientMap = new Map(recipients.map((r) => [r.id, r]));
  const activeRecipient = activeRecipientId
    ? (recipientMap.get(activeRecipientId) ?? null)
    : null;

  return {
    activeRecipient,
    recipients,
    setActiveRecipient: (id: string) => {
      setActiveState?.(id);
      onActiveChange?.(id);
    },
    getRecipientById: (id: string) => recipientMap.get(id),
    getColorForRecipient: (id: string | undefined) => {
      if (!id) return UNASSIGNED_SCHEMA_COLOR;
      return recipientMap.get(id)?.color ?? UNASSIGNED_SCHEMA_COLOR;
    },
  };
}

/**
 * Reconcilia el color de un recipient tras un cambio de DigitalAgreements.
 *
 * Regla: si SnapshotRecipient.color difiere de __designer.recipientColor,
 * SnapshotRecipient.color gana (fue editado después del último guardado).
 * Llamar al cargar un snapshot o al recibir una nueva lista de recipients.
 */
export function reconcileRecipientColor(
  schemaRecipientId: string | undefined,
  schemaRecipientColor: string | undefined,
  recipients: Recipient[],
): string | undefined {
  if (!schemaRecipientId) return undefined;
  const resolvedRecipient = recipients.find((r) => r.id === schemaRecipientId);
  // Si el recipient fue eliminado, conservar el color del schema
  if (!resolvedRecipient) return schemaRecipientColor;
  // El color resuelto del recipient siempre gana
  return resolvedRecipient.color;
}
