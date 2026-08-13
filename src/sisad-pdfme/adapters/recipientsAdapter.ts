import type { SisadPdfmeRecipientsAdapter } from '../config/SisadPdfmeConfig.js';

export type {  SisadPdfmeRecipientsAdapter };

export const createRecipientsAdapter = <THostUser = unknown>(): SisadPdfmeRecipientsAdapter<THostUser> => ({
  toRecipient(input) {
    if (input && typeof input === 'object') {
      const record = input as Record<string, unknown>;
      const id = String(record.id ?? record.recipientId ?? record.userId ?? '').trim();
      const label = String(record.label ?? record.name ?? record.fullName ?? id).trim();
      return {
        id: id || label || 'recipient',
        label: label || id || 'Recipient',
        role: String(record.role ?? '').trim() || undefined,
        // El host puede nombrar el correo `email` o `emailAddress`.
        email: String(record.email ?? record.emailAddress ?? '').trim() || undefined,
        company: String(record.company ?? '').trim() || undefined,
        title: String(record.title ?? '').trim() || undefined,
        color: String(record.color ?? '').trim() || undefined,
        metadata: record,
      };
    }
    const value = String(input ?? '').trim();
    return { id: value || 'recipient', label: value || 'Recipient' };
  },
  toRecipients(input) {
    return Array.isArray(input) ? input.map((entry) => this.toRecipient(entry)) : [];
  },
});
