import type { SnapshotRecipient } from '../../../src/sisad-pdfme/shared/snapshot.js';
import { stableId } from './_shared.js';

export interface RecipientFactoryOptions {
  id?: string;
  name?: string;
  color?: string;
  role?: string;
  order?: number;
  variant?: string;
}

export function makeRecipient(options: RecipientFactoryOptions = {}): SnapshotRecipient {
  const name = options.name ?? 'Cliente';
  const variant = options.variant ? `-${options.variant}` : '';

  return {
    id: options.id ?? stableId('rec', name, variant),
    name,
    color: options.color ?? '#3B82F6',
    role: options.role,
    order: options.order ?? 0,
  };
}

export function makeRecipients(count = 1): SnapshotRecipient[] {
  return Array.from({ length: count }, (_, index) => makeRecipient({
    name: `Recipient ${index + 1}`,
    id: `rec-${index + 1}`,
    order: index,
    color: index % 2 === 0 ? '#3B82F6' : '#10B981',
  }));
}
