export const RECIPIENTS = [
  { id: 'recipient-1', label: 'Cliente Principal', name: 'Cliente Principal', role: 'signer', order: 1, color: '#2563eb' },
  { id: 'recipient-2', label: 'Analista', name: 'Analista', role: 'signer', order: 2, color: '#d946ef' },
  { id: 'recipient-3', label: 'Mesa de entrega', name: 'Mesa de entrega', role: 'coordinator', order: 3, color: '#f97316' },
];

export const schema = (overrides: Record<string, unknown> = {}) => ({
  id: 'schema-1',
  schemaUid: 'schema-1',
  name: 'contract_name',
  type: 'text',
  position: { x: 10, y: 10 },
  width: 50,
  height: 10,
  fileId: 'file-a',
  fileTemplateId: 'file-a',
  pageNumber: 1,
  ownerRecipientId: 'recipient-1',
  recipientId: 'recipient-1',
  required: false,
  ...overrides,
});

export const template = (pages: any[][] = [[schema()]]) => ({
  basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] },
  schemas: pages,
});

export const assignmentMap = () => ({
  'recipient-1': {
    'file-a': {
      '1': ['schema-1', 'schema-2'],
      '2': ['schema-3'],
    },
  },
  'recipient-2': {
    'file-a': {
      '1': ['schema-4'],
    },
  },
});
