/**
 * recipientColorResolver — asignación estable de colores por recipient.
 *
 * Rol arquitectónico:
 * - Reutiliza la paleta y el algoritmo del lab (`collaboration/recipientPalette`)
 *   para que el registry no invente una segunda fuente de colores.
 * - Los colores explícitos del host (hex válidos) se preservan; el resto recibe
 *   slots estables de la paleta que no colisionan con los explícitos.
 */
import {
  LAB_COLLABORATOR_PALETTE,
  decorateCollaborationUsers,
} from '@sisad-pdfme/collaboration/recipientPalette';
import type { SisadPdfmeRecipient, SisadPdfmeRecipientsConfig } from '@sisad-pdfme/recipients/recipientTypes';

export { LAB_COLLABORATOR_PALETTE };

export type RecipientColorResolverOptions = {
  strategy?: SisadPdfmeRecipientsConfig['colorStrategy'];
  palette?: readonly string[];
};

/**
 * Devuelve los recipients con color garantizado.
 *
 * - `recipient` / `auto` (default): color explícito válido o slot de paleta.
 * - `schema` / `theme`: el color lo decide el schema o el theme, así que aquí
 *   solo se preservan los colores explícitos y no se inventan nuevos.
 */
export const resolveRecipientColors = (
  recipients: SisadPdfmeRecipient[] = [],
  options: RecipientColorResolverOptions = {},
): SisadPdfmeRecipient[] => {
  const strategy = options.strategy ?? 'recipient';
  if (strategy === 'schema' || strategy === 'theme') return recipients.slice();

  // `decorateCollaborationUsers` exige index signature en su genérico.
  type IndexableRecipient = SisadPdfmeRecipient & Record<string, unknown>;
  return decorateCollaborationUsers(recipients as IndexableRecipient[], {
    palette: options.palette,
  }) as SisadPdfmeRecipient[];
};

/** Mapa id → color solo con entradas que tienen color efectivo. */
export const buildRecipientColorMap = (
  recipients: SisadPdfmeRecipient[] = [],
): Map<string, string> =>
  new Map(
    recipients
      .filter((recipient) => Boolean(recipient.id && recipient.color))
      .map((recipient) => [recipient.id, String(recipient.color)] as const),
  );
