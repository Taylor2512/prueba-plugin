export const normalizeString = (value, fallback = '') =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

export const normalizeRecipient = (recipient, index) => {
  const id = normalizeString(recipient?.id, `recipient-${index + 1}`);
  const name = normalizeString(
    recipient?.name ?? recipient?.label ?? '',
    id,
  );
  return { ...recipient, id, name };
};

export const normalizeRecipients = (recipients, mapper = normalizeRecipient) =>
  (Array.isArray(recipients) ? recipients : []).map(mapper);
