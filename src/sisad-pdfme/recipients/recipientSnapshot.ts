/**
 * recipientSnapshot — serialización/rehidratación de recipients.
 *
 * Rol arquitectónico:
 * - Produce la sección de recipients de un snapshot en el formato compatible
 *   con `SnapshotRecipient` (`shared/snapshot.ts`): { id, name, color, role, order }.
 * - Rehidrata desde snapshots  ({ recipients, activeRecipientId }) o desde
 *   cualquier objeto con esa forma, tolerando campos faltantes.
 */
import type {
  SisadPdfmeRecipient,
  SisadPdfmeRecipientRegistryState,
  SisadPdfmeRecipientsSnapshot,
} from '@sisad-pdfme/recipients/recipientTypes';

const normalizeRecipientSnapshotText = (value: unknown) => String(value ?? '').trim();

/** Serializa el estado del registry a la sección de recipients del snapshot. */
export const recipientsToSnapshot = (
  state: SisadPdfmeRecipientRegistryState,
): SisadPdfmeRecipientsSnapshot => ({
  recipients: state.recipients.map((recipient) => ({
    id: recipient.id,
    name: recipient.label,
    color: recipient.color ?? '',
    ...(recipient.role ? { role: recipient.role } : {}),
    ...(typeof recipient.order === 'number' ? { order: recipient.order } : {}),
  })),
  activeRecipientId: state.activeRecipientId,
  recipientColorMap: Object.fromEntries(state.colorById),
  recipientNameMap: Object.fromEntries(state.labelById),
});

/**
 * Extrae recipients + activeRecipientId desde un snapshot arbitrario.
 * Devuelve null si el valor no contiene una sección de recipients usable.
 */
export const recipientsFromSnapshot = (
  snapshot: unknown,
): { recipients: SisadPdfmeRecipient[]; activeRecipientId: string | null } | null => {
  if (!snapshot || typeof snapshot !== 'object') return null;
  const record = snapshot as Record<string, unknown>;
  const rawRecipients = record.recipients;
  if (!Array.isArray(rawRecipients)) return null;

  const recipients = rawRecipients
    .map((entry): SisadPdfmeRecipient | null => {
      if (!entry || typeof entry !== 'object') return null;
      const candidate = entry as Record<string, unknown>;
      const id = normalizeRecipientSnapshotText(candidate.id);
      if (!id) return null;
      return {
        id,
        label: normalizeRecipientSnapshotText(candidate.label ?? candidate.name) || id,
        role: normalizeRecipientSnapshotText(candidate.role) || undefined,
        email: normalizeRecipientSnapshotText(candidate.email) || undefined,
        color: normalizeRecipientSnapshotText(candidate.color) || undefined,
        order:
          typeof candidate.order === 'number' && Number.isFinite(candidate.order)
            ? candidate.order
            : undefined,
      };
    })
    .filter((entry): entry is SisadPdfmeRecipient => entry !== null);

  return {
    recipients,
    activeRecipientId: normalizeRecipientSnapshotText(record.activeRecipientId) || null,
  };
};
